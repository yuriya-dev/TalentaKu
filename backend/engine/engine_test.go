package engine

import (
	"testing"

	"backend/models"
)

func TestForwardChainingEngine(t *testing.T) {
	// 1. Initialize engine with standard threshold 4
	eng := NewEngine(4)

	// 2. Mock input variables (C1, C2 are dependencies for I1)
	variables := []models.Variable{
		{Code: "C1", Label: "Observes objects closely", Category: "General Intellectual"},
		{Code: "C2", Label: "Asks many questions", Category: "General Intellectual"},
		{Code: "C3", Label: "Counts up to 10", Category: "Academic"},
	}

	// 3. Mock indicators (I1 depends on C1 & C2, I2 depends on C3)
	indicators := []models.Indicator{
		{Code: "I1", Label: "High curiosity"},
		{Code: "I2", Label: "Basic math skill"},
	}

	indVars := []models.IndicatorVariable{
		{IndicatorCode: "I1", VariableCode: "C1"},
		{IndicatorCode: "I1", VariableCode: "C2"},
		{IndicatorCode: "I2", VariableCode: "C3"},
	}

	// 4. Mock criteria (K1 depends on I1 & I2)
	criteria := []models.Criterion{
		{Code: "K1", Label: "General Intellectual Talent", Description: "Desc K1", Suggestions: "Sugg K1"},
	}

	critInds := []models.CriterionIndicator{
		{CriterionCode: "K1", IndicatorCode: "I1"},
		{CriterionCode: "K1", IndicatorCode: "I2"},
	}

	t.Run("Rule satisfied when all answers are high", func(t *testing.T) {
		answers := map[string]int{
			"C1": 5, // Satisfied
			"C2": 4, // Satisfied
			"C3": 4, // Satisfied
		}

		results := eng.Evaluate(answers, variables, indicators, indVars, criteria, critInds)

		if len(results) != 1 {
			t.Fatalf("Expected 1 result, got %d", len(results))
		}

		res := results[0]
		if res.CriterionCode != "K1" {
			t.Errorf("Expected K1, got %s", res.CriterionCode)
		}

		if !res.IsRuleSatisfied {
			t.Errorf("Expected rule to be satisfied (TRUE)")
		}

		// (5 + 4)/2 = 4.5 average. Normalized percentage: ((4.5-1)/4)*100 = 87.5%
		// For I2: 4 score. Normalized percentage: ((4-1)/4)*100 = 75%
		// Total K1 score: (87.5 + 75)/2 = 81.25%
		expectedScore := 81.25
		if res.ScorePercentage != expectedScore {
			t.Errorf("Expected score %f, got %f", expectedScore, res.ScorePercentage)
		}
	})

	t.Run("Rule NOT satisfied when one answer is below threshold", func(t *testing.T) {
		answers := map[string]int{
			"C1": 5,
			"C2": 3, // Below threshold 4 -> I1 is false
			"C3": 4,
		}

		results := eng.Evaluate(answers, variables, indicators, indVars, criteria, critInds)

		if len(results) != 1 {
			t.Fatalf("Expected 1 result, got %d", len(results))
		}

		res := results[0]
		if res.IsRuleSatisfied {
			t.Errorf("Expected rule to be NOT satisfied (FALSE)")
		}

		// I1 is not satisfied
		var i1Satisfied bool
		for _, ind := range res.Indicators {
			if ind.Code == "I1" {
				i1Satisfied = ind.IsSatisfied
			}
		}
		if i1Satisfied {
			t.Errorf("Expected indicator I1 to be NOT satisfied")
		}
	})
}
