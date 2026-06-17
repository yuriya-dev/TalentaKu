const API_BASE = "http://localhost:8080/api";

export interface Child {
  id: number;
  name: string;
  age: number;
  gender: string;
  school: string;
  created_at: string;
}

export interface Variable {
  code: string;
  label: string;
  category: string;
}

export interface AnswerInput {
  variable_code: string;
  score: number;
}

export interface IndicatorStatus {
  code: string;
  label: string;
  score_percentage: number;
  is_satisfied: boolean;
  variables: {
    code: string;
    label: string;
    score: number;
    is_satisfied: boolean;
  }[];
}

export interface EvaluationResult {
  criterion_code: string;
  criterion_label: string;
  description: string;
  suggestions: string;
  score_percentage: number;
  is_rule_satisfied: boolean;
  ranking: number;
  trace: string[];
  indicators: IndicatorStatus[];
}

export interface ConsultationResponse {
  consultation_id: number;
  child: Child;
  status?: string;
  completed_at?: string;
  results?: EvaluationResult[];
}

export interface HistoryItem {
  id: number;
  child_name: string;
  child_age: number;
  child_gender: string;
  child_school: string;
  status: string;
  created_at: string;
  completed_at?: string;
  top_talent: string;
  confidence_score: number;
}

export interface AdminStats {
  total_assessments: number;
  active_students: number;
  identified_talents: number;
  pending_reviews: number;
  talent_distribution: {
    code: string;
    label: string;
    count: number;
  }[];
}

export interface Indicator {
  code: string;
  label: string;
}

export interface Criterion {
  code: string;
  label: string;
  description: string;
  suggestions: string;
}

export interface MappingRelation {
  indicator_code?: string;
  criterion_code?: string;
  variable_code?: string;
}

export interface RulesResponse {
  variables: Variable[];
  indicators: Indicator[];
  criteria: Criterion[];
  indicator_variables: { indicator_code: string; variable_code: string }[];
  criteria_indicators: { criterion_code: string; indicator_code: string }[];
}

// Fetch all variables
export async function fetchVariables(): Promise<Variable[]> {
  const res = await fetch(`${API_BASE}/variables`);
  if (!res.ok) throw new Error("Failed to fetch variables");
  return res.json();
}

// Child intake
export async function childIntake(data: { name: string; age: number; gender: string; school: string }): Promise<ConsultationResponse> {
  const res = await fetch(`${API_BASE}/intake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed child intake");
  }
  return res.json();
}

// Get consultation details
export async function fetchConsultation(id: number): Promise<ConsultationResponse> {
  const res = await fetch(`${API_BASE}/consultation/${id}`);
  if (!res.ok) throw new Error("Failed to fetch consultation session");
  return res.json();
}

// Submit answers
export async function submitAnswers(id: number, answers: AnswerInput[]): Promise<ConsultationResponse> {
  const res = await fetch(`${API_BASE}/consultation/${id}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to submit answers");
  }
  return res.json();
}

// Get results
export async function fetchResults(id: number): Promise<{
  consultation_id: number;
  child: Child;
  created_at: string;
  completed_at: string;
  answers: { variable_code: string; score: number }[];
  results: EvaluationResult[];
}> {
  const res = await fetch(`${API_BASE}/consultation/${id}/results`);
  if (!res.ok) throw new Error("Failed to fetch assessment results");
  return res.json();
}

// Fetch history
export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/consultations`);
  if (!res.ok) throw new Error("Failed to fetch assessment history");
  return res.json();
}

// Fetch admin stats
export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/admin/stats`);
  if (!res.ok) throw new Error("Failed to fetch admin stats");
  return res.json();
}

// Fetch rules & knowledge base
export async function fetchRules(): Promise<RulesResponse> {
  const res = await fetch(`${API_BASE}/admin/rules`);
  if (!res.ok) throw new Error("Failed to fetch rules");
  return res.json();
}

// Simulate rules
export async function simulateInference(answers: AnswerInput[], threshold: number): Promise<{
  threshold: number;
  results: EvaluationResult[];
}> {
  const res = await fetch(`${API_BASE}/admin/rules/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, threshold }),
  });
  if (!res.ok) throw new Error("Failed to run rules simulation");
  return res.json();
}

// Fetch settings
export async function fetchSettings(): Promise<Record<string, string>> {
  const res = await fetch(`${API_BASE}/admin/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

// Update settings
export async function updateSettings(settings: Record<string, string>): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}
