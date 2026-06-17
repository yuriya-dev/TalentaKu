import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import ChildIntake from "./pages/ChildIntake";
import AssessmentWizard from "./pages/AssessmentWizard";
import Results from "./pages/Results";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRules from "./pages/AdminRules";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/intake" element={<ChildIntake />} />
        <Route path="/assessment/:id" element={<AssessmentWizard />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="/history" element={<History />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/rules" element={<AdminRules />} />
      </Routes>
    </Router>
  );
}

export default App;
