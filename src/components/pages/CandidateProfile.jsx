import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import StatusBadge from "@/components/molecules/StatusBadge"
import ProgressRing from "@/components/molecules/ProgressRing"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { candidateService } from "@/services/api/candidateService"
import { format } from "date-fns"
import Chart from "react-apexcharts"

const CandidateProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeChart, setActiveChart] = useState("trend")

  const loadCandidate = async () => {
    try {
      setLoading(true)
      setError("")
      await new Promise(resolve => setTimeout(resolve, 500))
      const data = await candidateService.getById(parseInt(id))
      setCandidate(data)
    } catch (err) {
      setError("Failed to load candidate profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCandidate()
  }, [id])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadCandidate} />
  if (!candidate) return <Error message="Candidate not found" />

  const leadsScores = candidate.leadsScores || {}
  const hasLeadsScores = Object.values(leadsScores).some(domain => domain?.behavioralLevel)
  const historicalData = candidate.historicalLeadsData || []

  const domainLabels = {
    leadSelf: "Lead Self",
    engageOthers: "Engage Others", 
    achieveResults: "Achieve Results",
    developCoalitions: "Develop Coalitions",
    systemsTransformation: "Systems Transformation"
  }

  const domainColors = {
    leadSelf: "#0056b3",
    engageOthers: "#17a2b8",
    achieveResults: "#28a745",
    developCoalitions: "#ffc107",
    systemsTransformation: "#dc3545"
  }

  // Generate trend line chart data
  const getTrendChartOptions = () => {
    if (!historicalData.length) return { series: [], options: {} }

    const series = Object.keys(domainLabels).map(domain => ({
      name: domainLabels[domain],
      data: historicalData.map(entry => ({
        x: entry.date,
        y: entry.scores[domain] || 0
      })),
      color: domainColors[domain]
    }))

    const options = {
      chart: {
        type: 'line',
        height: 350,
        toolbar: { show: true },
        animations: { enabled: true, speed: 800 }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'MMM yyyy'
        }
      },
      yaxis: {
        min: 0,
        max: 5,
        tickAmount: 5,
        labels: {
          formatter: (val) => val.toFixed(1)
        }
      },
      tooltip: {
        x: {
          format: 'MMM yyyy'
        },
        y: {
          formatter: (val) => `${val}/5`
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      grid: {
        borderColor: '#f1f5f9'
      }
    }

    return { series, options }
  }

  // Generate current scores bar chart
  const getCurrentScoresChart = () => {
    const series = [{
      name: 'Current Score',
      data: Object.entries(leadsScores).map(([domain, score]) => ({
        x: domainLabels[domain],
        y: parseInt(score?.behavioralLevel) || 0,
        fillColor: domainColors[domain]
      }))
    }]

    const options = {
      chart: {
        type: 'bar',
        height: 300,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          distributed: true,
          horizontal: false
        }
      },
      xaxis: {
        categories: Object.values(domainLabels),
        labels: {
          style: { fontSize: '12px' }
        }
      },
      yaxis: {
        min: 0,
        max: 5,
        tickAmount: 5
      },
      tooltip: {
        y: {
          formatter: (val) => `${val}/5`
        }
      },
      legend: { show: false },
      grid: {
        borderColor: '#f1f5f9'
      }
    }

    return { series, options }
  }

  // Generate progress comparison chart
  const getProgressChart = () => {
    if (!historicalData.length) return { series: [], options: {} }

    const firstEntry = historicalData[0]
    const lastEntry = historicalData[historicalData.length - 1]

    const series = [{
      name: 'Initial Score',
      data: Object.entries(domainLabels).map(([domain, label]) => 
        firstEntry.scores[domain] || 0
      )
    }, {
      name: 'Current Score',
      data: Object.entries(domainLabels).map(([domain, label]) => 
        lastEntry.scores[domain] || 0
      )
    }]

    const options = {
      chart: {
        type: 'radar',
        height: 350
      },
      xaxis: {
        categories: Object.values(domainLabels)
      },
      yaxis: {
        min: 0,
        max: 5,
        tickAmount: 5
      },
      colors: ['#dc3545', '#28a745'],
      markers: {
        size: 4
      },
      legend: {
        position: 'top'
      }
    }

    return { series, options }
  }
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {candidate.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
            <p className="text-gray-600">{candidate.department} • {candidate.portfolio}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate("/candidates")}>
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/succession-form/${candidate.Id}`)}>
            <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button onClick={() => navigate(`/leads-assessment/${candidate.Id}`)}>
            <ApperIcon name="Target" className="w-4 h-4 mr-2" />
            LEADS Assessment
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Performance Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={candidate.performanceRating || "Not Rated"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Potential Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={candidate.potentialRating || "Not Rated"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Readiness Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={candidate.readinessRating || "Not Assessed"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Risk of Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={candidate.retentionProfile?.riskOfLoss || "Unknown"} />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-gray-900">{candidate.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Portfolio</label>
                  <p className="text-gray-900">{candidate.portfolio}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Length of Service</label>
                  <p className="text-gray-900">{candidate.lengthOfService} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Time to Readiness</label>
                  <p className="text-gray-900">{candidate.timeToReadiness || "Not Assessed"}</p>
                </div>
              </div>
              
              {candidate.credentials && candidate.credentials.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Credentials</label>
                  <div className="mt-1">
                    {candidate.credentials.map((credential, index) => (
                      <p key={index} className="text-gray-900">{credential}</p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

{/* LEADS Score Analysis with Interactive Charts */}
          {hasLeadsScores && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="flex items-center space-x-2">
                    <ApperIcon name="TrendingUp" size={20} />
                    <span>LEADS Score Analysis</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-2xl font-bold text-primary">{candidate.totalLeadsScore}</span>
                      <span className="text-sm text-gray-500">/25</span>
                    </div>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={activeChart === "trend" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setActiveChart("trend")}
                    >
                      <ApperIcon name="TrendingUp" size={16} />
                      Trend
                    </Button>
                    <Button
                      variant={activeChart === "current" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setActiveChart("current")}
                    >
                      <ApperIcon name="BarChart3" size={16} />
                      Current
                    </Button>
                    <Button
                      variant={activeChart === "progress" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setActiveChart("progress")}
                    >
                      <ApperIcon name="Target" size={16} />
                      Progress
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <StatusBadge status={candidate.readinessRating} />
                    <p className="text-xs text-gray-500 mt-1">Readiness</p>
                  </div>
                  <div>
                    <span className="font-medium">{candidate.timeToReadiness}</span>
                    <p className="text-xs text-gray-500 mt-1">Time to Ready</p>
                  </div>
                  <div>
                    <span className="font-medium">{candidate.developmentPathway}</span>
                    <p className="text-xs text-gray-500 mt-1">Development</p>
                  </div>
                </div>

                {/* Chart Display */}
                <div className="w-full">
                  {activeChart === "trend" && historicalData.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Score Progression Over Time</h4>
                      <Chart
                        options={getTrendChartOptions().options}
                        series={getTrendChartOptions().series}
                        type="line"
                        height={350}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Track how LEADS domain scores have evolved over time, showing improvement trends and areas of focus.
                      </p>
                    </div>
                  )}

                  {activeChart === "trend" && historicalData.length === 0 && (
                    <div className="text-center py-8">
                      <ApperIcon name="TrendingUp" size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No historical data available for trend analysis</p>
                    </div>
                  )}

                  {activeChart === "current" && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Current Domain Scores</h4>
                      <Chart
                        options={getCurrentScoresChart().options}
                        series={getCurrentScoresChart().series}
                        type="bar"
                        height={300}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Current performance across all five LEADS domains, showing strengths and development opportunities.
                      </p>
                    </div>
                  )}

                  {activeChart === "progress" && historicalData.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Overall Progress Comparison</h4>
                      <Chart
                        options={getProgressChart().options}
                        series={getProgressChart().series}
                        type="radar"
                        height={350}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Radar chart comparing initial scores with current performance, highlighting areas of greatest improvement.
                      </p>
                    </div>
                  )}

                  {activeChart === "progress" && historicalData.length === 0 && (
                    <div className="text-center py-8">
                      <ApperIcon name="Target" size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No historical data available for progress comparison</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* LEADS Domain Details */}
          {hasLeadsScores && (
            <Card>
              <CardHeader>
                <CardTitle>Domain Assessment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(leadsScores).map(([domain, score]) => {
                  return score?.behavioralLevel ? (
                    <div key={domain} className="border-l-4 pl-4" style={{ borderColor: domainColors[domain] }}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{domainLabels[domain]}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg" style={{ color: domainColors[domain] }}>
                            {score.behavioralLevel}/5
                          </span>
                          <div className="w-20 bg-gray-200 rounded-full h-3">
                            <div
                              className="h-3 rounded-full transition-all"
                              style={{ 
                                width: `${(parseInt(score.behavioralLevel) / 5) * 100}%`,
                                backgroundColor: domainColors[domain]
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {score.evidence && (
                        <div className="mb-2">
                          <label className="text-sm font-medium text-gray-500">Evidence</label>
                          <p className="text-gray-700 text-sm mt-1">{score.evidence}</p>
                        </div>
                      )}
                      {score.notes && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Development Notes</label>
                          <p className="text-gray-700 text-sm mt-1">{score.notes}</p>
                        </div>
                      )}
                    </div>
                  ) : null
                })}
              </CardContent>
            </Card>
          )}

          {/* LEADS Accomplishments */}
          {(candidate.leadershipAccomplishments || candidate.demonstratedStrengths) && (
            <Card>
              <CardHeader>
                <CardTitle>LEADS-Based Accomplishments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.leadershipAccomplishments && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Leadership Accomplishments</label>
                    <p className="text-gray-900 mt-1">{candidate.leadershipAccomplishments}</p>
                  </div>
                )}
                {candidate.demonstratedStrengths && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Demonstrated Strengths</label>
                    <p className="text-gray-900 mt-1">{candidate.demonstratedStrengths}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Work Experience */}
          {candidate.workHistory && (
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.workHistory.map((job, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-gray-600">{job.division}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(job.startDate), "MMM yyyy")} - {job.endDate ? format(new Date(job.endDate), "MMM yyyy") : "Present"}
                        </p>
                      </div>
                      {job.isExternal && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          External
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {candidate.education && (
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.program}</h4>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {edu.level}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Development Plan */}
          {candidate.developmentPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Development Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Key Development Areas</label>
                  <p className="text-gray-900 mt-1">{candidate.developmentPlan.keyAreas}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Recommended Actions</label>
                  <p className="text-gray-900 mt-1">{candidate.developmentPlan.actions}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Retention Profile */}
          {candidate.retentionProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Retention Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Retention Factors</label>
                  <p className="text-gray-900 mt-1">{candidate.retentionProfile.factors}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Potential Reason for Leaving</label>
                  <p className="text-gray-900 mt-1">{candidate.retentionProfile.reasonForLeaving}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Impact of Loss</label>
                    <StatusBadge 
                      status={candidate.retentionProfile.impactOfLoss} 
                      variant={candidate.retentionProfile.impactOfLoss === "High" ? "error" : 
                              candidate.retentionProfile.impactOfLoss === "Medium" ? "warning" : "success"}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Risk of Loss</label>
                    <StatusBadge 
                      status={candidate.retentionProfile.riskOfLoss} 
                      variant={candidate.retentionProfile.riskOfLoss === "High" ? "error" : 
                              candidate.retentionProfile.riskOfLoss === "Medium" ? "warning" : "success"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Retention Profile */}
          {candidate.retentionProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Retention Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.retentionProfile.factors && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Retention Factors</label>
                    <p className="text-gray-900 text-sm mt-1">{candidate.retentionProfile.factors}</p>
                  </div>
                )}
                {candidate.retentionProfile.reasonForLeaving && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Potential Reason for Leaving</label>
                    <p className="text-gray-900 text-sm mt-1">{candidate.retentionProfile.reasonForLeaving}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Impact of Loss</label>
                  <div className="mt-1">
                    <StatusBadge status={candidate.retentionProfile.impactOfLoss || "Unknown"} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/succession-form/${candidate.Id}`)}
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-3" />
                Edit Succession Form
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/leads-assessment/${candidate.Id}`)}
              >
                <ApperIcon name="Target" className="w-4 h-4 mr-3" />
                Update LEADS Assessment
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/reports")}
              >
                <ApperIcon name="FileText" className="w-4 h-4 mr-3" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CandidateProfile