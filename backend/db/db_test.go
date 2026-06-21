package db

import (
	"os"
	"testing"

	"backend/models"
)

func TestInitDBAndSeed(t *testing.T) {
	// 1. Set temporary db path for test
	os.Setenv("DATABASE_URL", "test_talentaku.db")
	defer func() {
		os.Remove("test_talentaku.db")
		os.Unsetenv("DATABASE_URL")
	}()

	// 2. Initialize DB (it runs auto migrate and seeding)
	database := InitDB()
	if database == nil {
		t.Fatal("Failed to initialize database")
	}

	// 3. Verify counts for age groups
	var toddlerVarsCount int64
	database.Model(&models.Variable{}).Where("age_group = ?", "toddler").Count(&toddlerVarsCount)
	if toddlerVarsCount != 12 {
		t.Errorf("Expected 12 toddler variables, got %d", toddlerVarsCount)
	}

	var preschoolVarsCount int64
	database.Model(&models.Variable{}).Where("age_group = ?", "preschool").Count(&preschoolVarsCount)
	if preschoolVarsCount != 83 {
		t.Errorf("Expected 83 preschool variables, got %d", preschoolVarsCount)
	}

	var earlyVarsCount int64
	database.Model(&models.Variable{}).Where("age_group = ?", "early_elementary").Count(&earlyVarsCount)
	if earlyVarsCount != 24 {
		t.Errorf("Expected 24 early elementary variables, got %d", earlyVarsCount)
	}

	var lateVarsCount int64
	database.Model(&models.Variable{}).Where("age_group = ?", "late_elementary").Count(&lateVarsCount)
	if lateVarsCount != 24 {
		t.Errorf("Expected 24 late elementary variables, got %d", lateVarsCount)
	}

	// 4. Verify criteria count for each age group
	var toddlerCritCount int64
	database.Model(&models.Criterion{}).Where("age_group = ?", "toddler").Count(&toddlerCritCount)
	if toddlerCritCount != 6 {
		t.Errorf("Expected 6 toddler criteria, got %d", toddlerCritCount)
	}

	var preschoolCritCount int64
	database.Model(&models.Criterion{}).Where("age_group = ?", "preschool").Count(&preschoolCritCount)
	if preschoolCritCount != 6 {
		t.Errorf("Expected 6 preschool criteria, got %d", preschoolCritCount)
	}
}
