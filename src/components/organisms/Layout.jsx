import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import Header from "@/components/organisms/Header"
import Sidebar from "@/components/organisms/Sidebar"
import Dashboard from "@/components/pages/Dashboard"
import Candidates from "@/components/pages/Candidates"
import SuccessionForm from "@/components/pages/SuccessionForm"
import LeadsAssessment from "@/components/pages/LeadsAssessment"
import Reports from "@/components/pages/Reports"
import Settings from "@/components/pages/Settings"
import CandidateProfile from "@/components/pages/CandidateProfile"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="h-full p-3 md:p-4 lg:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidates/:id" element={<CandidateProfile />} />
              <Route path="/succession-form" element={<SuccessionForm />} />
              <Route path="/succession-form/:id" element={<SuccessionForm />} />
              <Route path="/leads-assessment" element={<LeadsAssessment />} />
              <Route path="/leads-assessment/:id" element={<LeadsAssessment />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout