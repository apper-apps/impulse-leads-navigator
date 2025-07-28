import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import StatusBadge from "@/components/molecules/StatusBadge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { candidateService } from "@/services/api/candidateService"

const Candidates = () => {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [filteredCandidates, setFilteredCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [readinessFilter, setReadinessFilter] = useState("")
  const [riskFilter, setRiskFilter] = useState("")

  const loadCandidates = async () => {
    try {
      setLoading(true)
      setError("")
      await new Promise(resolve => setTimeout(resolve, 600))
      const data = await candidateService.getAll()
      setCandidates(data)
      setFilteredCandidates(data)
    } catch (err) {
      setError("Failed to load candidates. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCandidates()
  }, [])

  useEffect(() => {
    let filtered = candidates

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.portfolio.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (departmentFilter) {
      filtered = filtered.filter(candidate => candidate.department === departmentFilter)
    }

    if (readinessFilter) {
      filtered = filtered.filter(candidate => candidate.readinessRating === readinessFilter)
    }

    if (riskFilter) {
      filtered = filtered.filter(candidate => 
        candidate.retentionProfile?.riskOfLoss === riskFilter
      )
    }

    setFilteredCandidates(filtered)
  }, [searchTerm, departmentFilter, readinessFilter, riskFilter, candidates])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadCandidates} />

  const departments = [...new Set(candidates.map(c => c.department))]
  const readinessLevels = ["Ready", "Developing", "Not Ready"]
  const riskLevels = ["High", "Medium", "Low"]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-2">Manage succession planning candidates and their assessments</p>
        </div>
        <Button onClick={() => navigate("/succession-form")}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <SearchBar
                onSearch={setSearchTerm}
                placeholder="Search candidates..."
              />
            </div>
            <Select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Select>
            <Select value={readinessFilter} onChange={(e) => setReadinessFilter(e.target.value)}>
              <option value="">All Readiness</option>
              {readinessLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </Select>
            <Select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="">All Risk Levels</option>
              {riskLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      {filteredCandidates.length === 0 ? (
        <Empty
          title="No candidates found"
          description="No candidates match your current filters. Try adjusting your search criteria or add a new candidate."
          actionLabel="Add Candidate"
          onAction={() => navigate("/succession-form")}
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.Id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <p className="text-sm text-gray-600">{candidate.department}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Portfolio</p>
                  <p className="font-medium">{candidate.portfolio}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Performance</p>
                    <StatusBadge status={candidate.performanceRating} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Potential</p>
                    <StatusBadge status={candidate.potentialRating} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Readiness</p>
                    <StatusBadge status={candidate.readinessRating || "Not Assessed"} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Risk of Loss</p>
                    <StatusBadge status={candidate.retentionProfile?.riskOfLoss || "Unknown"} />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    {candidate.lengthOfService} years service
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/succession-form/${candidate.Id}`)
                      }}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/leads-assessment/${candidate.Id}`)
                      }}
                    >
                      <ApperIcon name="Target" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/candidates/${candidate.Id}`)
                      }}
                    >
                      <ApperIcon name="Eye" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Candidates