package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"backend/db"
	"backend/models"
	"github.com/gofiber/fiber/v2"
)

func TestHandlers(t *testing.T) {
	// 1. Set up test database
	os.Setenv("DATABASE_URL", "test_handlers.db")
	defer func() {
		os.Remove("test_handlers.db")
		os.Unsetenv("DATABASE_URL")
	}()

	db.InitDB()

	// 2. Set up Fiber app
	app := fiber.New()
	api := app.Group("/api")
	api.Post("/intake", StartIntake)
	api.Get("/consultation/:id/questions", GetConsultationQuestions)
	api.Post("/consultation/:id/submit", SubmitAnswers)
	api.Get("/consultation/:id/results", GetResults)

	// 3. Test StartIntake for a Toddler (Age 3)
	intakeReq := models.IntakeRequest{
		Name:   "Adek Budi",
		Age:    3,
		Gender: "boy",
		School: "PAUD Ceria",
	}
	body, _ := json.Marshal(intakeReq)
	req := httptest.NewRequest("POST", "/api/intake", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Failed to test intake: %v", err)
	}

	if resp.StatusCode != http.StatusCreated {
		t.Errorf("Expected status 201 Created, got %d", resp.StatusCode)
	}

	var intakeResp struct {
		ConsultationID uint        `json:"consultation_id"`
		Child          models.Child `json:"child"`
	}
	respBody, _ := io.ReadAll(resp.Body)
	json.Unmarshal(respBody, &intakeResp)

	if intakeResp.ConsultationID == 0 {
		t.Fatal("Expected non-zero consultation ID")
	}
	if intakeResp.Child.Age != 3 {
		t.Errorf("Expected child age 3, got %d", intakeResp.Child.Age)
	}

	// 4. Test GetConsultationQuestions for Toddler (should return 12 questions/variables starting with 'T')
	reqQuestions := httptest.NewRequest("GET", "/api/consultation/1/questions", nil)
	respQuestions, _ := app.Test(reqQuestions)

	if respQuestions.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", respQuestions.StatusCode)
	}

	var questions []models.Variable
	respQuestionsBody, _ := io.ReadAll(respQuestions.Body)
	json.Unmarshal(respQuestionsBody, &questions)

	if len(questions) != 12 {
		t.Errorf("Expected 12 toddler questions, got %d", len(questions))
	}

	for _, q := range questions {
		if q.AgeGroup != "toddler" {
			t.Errorf("Expected question to be in 'toddler' age group, got %s", q.AgeGroup)
		}
		if q.Code[0] != 'T' {
			t.Errorf("Expected toddler question code to start with 'T', got %s", q.Code)
		}
	}

	// 5. Test SubmitAnswers for Toddler (with score 5 for T1 and T2, satisfying rule TI1 -> TK1)
	// Seed setting for likert threshold
	db.DB.Save(&models.Setting{Key: "likert_threshold", Value: "4"})

	var submitAnswers []models.AnswerInput
	for _, q := range questions {
		score := 4 // Satisfies threshold
		if q.Code == "T1" || q.Code == "T2" {
			score = 5
		}
		submitAnswers = append(submitAnswers, models.AnswerInput{
			VariableCode: q.Code,
			Score:        score,
		})
	}

	submitReq := models.SubmitAnswerRequest{Answers: submitAnswers}
	submitBody, _ := json.Marshal(submitReq)
	reqSubmit := httptest.NewRequest("POST", "/api/consultation/1/submit", bytes.NewBuffer(submitBody))
	reqSubmit.Header.Set("Content-Type", "application/json")
	respSubmit, _ := app.Test(reqSubmit)

	if respSubmit.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", respSubmit.StatusCode)
	}

	// 6. Test GetResults for Toddler (should show TK1 rule satisfied and results sorted)
	reqResults := httptest.NewRequest("GET", "/api/consultation/1/results", nil)
	respResults, _ := app.Test(reqResults)

	if respResults.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", respResults.StatusCode)
	}

	var results struct {
		Results []struct {
			CriterionCode   string  `json:"criterion_code"`
			ScorePercentage float64 `json:"score_percentage"`
			IsRuleSatisfied bool    `json:"is_rule_satisfied"`
		} `json:"results"`
	}
	respResultsBody, _ := io.ReadAll(respResults.Body)
	json.Unmarshal(respResultsBody, &results)

	if len(results.Results) == 0 {
		t.Fatal("Expected non-empty evaluation results")
	}

	// Verify toddler criteria TK1 is present and satisfied
	foundTK1 := false
	for _, r := range results.Results {
		if r.CriterionCode == "TK1" {
			foundTK1 = true
			if !r.IsRuleSatisfied {
				t.Error("Expected TK1 rule to be satisfied")
			}
			if r.ScorePercentage != 100 {
				t.Errorf("Expected TK1 score percentage 100, got %f", r.ScorePercentage)
			}
		}
	}
	if !foundTK1 {
		t.Error("Expected to find TK1 criterion in toddler results")
	}
}

func TestIntakeAgeValidation(t *testing.T) {
	// 1. Set up test database
	os.Setenv("DATABASE_URL", "test_validation.db")
	defer func() {
		os.Remove("test_validation.db")
		os.Unsetenv("DATABASE_URL")
	}()

	db.InitDB()

	// 2. Set up Fiber app
	app := fiber.New()
	api := app.Group("/api")
	api.Post("/intake", StartIntake)

	// Test invalid age (2 is below 3)
	intakeReq := models.IntakeRequest{
		Name:   "Baby",
		Age:    2,
		Gender: "girl",
		School: "None",
	}
	body, _ := json.Marshal(intakeReq)
	req := httptest.NewRequest("POST", "/api/intake", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status 400 Bad Request for age 2, got %d", resp.StatusCode)
	}

	// Test invalid age (13 is above 12)
	intakeReq2 := models.IntakeRequest{
		Name:   "Teenager",
		Age:    13,
		Gender: "girl",
		School: "SMP",
	}
	body2, _ := json.Marshal(intakeReq2)
	req2 := httptest.NewRequest("POST", "/api/intake", bytes.NewBuffer(body2))
	req2.Header.Set("Content-Type", "application/json")
	resp2, _ := app.Test(req2)

	if resp2.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status 400 Bad Request for age 13, got %d", resp2.StatusCode)
	}

	// Test valid ages (3, 6, 9, 12)
	for _, age := range []int{3, 6, 9, 12} {
		intakeReqValid := models.IntakeRequest{
			Name:   "Child",
			Age:    age,
			Gender: "girl",
			School: "Kindergarten",
		}
		bodyValid, _ := json.Marshal(intakeReqValid)
		reqValid := httptest.NewRequest("POST", "/api/intake", bytes.NewBuffer(bodyValid))
		reqValid.Header.Set("Content-Type", "application/json")
		respValid, _ := app.Test(reqValid)

		if respValid.StatusCode != http.StatusCreated {
			t.Errorf("Expected status 201 Created for age %d, got %d", age, respValid.StatusCode)
		}
	}
}

func TestAdminLogin(t *testing.T) {
	os.Setenv("DATABASE_URL", "test_login.db")
	defer func() {
		os.Remove("test_login.db")
		os.Unsetenv("DATABASE_URL")
	}()

	db.InitDB()

	app := fiber.New()
	app.Post("/api/admin/login", AdminLogin)

	// Test successful login
	loginInput := map[string]string{
		"email":    "admin@talentaku.com",
		"password": "admin123",
	}
	body, _ := json.Marshal(loginInput)
	req := httptest.NewRequest("POST", "/api/admin/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Failed to test admin login: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.StatusCode)
	}

	var loginResp map[string]interface{}
	respBody, _ := io.ReadAll(resp.Body)
	json.Unmarshal(respBody, &loginResp)

	if _, exists := loginResp["token"]; !exists {
		t.Error("Expected token in login response")
	}

	// Test incorrect password
	loginInputBad := map[string]string{
		"email":    "admin@talentaku.com",
		"password": "wrongpassword",
	}
	bodyBad, _ := json.Marshal(loginInputBad)
	reqBad := httptest.NewRequest("POST", "/api/admin/login", bytes.NewBuffer(bodyBad))
	reqBad.Header.Set("Content-Type", "application/json")
	respBad, _ := app.Test(reqBad)

	if respBad.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401 Unauthorized for incorrect password, got %d", respBad.StatusCode)
	}
}

func TestUserGoogleLogin(t *testing.T) {
	os.Setenv("DATABASE_URL", "test_google_login.db")
	defer func() {
		os.Remove("test_google_login.db")
		os.Unsetenv("DATABASE_URL")
	}()

	db.InitDB()

	app := fiber.New()
	app.Post("/api/login/google", UserGoogleLogin)

	// Test login using mock Google token (bypass)
	loginInput := map[string]string{
		"credential": "mock-google-token-tester@talentaku.com|Tester Google",
	}
	body, _ := json.Marshal(loginInput)
	req := httptest.NewRequest("POST", "/api/login/google", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Failed to test Google login: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.StatusCode)
	}

	var loginResp map[string]interface{}
	respBody, _ := io.ReadAll(resp.Body)
	json.Unmarshal(respBody, &loginResp)

	if _, exists := loginResp["token"]; !exists {
		t.Error("Expected token in Google login response")
	}

	userMap, ok := loginResp["user"].(map[string]interface{})
	if !ok {
		t.Fatal("Expected user object in response")
	}

	if userMap["email"] != "tester@talentaku.com" {
		t.Errorf("Expected email to be tester@talentaku.com, got %v", userMap["email"])
	}

	if userMap["name"] != "Tester Google" {
		t.Errorf("Expected name to be Tester Google, got %v", userMap["name"])
	}
}
