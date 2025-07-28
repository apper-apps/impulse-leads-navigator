import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { candidateService } from "@/services/api/candidateService"
import { toast } from "react-toastify"

const Reports = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedReport, setSelectedReport] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [generating, setGenerating] = useState(false)

  const reportTypes = [
    { id: "individual", name: "Individual Succession Profile", description: "Detailed profile for a single candidate" },
    { id: "department", name: "Department Summary", description: "Summary of all candidates by department" },
    { id: "readiness", name: "Readiness Dashboard", description: "Overview of candidate readiness levels" },
    { id: "leads", name: "LEADS Assessment Report", description: "Detailed LEADS scores and analysis" },
    { id: "retention", name: "Retention Risk Analysis", description: "Analysis of retention risks across candidates" }
  ]

  const loadCandidates = async () => {
    try {
      setLoading(true)
      setError("")
      await new Promise(resolve => setTimeout(resolve, 500))
      const data = await candidateService.getAll()
      setCandidates(data)
    } catch (err) {
      setError("Failed to load candidates. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCandidates()
  }, [])

  const generateReport = async () => {
    if (!selectedReport) {
      toast.error("Please select a report type")
      return
    }

    if (selectedReport === "individual" && !selectedCandidate) {
      toast.error("Please select a candidate for individual reports")
      return
    }

    try {
      setGenerating(true)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate report generation
      const reportData = {
        type: selectedReport,
        candidateId: selectedCandidate,
        generatedAt: new Date().toISOString(),
        data: candidates
      }

      // In a real app, this would trigger actual report generation
      console.log("Generating report:", reportData)
      
      toast.success("Report generated successfully!")
      
      // Reset form
      setSelectedReport("")
      setSelectedCandidate("")
    } catch (err) {
      toast.error("Failed to generate report")
    } finally {
      setGenerating(false)
    }
  }

  const exportToPDF = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Report exported to PDF!")
    } catch (err) {
      toast.error("Failed to export PDF")
    }
  }

  const exportToExcel = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Report exported to Excel!")
    } catch (err) {
      toast.error("Failed to export Excel")
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadCandidates} />

  const stats = {
    totalCandidates: candidates.length,
    readyCandidates: candidates.filter(c => c.readinessRating === "Ready").length,
    developingCandidates: candidates.filter(c => c.readinessRating === "Developing").length,
    highRisk: candidates.filter(c => c.retentionProfile?.riskOfLoss === "High").length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Generate comprehensive succession planning reports and export data</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.totalCandidates}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{stats.readyCandidates}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Developing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{stats.developingCandidates}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-error">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-error">{stats.highRisk}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <Select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                >
                  <option value="">Select report type</option>
                  {reportTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </Select>
              </div>

              {selectedReport === "individual" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Candidate</label>
                  <Select
                    value={selectedCandidate}
                    onChange={(e) => setSelectedCandidate(e.target.value)}
                  >
                    <option value="">Select candidate</option>
                    {candidates.map(candidate => (
                      <option key={candidate.Id} value={candidate.Id}>
                        {candidate.name} - {candidate.department}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </div>

            {selectedReport && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">
                  {reportTypes.find(t => t.id === selectedReport)?.name}
                </h4>
                <p className="text-sm text-blue-700">
                  {reportTypes.find(t => t.id === selectedReport)?.description}
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={exportToPDF}>
                  <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={exportToExcel}>
                  <ApperIcon name="Table" className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </div>
              <Button onClick={generateReport} disabled={generating}>
                {generating && <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />}
                <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setSelectedReport("readiness")
                generateReport()
              }}
            >
              <ApperIcon name="BarChart3" className="w-4 h-4 mr-3" />
              Readiness Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setSelectedReport("department")
                generateReport()
              }}
            >
              <ApperIcon name="Users" className="w-4 h-4 mr-3" />
              Department Summary
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setSelectedReport("retention")
                generateReport()
              }}
            >
              <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-3" />
              Retention Analysis
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setSelectedReport("leads")
                generateReport()
              }}
            >
              <ApperIcon name="Target" className="w-4 h-4 mr-3" />
              LEADS Summary
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Reports</h3>
            <p className="text-gray-600 mb-4">Generated reports will appear here for easy access</p>
            <Button onClick={() => setSelectedReport("readiness")}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Generate Your First Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reports