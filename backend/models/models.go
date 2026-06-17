package models

import (
	"time"
)

type Setting struct {
	Key   string `gorm:"primaryKey" json:"key"`
	Value string `json:"value"`
}

type Variable struct {
	Code     string `gorm:"primaryKey;size:10" json:"code"` // C1-C83
	Label    string `gorm:"type:text" json:"label"`
	Category string `json:"category"` // General Intellectual, Academic, etc.
}

type Indicator struct {
	Code  string `gorm:"primaryKey;size:10" json:"code"` // I1-I27
	Label string `gorm:"type:text" json:"label"`
}

type IndicatorVariable struct {
	IndicatorCode string `gorm:"primaryKey;size:10" json:"indicator_code"`
	VariableCode  string `gorm:"primaryKey;size:10" json:"variable_code"`
}

type Criterion struct {
	Code        string `gorm:"primaryKey;size:10" json:"code"` // K1-K6
	Label       string `gorm:"type:text" json:"label"`
	Description string `gorm:"type:text" json:"description"`
	Suggestions string `gorm:"type:text" json:"suggestions"` // Actionable suggestions
}

type CriterionIndicator struct {
	CriterionCode string `gorm:"primaryKey;size:10" json:"criterion_code"`
	IndicatorCode string `gorm:"primaryKey;size:10" json:"indicator_code"`
}

type Child struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Age       int       `json:"age"` // 4-6
	Gender    string    `json:"gender"` // male, female
	School    string    `json:"school"`
	CreatedAt time.Time `json:"created_at"`
}

type Consultation struct {
	ID          uint                 `gorm:"primaryKey" json:"id"`
	ChildID     uint                 `json:"child_id"`
	Child       Child                `gorm:"foreignKey:ChildID" json:"child"`
	Status      string               `json:"status"` // IN_PROGRESS, COMPLETED
	CreatedAt   time.Time            `json:"created_at"`
	CompletedAt *time.Time           `json:"completed_at,omitempty"`
	Answers     []ConsultationAnswer `gorm:"foreignKey:ConsultationID" json:"answers,omitempty"`
	Results     []ConsultationResult `gorm:"foreignKey:ConsultationID" json:"results,omitempty"`
}

type ConsultationAnswer struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	ConsultationID uint   `json:"consultation_id"`
	VariableCode   string `gorm:"size:10" json:"variable_code"`
	Score          int    `json:"score"` // Likert scale 1-5
}

type ConsultationResult struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	ConsultationID  uint      `json:"consultation_id"`
	CriterionCode   string    `gorm:"size:10" json:"criterion_code"`
	Criterion       Criterion `gorm:"foreignKey:CriterionCode" json:"criterion"`
	ScorePercentage float64   `json:"score_percentage"`  // 0.0 - 100.0
	IsRuleSatisfied bool      `json:"is_rule_satisfied"` // biner forward chaining satisfied
	Ranking         int       `json:"ranking"`
}

type AdminUser struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	Email        string `gorm:"uniqueIndex;size:100" json:"email"`
	PasswordHash string `json:"-"`
	Role         string `json:"role"` // superadmin, admin
}

// Structs for API Requests/Responses
type IntakeRequest struct {
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Gender string `json:"gender"`
	School string `json:"school"`
}

type SubmitAnswerRequest struct {
	Answers []AnswerInput `json:"answers"`
}

type AnswerInput struct {
	VariableCode string `json:"variable_code"`
	Score        int    `json:"score"`
}
