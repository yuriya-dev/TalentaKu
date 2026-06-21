import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ChildIntakePage from './pages/ChildIntakePage'
import AssessmentPage from './pages/AssessmentPage'
import ResultsPage from './pages/ResultsPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminRulesPage from './pages/AdminRulesPage'
import ResourcesPage from './pages/ResourcesPage'
import HistoryPage from './pages/HistoryPage'

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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/rules" element={<AdminRulesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
