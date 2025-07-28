import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '@/services/api/authService'
import { toast } from 'react-toastify'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const isAuth = authService.isUserAuthenticated()
        const currentUser = authService.getCurrentUser()
        
        if (isAuth && currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password)
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        
        // Navigate to dashboard after successful login
        navigate('/', { replace: true })
        
        return result
      }
    } catch (error) {
      throw error
    }
  }

  // Logout function
  const logout = () => {
    try {
      const result = authService.logout()
      
      setUser(null)
      setIsAuthenticated(false)
      
      // Navigate to login page
      navigate('/login', { replace: true })
      
      toast.success(result.message)
      
      return result
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An error occurred during logout')
    }
  }

  // Get demo credentials
  const getDemoCredentials = () => {
    return authService.getDemoCredentials()
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role
  }

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin'
  }

  // Check if user is candidate
  const isCandidate = () => {
    return user?.role === 'candidate'
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    getDemoCredentials,
    hasRole,
    isAdmin,
    isCandidate
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext