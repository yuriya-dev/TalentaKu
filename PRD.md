# Project PRD: Talentku - Sistem Pakar Penentuan Bakat Anak

## 1. Product Overview
**Talentku** is an AI-native expert system platform designed to identify childhood talents in children aged 4-6 (Kindergarten level). Based on the US Office of Education (USOE) standards and research by Salisah, Lidya, and Defit (2015), the system utilizes a **Forward Chaining** inference engine to translate 83 behavioral variables into 6 primary talent categories.

### Vision
To provide parents and teachers with a scientifically grounded yet accessible tool to discover and nurture a child's natural potential through professional-grade psychometric observation.

---

## 2. Target Audience
- **Parents:** Seeking to understand their child's strengths and looking for actionable guidance on development.
- **Teachers/School Administrators:** Identifying classroom talent distributions and tailoring educational approaches.
- **System Administrators:** Educational psychologists or technical admins managing the knowledge base (rules, variables, and indicators).

---

## 3. Core Features & Functional Requirements

### 3.1 User Experience (Parent/Teacher Flow)
- **Landing Page:** Professional introduction to the methodology (Forward Chaining) and scientific standards (USOE).
- **Child Profiling:** Simple intake for child's name, age (4-6), and school information.
- **Guided Assessment (Wizard):**
    - 83-question consultation using a 5-point Likert Scale (Never to Always).
    - Categorized progress (Language, Logic, Creativity, etc.) to reduce cognitive load.
    - Motion-enhanced transitions for a "friendly consultation" feel.
- **Results Dashboard:**
    - Top-3 Talent Ranking with confidence scores.
    - Narrative descriptions of identified strengths.
    - Actionable "Development Paths" with specific activity suggestions.
    - "Inference Trace" transparency (explaining *why* a talent was identified).

### 3.2 Admin Experience (Expert Management)
- **System Overview:** Aggregate analytics on talent distribution and assessment volume.
- **Variable Management:** CRUD operations for the 83 psychometric variables (C1-C83).
- **Indicator Mapping:** Managing the 27 indicators (I1-I27) that bridge variables and criteria.
- **Visual Rule Builder:** A visual interface to manage the 33-rule logic without coding.
- **Simulation Engine:** Ability to test rule changes against sample data before deployment.

---

## 4. Technical Architecture

### 4.1 Inference Engine: Forward Chaining
The system operates on a two-level inference logic:
1.  **Level 1 (Variables → Indicators):** Groups of specific behaviors (C-codes) confirm an indicator (I-codes).
2.  **Level 2 (Indicators → Criteria):** Combinations of indicators confirm a Talent Criterion (K-codes).

### 4.2 Data Normalization
- **Likert-to-Binary Threshold:** Admin-configurable threshold (default: Score ≥ 4) to determine if a variable is "TRUE" for the AND-logic rules.
- **Scoring:** Percentage-based confidence scores calculated via weighted averages of confirmed indicators.

---

## 5. Design System: "Growth Catalyst"
- **Primary Color:** #4F46E5 (Indigo) - Represents trust and professionalism.
- **Secondary Color:** #06B6D4 (Cyan) - Represents clarity and modern tech.
- **Success Color:** #10B981 (Emerald) - Represents growth and positive results.
- **Typography:** Inter (Sans-serif) for high readability across devices.
- **Tone & Voice:** Encouraging, professional, warm, and data-backed.

---

## 6. Success Metrics
- **Assessment Completion Rate:** Percentage of users who finish all 83 questions.
- **System Accuracy:** Alignment between system identification and professional psychologist evaluation (Target: >85%).
- **User Trust:** Qualitative feedback on the "Development Path" utility.

---

## 7. Roadmap
- **Phase 1 (MVP):** Core Forward Chaining engine, 83-question wizard, and results page.
- **Phase 2 (Admin):** Visual Rule Builder and Variable management.
- **Phase 3 (Expansion):** PDF report export, multi-child comparison, and longitudinal progress tracking.
