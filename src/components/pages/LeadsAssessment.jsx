import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import FormField from "@/components/molecules/FormField"
import TabNavigation from "@/components/molecules/TabNavigation"
import ProgressRing from "@/components/molecules/ProgressRing"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { candidateService } from "@/services/api/candidateService"
import { leadsService } from "@/services/api/leadsService"

const LeadsAssessment = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("leadSelf")

  const [scores, setScores] = useState({
    leadSelf: { behavioralLevel: "", evidence: "", developmentNeeded: "", notes: "" },
    engageOthers: { behavioralLevel: "", evidence: "", developmentNeeded: "", notes: "" },
    achieveResults: { behavioralLevel: "", evidence: "", developmentNeeded: "", notes: "" },
    developCoalitions: { behavioralLevel: "", evidence: "", developmentNeeded: "", notes: "" },
    systemsTransformation: { behavioralLevel: "", evidence: "", developmentNeeded: "", notes: "" }
  })

  const [calculatedResults, setCalculatedResults] = useState({
    totalScore: 0,
    readinessRating: "",
    timeToReadiness: "",
    developmentPathway: ""
  })

  const domains = [
    { id: "leadSelf", label: "Lead Self", description: "Self-awareness, emotional regulation, and personal accountability" },
    { id: "engageOthers", label: "Engage Others", description: "Building relationships, communication, and influence" },
    { id: "achieveResults", label: "Achieve Results", description: "Goal setting, execution, and performance management" },
    { id: "developCoalitions", label: "Develop Coalitions", description: "Stakeholder engagement and partnership building" },
    { id: "systemsTransformation", label: "Systems Transformation", description: "Change leadership and organizational development" }
  ]

  const loadCandidate = async () => {
    try {
      setLoading(true)
      setError("")
      await new Promise(resolve => setTimeout(resolve, 400))
      
      if (id) {
        const candidateData = await candidateService.getById(parseInt(id))
        setCandidate(candidateData)
        
        if (candidateData.leadsScores) {
          setScores(candidateData.leadsScores)
          calculateResults(candidateData.leadsScores)
        }
      }
    } catch (err) {
      setError("Failed to load candidate data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCandidate()
  }, [id])

  const calculateResults = (currentScores) => {
    const domainScores = Object.values(currentScores)
      .map(domain => parseInt(domain.behavioralLevel) || 0)
      .filter(score => score > 0)

    if (domainScores.length === 0) {
      setCalculatedResults({
        totalScore: 0,
        readinessRating: "Not Assessed",
        timeToReadiness: "",
        developmentPathway: ""
      })
      return
    }

    const totalScore = domainScores.reduce((sum, score) => sum + score, 0)
    const averageScore = totalScore / domainScores.length

    let readinessRating = ""
    let timeToReadiness = ""
    let developmentPathway = ""

    if (averageScore >= 4.0) {
      readinessRating = "Ready"
      timeToReadiness = "<1 year"
      developmentPathway = "Minimal"
    } else if (averageScore >= 3.0) {
      readinessRating = "Developing"
      timeToReadiness = "1-2 years"
      developmentPathway = "Moderate"
    } else {
      readinessRating = "Not Ready"
      timeToReadiness = "2-3 years"
      developmentPathway = "Extensive"
    }

    setCalculatedResults({
      totalScore,
      readinessRating,
      timeToReadiness,
      developmentPathway
    })
  }

  const updateScore = (domain, field, value) => {
    const newScores = {
      ...scores,
      [domain]: {
        ...scores[domain],
        [field]: value
      }
    }
    setScores(newScores)
    calculateResults(newScores)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!candidate) {
      toast.error("Please select a candidate first")
      return
    }

    const hasScores = Object.values(scores).some(domain => domain.behavioralLevel)
    if (!hasScores) {
      toast.error("Please provide at least one behavioral level score")
      return
    }

    try {
      setSaving(true)
      await new Promise(resolve => setTimeout(resolve, 800))

      const updatedCandidate = {
        ...candidate,
        leadsScores: scores,
        totalLeadsScore: calculatedResults.totalScore,
        readinessRating: calculatedResults.readinessRating,
        timeToReadiness: calculatedResults.timeToReadiness,
        developmentPathway: calculatedResults.developmentPathway
      }

      await candidateService.update(candidate.Id, updatedCandidate)
      toast.success("LEADS assessment saved successfully!")
      navigate(`/candidates/${candidate.Id}`)
    } catch (err) {
      toast.error("Failed to save LEADS assessment")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadCandidate} />

  const renderDomainTab = (domainId) => {
    const domain = domains.find(d => d.id === domainId)
    const score = scores[domainId]

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{domain.label}</h3>
          <p className="text-gray-600">{domain.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField label="Behavioral Level (1-5)" required>
            <Select
              value={score.behavioralLevel}
              onChange={(e) => updateScore(domainId, "behavioralLevel", e.target.value)}
            >
              <option value="">Select level</option>
              <option value="1">1 - Foundational</option>
              <option value="2">2 - Developing</option>
              <option value="3">3 - Proficient</option>
              <option value="4">4 - Advanced</option>
              <option value="5">5 - Expert</option>
            </Select>
          </FormField>

          <FormField label="Development Needed">
            <Select
              value={score.developmentNeeded}
              onChange={(e) => updateScore(domainId, "developmentNeeded", e.target.value)}
            >
              <option value="">Select development level</option>
              <option value="Minimal">Minimal Development</option>
              <option value="Moderate">Moderate Development</option>
              <option value="Extensive">Extensive Development</option>
            </Select>
          </FormField>
        </div>

        <FormField label="Observed Evidence">
          <Textarea
            value={score.evidence}
            onChange={(e) => updateScore(domainId, "evidence", e.target.value)}
            placeholder="Describe specific examples and evidence of behavior in this domain..."
            rows={5}
          />
        </FormField>

        <FormField label="Development Notes">
          <Textarea
            value={score.notes}
            onChange={(e) => updateScore(domainId, "notes", e.target.value)}
            placeholder="Additional notes on development opportunities and recommendations..."
            rows={4}
          />
        </FormField>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">LEADS Assessment</h1>
          {candidate && (
            <p className="text-gray-600 mt-2">
              Assessing {candidate.name} - {candidate.department}
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate("/candidates")}>
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
          {!candidate && (
            <Button onClick={() => navigate("/candidates")}>
              <ApperIcon name="Users" className="w-4 h-4 mr-2" />
              Select Candidate
            </Button>
          )}
        </div>
      </div>

      {!candidate ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Users" className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Candidate</h3>
            <p className="text-gray-600 mb-6">Choose a candidate to begin their LEADS assessment</p>
            <Button onClick={() => navigate("/candidates")}>
              <ApperIcon name="Users" className="w-4 h-4 mr-2" />
              Browse Candidates
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Results Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <ProgressRing
                  progress={calculatedResults.totalScore ? (calculatedResults.totalScore / 25) * 100 : 0}
                  value={calculatedResults.totalScore.toFixed(1)}
                  label="Total Score"
                  size={100}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">Readiness Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{calculatedResults.readinessRating}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">Time to Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{calculatedResults.timeToReadiness}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">Development Pathway</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{calculatedResults.developmentPathway}</div>
              </CardContent>
            </Card>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <TabNavigation
                  tabs={domains}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </CardHeader>
              <CardContent className="p-6">
                {renderDomainTab(activeTab)}
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/candidates")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />}
                Save Assessment
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default LeadsAssessment