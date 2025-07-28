import candidatesData from '@/services/mockData/candidates.json'

// Mock authentication service
class AuthService {
  constructor() {
    this.currentUser = null
    this.isAuthenticated = false
  }

  // Get all available users (candidates + admin)
  getUsers() {
    const candidates = candidatesData.map(candidate => ({
      id: candidate.Id,
      username: candidate.username,
      password: 'candidate123',
      name: candidate.name,
      role: 'candidate',
      department: candidate.department,
      portfolio: candidate.portfolio
    }))

    const admin = {
      id: 'admin',
      username: 'admin',
      password: 'admin123',
      name: 'System Administrator',
      role: 'admin',
      department: 'Administration',
      portfolio: 'System Management'
    }

    return [...candidates, admin]
  }

  // Login method
  async login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers()
        const user = users.find(u => u.username === username && u.password === password)
        
        if (user) {
          this.currentUser = { ...user }
          delete this.currentUser.password // Remove password from stored user
          this.isAuthenticated = true
          
          // Store in localStorage for persistence
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
          localStorage.setItem('isAuthenticated', 'true')
          
          resolve({
            success: true,
            user: this.currentUser,
            message: `Welcome back, ${user.name}!`
          })
        } else {
          reject({
            success: false,
            message: 'Invalid username or password. Please try again.'
          })
        }
      }, 800) // Simulate network delay
    })
  }

  // Logout method
  logout() {
    this.currentUser = null
    this.isAuthenticated = false
    
    // Clear localStorage
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isAuthenticated')
    
    return {
      success: true,
      message: 'You have been logged out successfully.'
    }
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    // Check memory first
    if (this.isAuthenticated && this.currentUser) {
      return true
    }
    
    // Check localStorage
    const storedAuth = localStorage.getItem('isAuthenticated')
    const storedUser = localStorage.getItem('currentUser')
    
    if (storedAuth === 'true' && storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser)
        this.isAuthenticated = true
        return true
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('currentUser')
        localStorage.removeItem('isAuthenticated')
        return false
      }
    }
    
    return false
  }

  // Get current user
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser
    }
    
    // Try to get from localStorage
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser)
        return this.currentUser
      } catch (error) {
        return null
      }
    }
    
    return null
  }

  // Get available demo credentials (for help/demo purposes)
  getDemoCredentials() {
    const candidates = candidatesData.slice(0, 3).map(candidate => ({
      username: candidate.username,
      name: candidate.name,
      role: 'Candidate'
    }))

    return [
      ...candidates,
      {
        username: 'admin',
        name: 'System Administrator',
        role: 'Admin'
      }
    ]
  }
}

// Create singleton instance
const authService = new AuthService()

export default authService