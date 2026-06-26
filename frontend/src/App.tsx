import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ChildIntakePage from './pages/ChildIntakePage'
import AssessmentPage from './pages/AssessmentPage'
import ResultsPage from './pages/ResultsPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminRulesPage from './pages/AdminRulesPage'
import ResourcesPage from './pages/ResourcesPage'
import HistoryPage from './pages/HistoryPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminRoute from './components/layout/AdminRoute'
import AdminVariablesPage from './pages/AdminVariablesPage'
import AdminIndicatorsPage from './pages/AdminIndicatorsPage'
import AdminCriteriaPage from './pages/AdminCriteriaPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import AdminAssessmentsPage from './pages/AdminAssessmentsPage'
import UserLoginPage from './pages/UserLoginPage'
import UserRegisterPage from './pages/UserRegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/assessments" element={<HistoryPage />} />
        <Route path="/assessment/start" element={<ChildIntakePage />} />
        <Route path="/assessment/:pageId" element={<AssessmentPage />} />
        <Route path="/results/:assessmentId" element={<ResultsPage />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/assessments" element={<AdminAssessmentsPage />} />
          <Route path="/admin/rules" element={<AdminRulesPage />} />
          <Route path="/admin/variables" element={<AdminVariablesPage />} />
          <Route path="/admin/indicators" element={<AdminIndicatorsPage />} />
          <Route path="/admin/criteria" element={<AdminCriteriaPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

