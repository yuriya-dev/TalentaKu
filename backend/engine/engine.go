package engine

import (
	"fmt"
	"math"

	"backend/models"
)

type EvaluationResult struct {
	CriterionCode   string                   `json:"criterion_code"`
	CriterionLabel  string                   `json:"criterion_label"`
	Description     string                   `json:"description"`
	Suggestions     string                   `json:"suggestions"`
	ScorePercentage float64                  `json:"score_percentage"`
	IsRuleSatisfied bool                     `json:"is_rule_satisfied"`
	Ranking         int                      `json:"ranking"`
	Trace           []string                 `json:"trace"`
	Indicators      []IndicatorStatus        `json:"indicators"`
}

type IndicatorStatus struct {
	Code            string          `json:"code"`
	Label           string          `json:"label"`
	ScorePercentage float64         `json:"score_percentage"`
	IsSatisfied     bool            `json:"is_satisfied"`
	Variables       []VariableStatus `json:"variables"`
}

type VariableStatus struct {
	Code        string `json:"code"`
	Label       string `json:"label"`
	Score       int    `json:"score"`
	IsSatisfied bool   `json:"is_satisfied"`
}

type ForwardChainingEngine struct {
	Threshold int
}

func NewEngine(threshold int) *ForwardChainingEngine {
	return &ForwardChainingEngine{
		Threshold: threshold,
	}
}

func (e *ForwardChainingEngine) Evaluate(
	answers map[string]int, // variable_code -> score (1-5)
	variables []models.Variable,
	indicators []models.Indicator,
	indVars []models.IndicatorVariable,
	criteria []models.Criterion,
	critInds []models.CriterionIndicator,
) []EvaluationResult {

	// 1. Process Variable Statuses
	varStatus := make(map[string]VariableStatus)
	for _, v := range variables {
		score := 1
		if val, exists := answers[v.Code]; exists {
			score = val
		}
		varStatus[v.Code] = VariableStatus{
			Code:        v.Code,
			Label:       v.Label,
			Score:       score,
			IsSatisfied: score >= e.Threshold,
		}
	}

	// Group variables by indicator
	varsByInd := make(map[string][]string)
	for _, mapping := range indVars {
		varsByInd[mapping.IndicatorCode] = append(varsByInd[mapping.IndicatorCode], mapping.VariableCode)
	}

	// 2. Evaluate Indicators (Level 1)
	indStatus := make(map[string]IndicatorStatus)
	for _, ind := range indicators {
		depVars := varsByInd[ind.Code]
		if len(depVars) == 0 {
			continue
		}

		allSatisfied := true
		scoreSum := 0
		varStatuses := make([]VariableStatus, 0, len(depVars))

		for _, vCode := range depVars {
			vStat, exists := varStatus[vCode]
			if !exists {
				// Fallback if variable is missing
				vStat = VariableStatus{Code: vCode, Label: "Unknown", Score: 1, IsSatisfied: false}
			}
			varStatuses = append(varStatuses, vStat)
			scoreSum += vStat.Score
			if !vStat.IsSatisfied {
				allSatisfied = false
			}
		}

		// Calculate normalized percentage (Likert scale 1-5 maps to 0-100)
		avgScore := float64(scoreSum) / float64(len(depVars))
		pct := ((avgScore - 1.0) / 4.0) * 100.0
		if pct < 0 {
			pct = 0
		}
		pct = math.Round(pct*100) / 100

		indStatus[ind.Code] = IndicatorStatus{
			Code:            ind.Code,
			Label:           ind.Label,
			ScorePercentage: pct,
			IsSatisfied:     allSatisfied,
			Variables:       varStatuses,
		}
	}

	// Group indicators by criterion
	indsByCrit := make(map[string][]string)
	for _, mapping := range critInds {
		indsByCrit[mapping.CriterionCode] = append(indsByCrit[mapping.CriterionCode], mapping.IndicatorCode)
	}

	// 3. Evaluate Criteria (Level 2)
	results := make([]EvaluationResult, 0, len(criteria))
	for _, crit := range criteria {
		depInds := indsByCrit[crit.Code]
		if len(depInds) == 0 {
			continue
		}

		allSatisfied := true
		pctSum := 0.0
		var traces []string
		var critIndStatuses []IndicatorStatus

		for _, iCode := range depInds {
			iStat, exists := indStatus[iCode]
			if !exists {
				allSatisfied = false
				traces = append(traces, fmt.Sprintf("✗ Indikator %s tidak ditemukan", iCode))
				continue
			}
			critIndStatuses = append(critIndStatuses, iStat)
			pctSum += iStat.ScorePercentage
			if !iStat.IsSatisfied {
				allSatisfied = false
				traces = append(traces, fmt.Sprintf("✗ Indikator %s (%s) tidak terpenuhi", iCode, iStat.Label))
			} else {
				traces = append(traces, fmt.Sprintf("✓ Indikator %s (%s) terpenuhi", iCode, iStat.Label))
			}
		}

		avgPct := pctSum / float64(len(depInds))
		avgPct = math.Round(avgPct*100) / 100

		ruleText := fmt.Sprintf("Aturan Level 2 untuk %s (%s): ", crit.Code, crit.Label)
		if allSatisfied {
			ruleText += "Semua indikator terpenuhi. RULE TRUE."
		} else {
			ruleText += "Beberapa indikator belum terpenuhi. RULE FALSE."
		}

		// Insert Rule Text at the beginning of trace
		finalTraces := append([]string{ruleText}, traces...)

		results = append(results, EvaluationResult{
			CriterionCode:   crit.Code,
			CriterionLabel:  crit.Label,
			Description:     crit.Description,
			Suggestions:     crit.Suggestions,
			ScorePercentage: avgPct,
			IsRuleSatisfied: allSatisfied,
			Trace:           finalTraces,
			Indicators:      critIndStatuses,
		})
	}

	return results
}
