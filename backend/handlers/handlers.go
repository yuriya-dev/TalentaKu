package handlers

import (
	"encoding/json"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"backend/db"
	"backend/engine"
	"backend/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var JwtSecret = []byte("talentaku-super-secret-key-123456")

// Admin Login
func AdminLogin(c *fiber.Ctx) error {
	type LoginInput struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var input LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var admin models.AdminUser
	err := db.DB.Where("email = ?", input.Email).First(&admin).Error
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Admin user not found"})
	}

	// Secure hashed password comparison
	err = bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(input.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Incorrect password"})
	}

	// Generate JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   admin.ID,
		"email": admin.Email,
		"role":  admin.Role,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // 24 hours
	})

	tokenString, err := token.SignedString(JwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
		"admin": fiber.Map{
			"email": admin.Email,
			"role":  admin.Role,
		},
	})
}

// Auth Middleware
func AuthRequired(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" || len(authHeader) < 8 || authHeader[:7] != "Bearer " {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or invalid authorization token"})
	}

	tokenString := authHeader[7:]
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return JwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims := token.Claims.(jwt.MapClaims)
	c.Locals("admin_role", claims["role"])
	return c.Next()
}

// Get Variables (for Wizard Page)
func GetVariables(c *fiber.Ctx) error {
	ageGroup := c.Query("age_group")
	var variables []models.Variable
	query := db.DB.Order("code ASC")
	if ageGroup != "" {
		query = query.Where("age_group = ?", ageGroup)
	}
	if err := query.Find(&variables).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch variables"})
	}
	return c.JSON(variables)
}

// Get Variables for a specific Consultation based on child's age group
func GetConsultationQuestions(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid session ID"})
	}

	var cons models.Consultation
	err = db.DB.Preload("Child").Where("id = ?", id).First(&cons).Error
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Assessment session not found"})
	}

	ageGroup := "preschool"
	if cons.Child.Age <= 3 {
		ageGroup = "toddler"
	} else if cons.Child.Age <= 6 {
		ageGroup = "preschool"
	} else if cons.Child.Age <= 9 {
		ageGroup = "early_elementary"
	} else {
		ageGroup = "late_elementary"
	}

	var variables []models.Variable
	if err := db.DB.Where("age_group = ?", ageGroup).Order("code ASC").Find(&variables).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch variables"})
	}

	return c.JSON(variables)
}

// Child Intake Form Submit
func StartIntake(c *fiber.Ctx) error {
	var req models.IntakeRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Name == "" || req.Age < 3 || req.Age > 12 || req.Gender == "" || req.School == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "All fields are required. Age must be between 3 and 12."})
	}

	// Save Child Profile
	child := models.Child{
		Name:      req.Name,
		Age:       req.Age,
		Gender:    req.Gender,
		School:    req.School,
		CreatedAt: time.Now(),
	}
	if err := db.DB.Create(&child).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create child profile"})
	}

	// Create Consultation
	userID := GetOptionalUserID(c)
	consultation := models.Consultation{
		UserID:    userID,
		ChildID:   child.ID,
		Status:    "IN_PROGRESS",
		CreatedAt: time.Now(),
	}
	if err := db.DB.Create(&consultation).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to start assessment session"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"consultation_id": consultation.ID,
		"child":           child,
	})
}

// Get Consultation Status
func GetConsultation(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid session ID"})
	}

	var cons models.Consultation
	err = db.DB.Preload("Child").Where("id = ?", id).First(&cons).Error
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Assessment session not found"})
	}

	return c.JSON(cons)
}

// Submit Consultation Answers & Run Forward Chaining Engine
func SubmitAnswers(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid session ID"})
	}

	// Check Consultation status
	var cons models.Consultation
	if err := db.DB.Preload("Child").Where("id = ?", id).First(&cons).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Assessment session not found"})
	}

	if cons.Status == "COMPLETED" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "This assessment has already been completed"})
	}

	var req models.SubmitAnswerRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Validate count
	if len(req.Answers) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Answers array cannot be empty"})
	}

	// Get Threshold
	var thresholdSetting models.Setting
	threshold := 4 // Default
	if err := db.DB.Where("key = ?", "likert_threshold").First(&thresholdSetting).Error; err == nil {
		if val, err := strconv.Atoi(thresholdSetting.Value); err == nil {
			threshold = val
		}
	}

	// Save answers in a transaction
	tx := db.DB.Begin()

	// Delete existing answers if any (to prevent duplicates)
	tx.Where("consultation_id = ?", id).Delete(&models.ConsultationAnswer{})

	ansMap := make(map[string]int)
	for _, ans := range req.Answers {
		dbAns := models.ConsultationAnswer{
			ConsultationID: uint(id),
			VariableCode:   ans.VariableCode,
			Score:          ans.Score,
		}
		if err := tx.Create(&dbAns).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save answer"})
		}
		ansMap[ans.VariableCode] = ans.Score
	}

	ageGroup := "preschool"
	if cons.Child.Age <= 3 {
		ageGroup = "toddler"
	} else if cons.Child.Age <= 6 {
		ageGroup = "preschool"
	} else if cons.Child.Age <= 9 {
		ageGroup = "early_elementary"
	} else {
		ageGroup = "late_elementary"
	}

	// Load Knowledge Base
	var variables []models.Variable
	var indicators []models.Indicator
	var indVars []models.IndicatorVariable
	var criteria []models.Criterion
	var critInds []models.CriterionIndicator

	tx.Where("age_group = ?", ageGroup).Find(&variables)
	tx.Where("age_group = ?", ageGroup).Find(&indicators)
	tx.Find(&indVars)
	tx.Where("age_group = ?", ageGroup).Find(&criteria)
	tx.Find(&critInds)

	// Run Forward Chaining engine
	fcEngine := engine.NewEngine(threshold)
	evalResults := fcEngine.Evaluate(ansMap, variables, indicators, indVars, criteria, critInds)

	// Sort results by percentage score descending to rank them
	sort.Slice(evalResults, func(i, j int) bool {
		return evalResults[i].ScorePercentage > evalResults[j].ScorePercentage
	})

	// Save Results to database
	for idx, evalRes := range evalResults {
		dbRes := models.ConsultationResult{
			ConsultationID:  uint(id),
			CriterionCode:   evalRes.CriterionCode,
			ScorePercentage: evalRes.ScorePercentage,
			IsRuleSatisfied: evalRes.IsRuleSatisfied,
			Ranking:         idx + 1,
		}
		if err := tx.Create(&dbRes).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save results"})
		}
		// Attach ranking and trace to return payload
		evalResults[idx].Ranking = idx + 1
	}

	// Update Consultation Status
	now := time.Now()
	cons.Status = "COMPLETED"
	cons.CompletedAt = &now
	if err := tx.Save(&cons).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update session status"})
	}

	tx.Commit()

	return c.JSON(fiber.Map{
		"consultation_id": cons.ID,
		"child":           cons.Child,
		"completed_at":    cons.CompletedAt,
		"results":         evalResults,
	})
}

// Get Consultation Results (View Details)
func GetResults(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid session ID"})
	}

	var cons models.Consultation
	err = db.DB.Preload("Child").Where("id = ?", id).First(&cons).Error
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Assessment session not found"})
	}

	if cons.Status != "COMPLETED" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Assessment is not completed yet"})
	}

	// Load Answers
	var answers []models.ConsultationAnswer
	db.DB.Where("consultation_id = ?", id).Find(&answers)
	ansMap := make(map[string]int)
	for _, a := range answers {
		ansMap[a.VariableCode] = a.Score
	}

	// Get Threshold
	var thresholdSetting models.Setting
	threshold := 4
	if err := db.DB.Where("key = ?", "likert_threshold").First(&thresholdSetting).Error; err == nil {
		if val, err := strconv.Atoi(thresholdSetting.Value); err == nil {
			threshold = val
		}
	}

	ageGroup := "preschool"
	if cons.Child.Age <= 3 {
		ageGroup = "toddler"
	} else if cons.Child.Age <= 6 {
		ageGroup = "preschool"
	} else if cons.Child.Age <= 9 {
		ageGroup = "early_elementary"
	} else {
		ageGroup = "late_elementary"
	}

	// Load Knowledge Base
	var variables []models.Variable
	var indicators []models.Indicator
	var indVars []models.IndicatorVariable
	var criteria []models.Criterion
	var critInds []models.CriterionIndicator

	db.DB.Where("age_group = ?", ageGroup).Find(&variables)
	db.DB.Where("age_group = ?", ageGroup).Find(&indicators)
	db.DB.Find(&indVars)
	db.DB.Where("age_group = ?", ageGroup).Find(&criteria)
	db.DB.Find(&critInds)

	// Run Engine
	fcEngine := engine.NewEngine(threshold)
	evalResults := fcEngine.Evaluate(ansMap, variables, indicators, indVars, criteria, critInds)

	// Sort results by percentage score descending to rank them
	sort.Slice(evalResults, func(i, j int) bool {
		return evalResults[i].ScorePercentage > evalResults[j].ScorePercentage
	})

	for idx := range evalResults {
		evalResults[idx].Ranking = idx + 1
	}

	return c.JSON(fiber.Map{
		"consultation_id": cons.ID,
		"user_id":         cons.UserID,
		"child":           cons.Child,
		"created_at":      cons.CreatedAt,
		"completed_at":    cons.CompletedAt,
		"answers":         answers,
		"results":         evalResults,
	})
}

// Get Consultations History (List of all kids)
func GetHistory(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	var consultations []models.Consultation
	var err error

	var userID *uint
	var isAdmin = false

	if authHeader != "" && len(authHeader) >= 8 && authHeader[:7] == "Bearer " {
		tokenString := authHeader[7:]
		token, errParse := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return JwtSecret, nil
		})

		if errParse == nil && token.Valid {
			claims := token.Claims.(jwt.MapClaims)
			if role, ok := claims["role"].(string); ok {
				if role == "superadmin" || role == "admin" {
					isAdmin = true
				} else if role == "user" {
					if sub, ok := claims["sub"].(float64); ok {
						uID := uint(sub)
						userID = &uID
					}
				}
			}
		}
	}

	query := db.DB.Preload("Child").Order("created_at DESC")
	if isAdmin {
		err = query.Find(&consultations).Error
	} else if userID != nil {
		err = query.Where("user_id = ?", *userID).Find(&consultations).Error
	} else {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Silakan masuk untuk melihat riwayat asesmen."})
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch history"})
	}

	// Format output with top talent
	type HistoryItem struct {
		ID              uint       `json:"id"`
		ChildName       string     `json:"child_name"`
		ChildAge        int        `json:"child_age"`
		ChildGender     string     `json:"child_gender"`
		ChildSchool     string     `json:"child_school"`
		Status          string     `json:"status"`
		CreatedAt       time.Time  `json:"created_at"`
		CompletedAt     *time.Time `json:"completed_at,omitempty"`
		TopTalent       string     `json:"top_talent"`
		ConfidenceScore float64    `json:"confidence_score"`
	}

	items := make([]HistoryItem, 0, len(consultations))
	for _, con := range consultations {
		topTalent := "N/A"
		conf := 0.0

		if con.Status == "COMPLETED" {
			var topRes models.ConsultationResult
			var crit models.Criterion
			err = db.DB.Where("consultation_id = ? AND ranking = 1", con.ID).First(&topRes).Error
			if err == nil {
				_ = db.DB.Where("code = ?", topRes.CriterionCode).First(&crit).Error
				topTalent = crit.Label
				conf = topRes.ScorePercentage
			}
		}

		items = append(items, HistoryItem{
			ID:              con.ID,
			ChildName:       con.Child.Name,
			ChildAge:        con.Child.Age,
			ChildGender:     con.Child.Gender,
			ChildSchool:     con.Child.School,
			Status:          con.Status,
			CreatedAt:       con.CreatedAt,
			CompletedAt:     con.CompletedAt,
			TopTalent:       topTalent,
			ConfidenceScore: conf,
		})
	}

	return c.JSON(items)
}

// Admin Panel Stats
func GetAdminStats(c *fiber.Ctx) error {
	var totalAssessments int64
	db.DB.Model(&models.Consultation{}).Where("status = ?", "COMPLETED").Count(&totalAssessments)

	var activeStudents int64
	db.DB.Model(&models.Child{}).Count(&activeStudents)

	// Talent identified count (sum of satisfying rules)
	var satisfiedCount int64
	db.DB.Model(&models.ConsultationResult{}).Where("is_rule_satisfied = ?", true).Count(&satisfiedCount)

	// Distribution data (Count top ranking criteria)
	type DistributionRow struct {
		CriterionCode string `json:"code"`
		Label         string `json:"label"`
		Count         int    `json:"count"`
	}

	var results []struct {
		CriterionCode string
		Count         int
	}

	db.DB.Model(&models.ConsultationResult{}).
		Select("criterion_code, count(*) as count").
		Where("ranking = 1").
		Group("criterion_code").
		Scan(&results)

	distMap := make(map[string]int)
	for _, r := range results {
		distMap[r.CriterionCode] = r.Count
	}

	var criteria []models.Criterion
	db.DB.Find(&criteria)

	distribution := make([]DistributionRow, 0, len(criteria))
	for _, cr := range criteria {
		count := distMap[cr.Code]
		distribution = append(distribution, DistributionRow{
			CriterionCode: cr.Code,
			Label:         cr.Label,
			Count:         count,
		})
	}

	return c.JSON(fiber.Map{
		"total_assessments":   totalAssessments,
		"active_students":     activeStudents,
		"identified_talents":  satisfiedCount,
		"pending_reviews":     0,
		"talent_distribution": distribution,
	})
}

// Admin Rules & Seeding Details (for builder UI)
func GetRules(c *fiber.Ctx) error {
	ageGroup := c.Query("age_group")
	var variables []models.Variable
	var indicators []models.Indicator
	var criteria []models.Criterion
	var indVars []models.IndicatorVariable
	var critInds []models.CriterionIndicator

	vQuery := db.DB
	iQuery := db.DB
	cQuery := db.DB

	if ageGroup != "" {
		vQuery = vQuery.Where("age_group = ?", ageGroup)
		iQuery = iQuery.Where("age_group = ?", ageGroup)
		cQuery = cQuery.Where("age_group = ?", ageGroup)
	}

	vQuery.Find(&variables)
	iQuery.Find(&indicators)
	db.DB.Find(&indVars)
	cQuery.Find(&criteria)
	db.DB.Find(&critInds)

	return c.JSON(fiber.Map{
		"variables":           variables,
		"indicators":          indicators,
		"criteria":            criteria,
		"indicator_variables": indVars,
		"criteria_indicators": critInds,
	})
}

// Simulate Rule Engine Outputs
func SimulateInference(c *fiber.Ctx) error {
	type SimulationInput struct {
		Answers   []models.AnswerInput `json:"answers"`
		Threshold int                  `json:"threshold"`
	}

	var input SimulationInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	threshold := input.Threshold
	if threshold < 1 || threshold > 5 {
		threshold = 4 // Default fallback
	}

	ansMap := make(map[string]int)
	for _, a := range input.Answers {
		ansMap[a.VariableCode] = a.Score
	}

	// Load Knowledge Base
	var variables []models.Variable
	var indicators []models.Indicator
	var indVars []models.IndicatorVariable
	var criteria []models.Criterion
	var critInds []models.CriterionIndicator

	db.DB.Find(&variables)
	db.DB.Find(&indicators)
	db.DB.Find(&indVars)
	db.DB.Find(&criteria)
	db.DB.Find(&critInds)

	fcEngine := engine.NewEngine(threshold)
	evalResults := fcEngine.Evaluate(ansMap, variables, indicators, indVars, criteria, critInds)

	// Sort results by percentage score descending to rank them
	sort.Slice(evalResults, func(i, j int) bool {
		return evalResults[i].ScorePercentage > evalResults[j].ScorePercentage
	})

	for idx := range evalResults {
		evalResults[idx].Ranking = idx + 1
	}

	return c.JSON(fiber.Map{
		"threshold": threshold,
		"results":   evalResults,
	})
}

// Get Settings
func GetSettings(c *fiber.Ctx) error {
	var settings []models.Setting
	db.DB.Find(&settings)

	setMap := make(map[string]string)
	for _, s := range settings {
		setMap[s.Key] = s.Value
	}

	return c.JSON(setMap)
}

// Update Settings
func UpdateSettings(c *fiber.Ctx) error {
	var input map[string]string
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	for k, v := range input {
		setting := models.Setting{Key: k, Value: v}
		if err := db.DB.Save(&setting).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save setting: " + k})
		}
	}

	return c.JSON(fiber.Map{"message": "Settings updated successfully"})
}

// Helper to optionally get logged-in user ID from token
func GetOptionalUserID(c *fiber.Ctx) *uint {
	authHeader := c.Get("Authorization")
	if authHeader == "" || len(authHeader) < 8 || authHeader[:7] != "Bearer " {
		return nil
	}

	tokenString := authHeader[7:]
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return JwtSecret, nil
	})

	if err != nil || !token.Valid {
		return nil
	}

	claims := token.Claims.(jwt.MapClaims)
	role := claims["role"]
	if role == "user" {
		if sub, ok := claims["sub"].(float64); ok {
			userID := uint(sub)
			return &userID
		}
	}
	return nil
}

// User Registration
func UserRegister(c *fiber.Ctx) error {
	type RegisterInput struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}

	var input RegisterInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if input.Email == "" || input.Password == "" || input.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email, password, dan nama wajib diisi."})
	}

	// Check if user already exists
	var count int64
	db.DB.Model(&models.User{}).Where("email = ?", input.Email).Count(&count)
	if count > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email sudah terdaftar."})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	// Create user
	user := models.User{
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
		Name:         input.Name,
		CreatedAt:    time.Now(),
	}

	if err := db.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to register user"})
	}

	// Generate JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"role":  "user",
		"exp":   time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	})

	tokenString, err := token.SignedString(JwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
		"user": fiber.Map{
			"id":    user.ID,
			"email": user.Email,
			"name":  user.Name,
		},
	})
}

// User Login
func UserLogin(c *fiber.Ctx) error {
	type LoginInput struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var input LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var user models.User
	err := db.DB.Where("email = ?", input.Email).First(&user).Error
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User tidak ditemukan."})
	}

	// Compare password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Kata sandi salah."})
	}

	// Generate JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"role":  "user",
		"exp":   time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	})

	tokenString, err := token.SignedString(JwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
		"user": fiber.Map{
			"id":    user.ID,
			"email": user.Email,
			"name":  user.Name,
		},
	})
}

// Claim consultation to logged-in user
func ClaimConsultation(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" || len(authHeader) < 8 || authHeader[:7] != "Bearer " {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or invalid authorization token"})
	}

	tokenString := authHeader[7:]
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return JwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims := token.Claims.(jwt.MapClaims)
	role := claims["role"]
	if role != "user" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Only regular users can claim consultations"})
	}

	sub, ok := claims["sub"].(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user claims"})
	}
	userID := uint(sub)

	type ClaimInput struct {
		ConsultationID uint `json:"consultation_id"`
	}

	var input ClaimInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var consultation models.Consultation
	err = db.DB.Where("id = ?", input.ConsultationID).First(&consultation).Error
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Consultation session not found"})
	}

	// Update UserID
	consultation.UserID = &userID
	if err := db.DB.Save(&consultation).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to claim consultation"})
	}

	return c.JSON(fiber.Map{"message": "Sesi asesmen berhasil disimpan ke akun Anda."})
}

// User Google Login
func UserGoogleLogin(c *fiber.Ctx) error {
	type GoogleLoginInput struct {
		Credential string `json:"credential"`
	}

	var input GoogleLoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if input.Credential == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Google credential is required"})
	}

	type GoogleTokenInfo struct {
		Email         string `json:"email"`
		Name          string `json:"name"`
		EmailVerified string `json:"email_verified"`
		Error         string `json:"error"`
	}

	var info GoogleTokenInfo

	// Bypass verification if it's a mock token for development/testing
	if strings.HasPrefix(input.Credential, "mock-google-token-") {
		email := strings.TrimPrefix(input.Credential, "mock-google-token-")
		name := "Mock Google User"
		parts := strings.Split(email, "|")
		if len(parts) > 1 {
			email = parts[0]
			name = parts[1]
		}
		info = GoogleTokenInfo{
			Email:         email,
			Name:          name,
			EmailVerified: "true",
		}
	} else {
		// Call Google's tokeninfo API to verify credential
		resp, err := http.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + input.Credential)
		if err != nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Gagal terhubung dengan layanan Google OAuth"})
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Kredensial Google tidak valid"})
		}

		if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal membaca respons dari Google"})
		}

		if info.Error != "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Kesalahan token Google: " + info.Error})
		}

		if info.EmailVerified != "true" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Email Google belum diverifikasi"})
		}
	}

	// Check if user already exists
	var user models.User
	err := db.DB.Where("email = ?", info.Email).First(&user).Error
	if err != nil {
		// Register user
		user = models.User{
			Email:        info.Email,
			Name:         info.Name,
			PasswordHash: "", // Google users do not need standard password hashes
			CreatedAt:    time.Now(),
		}
		if err := db.DB.Create(&user).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal membuat akun pengguna baru"})
		}
	}

	// Generate JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"role":  "user",
		"exp":   time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	})

	tokenString, err := token.SignedString(JwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
		"user": fiber.Map{
			"id":    user.ID,
			"email": user.Email,
			"name":  user.Name,
		},
	})
}
