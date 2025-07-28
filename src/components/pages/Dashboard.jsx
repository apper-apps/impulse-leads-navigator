import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import StatusBadge from "@/components/molecules/StatusBadge"
import ProgressRing from "@/components/molecules/ProgressRing"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { candidateService } from "@/services/api/candidateService"

const Dashboard = () => {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      await new Promise(resolve => setTimeout(resolve, 800))
      const data = await candidateService.getAll()
      setCandidates(data)
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const stats = {
    totalCandidates: candidates.length,
    readyCandidates: candidates.filter(c => c.readinessRating === "Ready").length,
    developingCandidates: candidates.filter(c => c.readinessRating === "Developing").length,
    highRisk: candidates.filter(c => c.retentionProfile?.riskOfLoss === "High").length
  }

  const recentCandidates = candidates.slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to LEADS Navigator - Succession Planning Platform</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => navigate("/succession-form")}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Succession Form
          </Button>
          <Button variant="secondary" onClick={() => navigate("/leads-assessment")}>
            <ApperIcon name="Target" className="w-4 h-4 mr-2" />
            LEADS Assessment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-primary">{stats.totalCandidates}</div>
              <ApperIcon name="Users" className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Ready Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-success">{stats.readyCandidates}</div>
              <ApperIcon name="CheckCircle" className="w-8 h-8 text-success/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Developing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-warning">{stats.developingCandidates}</div>
              <ApperIcon name="TrendingUp" className="w-8 h-8 text-warning/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-error">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-error">{stats.highRisk}</div>
              <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Candidates */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Candidates</CardTitle>
              <Button variant="ghost" onClick={() => navigate("/candidates")}>
                <span className="text-sm">View All</span>
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div
                  key={candidate.Id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/candidates/${candidate.Id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {candidate.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-500">{candidate.department}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={candidate.readinessRating || "Not Assessed"} />
                    <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Progress */}
        <div className="space-y-6">
          {/* Readiness Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Readiness Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ProgressRing
                progress={stats.totalCandidates > 0 ? Math.round((stats.readyCandidates / stats.totalCandidates) * 100) : 0}
                value={`${stats.readyCandidates}/${stats.totalCandidates}`}
                label="Ready"
                color="#28a745"
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/succession-form")}
              >
                <ApperIcon name="FileText" className="w-4 h-4 mr-3" />
                Create Succession Form
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/leads-assessment")}
              >
                <ApperIcon name="Target" className="w-4 h-4 mr-3" />
                LEADS Assessment
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/reports")}
              >
                <ApperIcon name="BarChart3" className="w-4 h-4 mr-3" />
                Generate Reports
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/candidates")}
              >
                <ApperIcon name="Users" className="w-4 h-4 mr-3" />
                View All Candidates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard