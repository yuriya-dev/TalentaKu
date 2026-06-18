# TalentaKu - Sistem Pakar Penentuan Bakat Anak

**TalentaKu** is an AI-native expert system platform designed to identify childhood talents in children aged 4-6 (Kindergarten level). Based on the US Office of Education (USOE) standards and psychometric research, the system utilizes a **Forward Chaining** inference engine to translate 83 behavioral variables (C1-C83) into 27 indicators (I1-I27), which then map to 6 primary talent categories (K1-K6).

---

## 🚀 Key Features

### 👤 User Flow (Parents & Teachers)
- **Landing Page:** Professional methodology introduction explaining Forward Chaining and the USOE scientific standards.
- **Child Profiling:** Simple intake form capturing the child's name, age (4-6), and school information.
- **Guided Assessment (Wizard):** An 83-question psychometric consultation utilizing a 5-point Likert Scale (Never to Always) divided by cognitive categories.
- **Results Dashboard:** 
  - Top-3 Talent Ranking with confidence scores.
  - Development Paths containing tailored suggestions for activity planning.
  - **Inference Trace:** Complete transparency showing the exact rules and behavioral observations that led to the talent determination.

### 🔑 Admin Flow (Expert Management)
- **System Overview:** Aggregate analytics on talent distribution and assessment volume.
- **Variable & Indicator CRUD:** Manage the 83 behavioral variables and 27 indicators.
- **Visual Rule Builder:** Configure the 33-rule knowledge base logic through a graphical UI.
- **Simulation Engine:** Test proposed rule changes against sample inputs before committing updates to the live DB.

---

## 🛠️ Tech Stack

### Backend
- **Language:** Go (Golang) v1.26+
- **Web Framework:** [Fiber v2](https://gofiber.io/)
- **Database ORM:** [GORM](https://gorm.io/)
- **Database:** SQLite (local file database)

### Frontend
- **Framework:** React v19 + [Vite](https://vite.dev/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7

---

## 📐 Inference Engine Logic (Forward Chaining)

The inference process works in a two-tier logical chain:
1. **Level 1 (Variables → Indicators):** Groups of behavioral observations (C-codes) are evaluated against an admin-configurable Likert threshold (default $\ge 4$, meaning "Often" or "Always"). Once confirmed, they activate specific Indicators (I-codes).
2. **Level 2 (Indicators → Criteria):** Activated indicators trigger predefined logical rule combinations (AND-gates) that confirm one or more primary Talent Criteria (K-codes).

---

## 📦 Directory Structure

```text
TalentaKu/
├── backend/                  # Go Backend Application
│   ├── db/                   # Database connection, automigrations & seeds
│   ├── engine/               # Forward Chaining inference engine
│   ├── handlers/             # REST API controllers
│   ├── models/               # Gorm Database models
│   ├── go.mod                # Go module configuration
│   └── main.go               # Backend entrypoint
│
├── frontend/                 # React Frontend Application
│   ├── src/                  # React source files
│   ├── public/               # Public static assets
│   ├── index.html            # Vite HTML entrypoint
│   ├── package.json          # Node dependencies and scripts
│   └── vite.config.ts        # Vite configuration
│
├── PRD.md                    # Product Requirement Document
├── project_brief.md          # Project description and technical constraints
└── README.md                 # This file
```

---

## 💻 How to Run the Application

Follow these steps to set up and run the application locally on your computer.

### Prerequisites
Make sure you have the following installed:
- **Go** (v1.22 or higher)
- **Node.js** (v18 or higher) & **npm**

---

### 1. Set Up and Run the Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Download Go module dependencies:
   ```bash
   go mod download
   ```

3. Run the backend server:
   ```bash
   go run main.go
   ```
   *Note: On first startup, GORM will automatically create a SQLite database file (`talentaku.db`) in the `backend` directory, run all migrations, and seed all the initial variables (C1-C83), indicators, rules, and settings.*

   The backend API will run on: **`http://localhost:8080`**

---

### 2. Set Up and Run the Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

   The frontend dashboard will run on: **`http://localhost:5173`** (or the port specified in the terminal).

---

## ⚙️ Environment Variables

### Backend
The backend can optionally be configured using the following environment variables:
- `PORT` (Default: `8080`): Port on which the Fiber web server listens.
- `DATABASE_URL` (Default: `talentaku.db`): Path to the SQLite database file.
