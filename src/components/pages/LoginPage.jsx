import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const { login, getDemoCredentials } = useAuth()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error('Please enter both username and password')
      return
    }

    setLoading(true)
    
    try {
      await login(formData.username, formData.password)
      toast.success('Login successful! Welcome to LEADS Navigator.')
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const demoCredentials = getDemoCredentials()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="Users" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LEADS Navigator</h1>
          <p className="text-gray-600">Healthcare Leadership Assessment Platform</p>
        </div>

        {/* Login Form */}
        <Card className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In</h2>
            <p className="text-sm text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                disabled={loading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center">
                  <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center">
                  <ApperIcon name="LogIn" size={16} className="mr-2" />
                  Sign In
                </span>
              )}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials */}
        <Card className="p-6">
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            <span className="flex items-center">
              <ApperIcon name="Info" size={16} className="mr-2" />
              Demo Credentials
            </span>
            <ApperIcon 
              name={showCredentials ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </button>
          
          {showCredentials && (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-gray-600 mb-3">
                Use these temporary credentials to access the application:
              </p>
              
              {demoCredentials.map((cred, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-900">{cred.name}</span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {cred.role}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>Username: <code className="bg-white px-1 rounded">{cred.username}</code></div>
                    <div>Password: <code className="bg-white px-1 rounded">
                      {cred.role === 'Admin' ? 'admin123' : 'candidate123'}
                    </code></div>
                  </div>
                </div>
              ))}
              
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  <ApperIcon name="AlertTriangle" size={14} className="inline mr-1" />
                  These are temporary demo credentials for evaluation purposes only.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default LoginPage