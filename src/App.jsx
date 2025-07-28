import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "@/contexts/AuthContext"
import Layout from "@/components/organisms/Layout"
import LoginPage from "@/components/pages/LoginPage"
import { useAuth } from "@/contexts/AuthContext"

// App content component that uses auth context
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {isAuthenticated ? <Layout /> : <LoginPage />}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16 !top-20 md:!top-16 !left-4 !right-4 md:!left-auto md:!right-4 !max-w-sm"
      />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App