import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import FormField from "@/components/molecules/FormField"
import TabNavigation from "@/components/molecules/TabNavigation"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { candidateService } from "@/services/api/candidateService"

const SuccessionForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    portfolio: "",
    credentials: [""],
    lengthOfService: "",
    performanceRating: "",
    potentialRating: "",
    leadershipAccomplishments: "",
    demonstratedStrengths: "",
    hhsWorkExperience: [{ title: "", division: "", startDate: "", endDate: "" }],
    externalWorkExperience: [{ title: "", division: "", startDate: "", endDate: "" }],
    education: [{ institution: "", program: "", level: "" }],
    keyDevelopmentAreas: "",
    plannedActions: "",
    retentionFactors: "",
    reasonForLeaving: "",
    impactOfLoss: ""
  })

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "ratings", label: "Ratings" },
    { id: "accomplishments", label: "LEADS Accomplishments" },
    { id: "experience", label: "Work Experience" },
    { id: "education", label: "Education" },
    { id: "development", label: "Development Plan" },
    { id: "retention", label: "Retention Profile" }
  ]

  const loadCandidate = async () => {
    try {
      setLoading(true)
      setError("")
      await new Promise(resolve => setTimeout(resolve, 400))
      const candidate = await candidateService.getById(parseInt(id))
      
      setFormData({
        name: candidate.name || "",
        department: candidate.department || "",
        portfolio: candidate.portfolio || "",
        credentials: candidate.credentials?.length ? candidate.credentials : [""],
        lengthOfService: candidate.lengthOfService || "",
        performanceRating: candidate.performanceRating || "",
        potentialRating: candidate.potentialRating || "",
        leadershipAccomplishments: candidate.leadershipAccomplishments || "",
        demonstratedStrengths: candidate.demonstratedStrengths || "",
        hhsWorkExperience: candidate.workHistory?.filter(w => !w.isExternal)?.length ? 
          candidate.workHistory.filter(w => !w.isExternal) : 
          [{ title: "", division: "", startDate: "", endDate: "" }],
        externalWorkExperience: candidate.workHistory?.filter(w => w.isExternal)?.length ? 
          candidate.workHistory.filter(w => w.isExternal) : 
          [{ title: "", division: "", startDate: "", endDate: "" }],
        education: candidate.education?.length ? candidate.education : [{ institution: "", program: "", level: "" }],
        keyDevelopmentAreas: candidate.developmentPlan?.keyAreas || "",
        plannedActions: candidate.developmentPlan?.actions || "",
        retentionFactors: candidate.retentionProfile?.factors || "",
        reasonForLeaving: candidate.retentionProfile?.reasonForLeaving || "",
        impactOfLoss: candidate.retentionProfile?.impactOfLoss || ""
      })
    } catch (err) {
      setError("Failed to load candidate data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isEditing) {
      loadCandidate()
    }
  }, [id, isEditing])

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultItem]
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const updateArrayItem = (field, index, updatedItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? updatedItem : item)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.department || !formData.portfolio) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSaving(true)
      await new Promise(resolve => setTimeout(resolve, 800))

      const candidateData = {
        name: formData.name,
        department: formData.department,
        portfolio: formData.portfolio,
        credentials: formData.credentials.filter(c => c.trim()),
        lengthOfService: parseInt(formData.lengthOfService) || 0,
        performanceRating: formData.performanceRating,
        potentialRating: formData.potentialRating,
        leadershipAccomplishments: formData.leadershipAccomplishments,
        demonstratedStrengths: formData.demonstratedStrengths,
        workHistory: [
          ...formData.hhsWorkExperience.filter(w => w.title).map(w => ({ ...w, isExternal: false })),
          ...formData.externalWorkExperience.filter(w => w.title).map(w => ({ ...w, isExternal: true }))
        ],
        education: formData.education.filter(e => e.institution),
        developmentPlan: {
          keyAreas: formData.keyDevelopmentAreas,
          actions: formData.plannedActions
        },
        retentionProfile: {
          factors: formData.retentionFactors,
          reasonForLeaving: formData.reasonForLeaving,
          impactOfLoss: formData.impactOfLoss,
          riskOfLoss: formData.impactOfLoss === "High" ? "High" : formData.impactOfLoss === "Medium" ? "Medium" : "Low"
        }
      }

      if (isEditing) {
        await candidateService.update(parseInt(id), candidateData)
        toast.success("Candidate updated successfully!")
      } else {
        await candidateService.create(candidateData)
        toast.success("Candidate created successfully!")
      }

      navigate("/candidates")
    } catch (err) {
      toast.error(isEditing ? "Failed to update candidate" : "Failed to create candidate")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadCandidate} />

  const renderProfileTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Full Name" required>
        <Input
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
          placeholder="Enter full name"
        />
      </FormField>

      <FormField label="Department" required>
        <Input
          value={formData.department}
          onChange={(e) => updateFormData("department", e.target.value)}
          placeholder="Enter department"
        />
      </FormField>

      <FormField label="Portfolio" required>
        <Input
          value={formData.portfolio}
          onChange={(e) => updateFormData("portfolio", e.target.value)}
          placeholder="Enter portfolio"
        />
      </FormField>

      <FormField label="Length of Service (Years)">
        <Input
          type="number"
          value={formData.lengthOfService}
          onChange={(e) => updateFormData("lengthOfService", e.target.value)}
          placeholder="Enter years of service"
        />
      </FormField>

      <div className="md:col-span-2">
        <FormField label="Credentials">
          {formData.credentials.map((credential, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <Input
                value={credential}
                onChange={(e) => {
                  const newCredentials = [...formData.credentials]
                  newCredentials[index] = e.target.value
                  updateFormData("credentials", newCredentials)
                }}
                placeholder="Professional membership, institution, or description"
              />
              {formData.credentials.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem("credentials", index)}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem("credentials", "")}
            className="mt-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Credential
          </Button>
        </FormField>
      </div>
    </div>
  )

  const renderRatingsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Performance Rating">
        <Select
          value={formData.performanceRating}
          onChange={(e) => updateFormData("performanceRating", e.target.value)}
        >
          <option value="">Select performance rating</option>
          <option value="Exceeds">Exceeds Expectations</option>
          <option value="Meets">Meets Expectations</option>
          <option value="Below">Below Expectations</option>
        </Select>
      </FormField>

      <FormField label="Potential Rating">
        <Select
          value={formData.potentialRating}
          onChange={(e) => updateFormData("potentialRating", e.target.value)}
        >
          <option value="">Select potential rating</option>
          <option value="High">High Potential</option>
          <option value="Medium">Medium Potential</option>
          <option value="Low">Low Potential</option>
        </Select>
      </FormField>
    </div>
  )

  const renderAccomplishmentsTab = () => (
    <div className="space-y-6">
      <FormField label="Leadership Accomplishments">
        <Textarea
          value={formData.leadershipAccomplishments}
          onChange={(e) => updateFormData("leadershipAccomplishments", e.target.value)}
          placeholder="Describe key leadership accomplishments..."
          rows={6}
        />
      </FormField>

      <FormField label="Demonstrated Strengths">
        <Textarea
          value={formData.demonstratedStrengths}
          onChange={(e) => updateFormData("demonstratedStrengths", e.target.value)}
          placeholder="Describe demonstrated strengths..."
          rows={6}
        />
      </FormField>
    </div>
  )

  const renderWorkExperienceSection = (title, field, isExternal) => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => addArrayItem(field, { title: "", division: "", startDate: "", endDate: "" })}
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>
      
      {formData[field].map((experience, index) => (
        <Card key={index} className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Job Title">
                <Input
                  value={experience.title}
                  onChange={(e) => updateArrayItem(field, index, { ...experience, title: e.target.value })}
                  placeholder="Enter job title"
                />
              </FormField>

              <FormField label={isExternal ? "Organization" : "Division"}>
                <Input
                  value={experience.division}
                  onChange={(e) => updateArrayItem(field, index, { ...experience, division: e.target.value })}
                  placeholder={isExternal ? "Enter organization" : "Enter division"}
                />
              </FormField>

              <FormField label="Start Date">
                <Input
                  type="date"
                  value={experience.startDate}
                  onChange={(e) => updateArrayItem(field, index, { ...experience, startDate: e.target.value })}
                />
              </FormField>

              <FormField label="End Date">
                <Input
                  type="date"
                  value={experience.endDate}
                  onChange={(e) => updateArrayItem(field, index, { ...experience, endDate: e.target.value })}
                />
              </FormField>
            </div>
            
            {formData[field].length > 1 && (
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem(field, index)}
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderExperienceTab = () => (
    <div className="space-y-8">
      {renderWorkExperienceSection("HHS Work Experience", "hhsWorkExperience", false)}
      {renderWorkExperienceSection("External Work Experience", "externalWorkExperience", true)}
    </div>
  )

  const renderEducationTab = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Education</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => addArrayItem("education", { institution: "", program: "", level: "" })}
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>
      
      {formData.education.map((edu, index) => (
        <Card key={index} className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Institution">
                <Input
                  value={edu.institution}
                  onChange={(e) => updateArrayItem("education", index, { ...edu, institution: e.target.value })}
                  placeholder="Enter institution name"
                />
              </FormField>

              <FormField label="Program/Major">
                <Input
                  value={edu.program}
                  onChange={(e) => updateArrayItem("education", index, { ...edu, program: e.target.value })}
                  placeholder="Enter program or major"
                />
              </FormField>

              <FormField label="Education Level">
                <Select
                  value={edu.level}
                  onChange={(e) => updateArrayItem("education", index, { ...edu, level: e.target.value })}
                >
                  <option value="">Select level</option>
                  <option value="High School">High School</option>
                  <option value="Associate">Associate Degree</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Professional">Professional Certification</option>
                </Select>
              </FormField>
            </div>
            
            {formData.education.length > 1 && (
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem("education", index)}
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderDevelopmentTab = () => (
    <div className="space-y-6">
      <FormField label="Key Development Areas">
        <Textarea
          value={formData.keyDevelopmentAreas}
          onChange={(e) => updateFormData("keyDevelopmentAreas", e.target.value)}
          placeholder="Identify key areas for development..."
          rows={6}
        />
      </FormField>

      <FormField label="Planned Actions">
        <Textarea
          value={formData.plannedActions}
          onChange={(e) => updateFormData("plannedActions", e.target.value)}
          placeholder="Describe planned development actions..."
          rows={6}
        />
      </FormField>
    </div>
  )

  const renderRetentionTab = () => (
    <div className="space-y-6">
      <FormField label="What keeps this person here?">
        <Textarea
          value={formData.retentionFactors}
          onChange={(e) => updateFormData("retentionFactors", e.target.value)}
          placeholder="Describe factors that retain this person..."
          rows={4}
        />
      </FormField>

      <FormField label="Potential reason for leaving">
        <Input
          value={formData.reasonForLeaving}
          onChange={(e) => updateFormData("reasonForLeaving", e.target.value)}
          placeholder="Enter potential reason for leaving"
        />
      </FormField>

      <FormField label="Impact of Loss">
        <Select
          value={formData.impactOfLoss}
          onChange={(e) => updateFormData("impactOfLoss", e.target.value)}
        >
          <option value="">Select impact level</option>
          <option value="Low">Low Impact</option>
          <option value="Medium">Medium Impact</option>
          <option value="High">High Impact</option>
        </Select>
      </FormField>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile": return renderProfileTab()
      case "ratings": return renderRatingsTab()
      case "accomplishments": return renderAccomplishmentsTab()
      case "experience": return renderExperienceTab()
      case "education": return renderEducationTab()
      case "development": return renderDevelopmentTab()
      case "retention": return renderRetentionTab()
      default: return renderProfileTab()
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit" : "Create"} Succession Form
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? "Update candidate information" : "Complete the succession planning form for a new candidate"}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/candidates")}>
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Candidates
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </CardHeader>
          <CardContent className="p-6">
            {renderTabContent()}
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
            {isEditing ? "Update" : "Create"} Candidate
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SuccessionForm