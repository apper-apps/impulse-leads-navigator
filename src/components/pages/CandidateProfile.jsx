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

const CandidateProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
          {candidate.workHistory && candidate.workHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {candidate.workHistory.filter(w => !w.isExternal).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">HHS Experience</h4>
                      <div className="space-y-3">
                        {candidate.workHistory.filter(w => !w.isExternal).map((work, index) => (
                          <div key={index} className="border-l-2 border-primary pl-4">
                            <h5 className="font-medium text-gray-900">{work.title}</h5>
                            <p className="text-sm text-gray-600">{work.division}</p>
                            <p className="text-xs text-gray-500">
                              {work.startDate && format(new Date(work.startDate), "MMM yyyy")} - 
                              {work.endDate ? format(new Date(work.endDate), "MMM yyyy") : "Present"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidate.workHistory.filter(w => w.isExternal).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">External Experience</h4>
                      <div className="space-y-3">
                        {candidate.workHistory.filter(w => w.isExternal).map((work, index) => (
                          <div key={index} className="border-l-2 border-secondary pl-4">
                            <h5 className="font-medium text-gray-900">{work.title}</h5>
                            <p className="text-sm text-gray-600">{work.division}</p>
                            <p className="text-xs text-gray-500">
                              {work.startDate && format(new Date(work.startDate), "MMM yyyy")} - 
                              {work.endDate ? format(new Date(work.endDate), "MMM yyyy") : "Present"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-success pl-4">
                      <h5 className="font-medium text-gray-900">{edu.program}</h5>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-xs text-gray-500">{edu.level}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Development Plan */}
          {candidate.developmentPlan && (candidate.developmentPlan.keyAreas || candidate.developmentPlan.actions) && (
            <Card>
              <CardHeader>
                <CardTitle>Development Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.developmentPlan.keyAreas && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Key Development Areas</label>
                    <p className="text-gray-900 mt-1">{candidate.developmentPlan.keyAreas}</p>
                  </div>
                )}
                {candidate.developmentPlan.actions && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Planned Actions</label>
                    <p className="text-gray-900 mt-1">{candidate.developmentPlan.actions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* LEADS Score Overview */}
          {hasLeadsScores && (
            <Card>
              <CardHeader>
                <CardTitle>LEADS Score Overview</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <ProgressRing
                  progress={candidate.totalLeadsScore ? (candidate.totalLeadsScore / 25) * 100 : 0}
                  value={candidate.totalLeadsScore ? candidate.totalLeadsScore.toFixed(1) : "0.0"}
                  label="Total Score"
                  size={120}
                />
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-600">Development Pathway</div>
                  <StatusBadge status={candidate.developmentPathway || "Not Assessed"} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* LEADS Domain Scores */}
          {hasLeadsScores && (
            <Card>
              <CardHeader>
                <CardTitle>Domain Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(leadsScores).map(([domain, score]) => {
                  const domainLabels = {
                    leadSelf: "Lead Self",
                    engageOthers: "Engage Others", 
                    achieveResults: "Achieve Results",
                    developCoalitions: "Develop Coalitions",
                    systemsTransformation: "Systems Transformation"
                  }
                  
                  return score?.behavioralLevel ? (
                    <div key={domain} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{domainLabels[domain]}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{score.behavioralLevel}/5</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${(parseInt(score.behavioralLevel) / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null
                })}
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