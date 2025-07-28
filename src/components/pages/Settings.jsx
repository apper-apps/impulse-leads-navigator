import { useState } from "react"
import { toast } from "react-toastify"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import FormField from "@/components/molecules/FormField"
import TabNavigation from "@/components/molecules/TabNavigation"
import ApperIcon from "@/components/ApperIcon"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    organizationName: "Health and Human Services",
    adminEmail: "admin@example.com",
    notificationEmails: true,
    autoReminders: true,
    reminderFrequency: "90", // days
    assessmentRetention: "24", // months
    scoringThresholds: {
      ready: "4.0",
      developing: "3.0"
    },
    departments: ["Executive Leadership", "Clinical Services", "Operations", "Finance", "Human Resources"],
    leadsWeights: {
      leadSelf: "20",
      engageOthers: "20", 
      achieveResults: "20",
      developCoalitions: "20",
      systemsTransformation: "20"
    }
  })

  const tabs = [
    { id: "general", label: "General" },
    { id: "notifications", label: "Notifications" },
    { id: "scoring", label: "Scoring" },
    { id: "departments", label: "Departments" },
    { id: "leads", label: "LEADS Framework" }
  ]

  const updateSetting = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const updateNestedSetting = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }))
  }

  const addDepartment = () => {
    const newDept = prompt("Enter department name:")
    if (newDept && newDept.trim()) {
      setSettings(prev => ({
        ...prev,
        departments: [...prev.departments, newDept.trim()]
      }))
    }
  }

  const removeDepartment = (index) => {
    setSettings(prev => ({
      ...prev,
      departments: prev.departments.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Settings saved successfully!")
    } catch (err) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <FormField label="Organization Name">
        <Input
          value={settings.organizationName}
          onChange={(e) => updateSetting("organizationName", e.target.value)}
          placeholder="Enter organization name"
        />
      </FormField>

      <FormField label="Administrator Email">
        <Input
          type="email"
          value={settings.adminEmail}
          onChange={(e) => updateSetting("adminEmail", e.target.value)}
          placeholder="Enter admin email"
        />
      </FormField>

      <FormField label="Assessment Retention Period">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={settings.assessmentRetention}
            onChange={(e) => updateSetting("assessmentRetention", e.target.value)}
            className="w-24"
          />
          <span className="text-sm text-gray-600">months</span>
        </div>
      </FormField>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">Email Notifications</h4>
          <p className="text-sm text-gray-600">Receive email notifications for system events</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notificationEmails}
            onChange={(e) => updateSetting("notificationEmails", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">Auto Reminders</h4>
          <p className="text-sm text-gray-600">Automatically send assessment reminders</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoReminders}
            onChange={(e) => updateSetting("autoReminders", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <FormField label="Reminder Frequency">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={settings.reminderFrequency}
            onChange={(e) => updateSetting("reminderFrequency", e.target.value)}
            className="w-24"
            disabled={!settings.autoReminders}
          />
          <span className="text-sm text-gray-600">days</span>
        </div>
      </FormField>
    </div>
  )

  const renderScoringTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Readiness Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Ready Threshold (minimum score)">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={settings.scoringThresholds.ready}
                onChange={(e) => updateNestedSetting("scoringThresholds", "ready", e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-gray-600">out of 5.0</span>
            </div>
          </FormField>

          <FormField label="Developing Threshold (minimum score)">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={settings.scoringThresholds.developing}
                onChange={(e) => updateNestedSetting("scoringThresholds", "developing", e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-gray-600">out of 5.0</span>
            </div>
          </FormField>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Scoring Logic</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Scores ≥ {settings.scoringThresholds.ready} = Ready</li>
          <li>• Scores ≥ {settings.scoringThresholds.developing} = Developing</li>
          <li>• Scores &lt; {settings.scoringThresholds.developing} = Not Ready</li>
        </ul>
      </div>
    </div>
  )

  const renderDepartmentsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Departments</h3>
        <Button onClick={addDepartment}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      <div className="space-y-2">
        {settings.departments.map((dept, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-900">{dept}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeDepartment(index)}
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderLeadsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Domain Weights</h3>
        <p className="text-sm text-gray-600 mb-6">Adjust the weight of each LEADS domain in the overall score calculation.</p>
        
        <div className="space-y-4">
          <FormField label="Lead Self">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.leadsWeights.leadSelf}
                onChange={(e) => updateNestedSetting("leadsWeights", "leadSelf", e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          </FormField>

          <FormField label="Engage Others">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.leadsWeights.engageOthers}
                onChange={(e) => updateNestedSetting("leadsWeights", "engageOthers", e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          </FormField>

          <FormField label="Achieve Results">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.leadsWeights.achieveResults}
                onChange={(e) => updateNestedSetting("leadsWeights", "achieveResults", e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          </FormField>

          <FormField label="Develop Coalitions">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.leadsWeights.developCoalitions}
                onChange={(e) => updateNestedSetting("leadsWeights", "developCoalitions", e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          </FormField>

          <FormField label="Systems Transformation">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.leadsWeights.systemsTransformation}
                onChange={(e) => updateNestedSetting("leadsWeights", "systemsTransformation", e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          </FormField>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Total weight: {Object.values(settings.leadsWeights).reduce((sum, weight) => sum + parseInt(weight), 0)}%
            {Object.values(settings.leadsWeights).reduce((sum, weight) => sum + parseInt(weight), 0) !== 100 && 
              " (Should equal 100%)"}
          </p>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "general": return renderGeneralTab()
      case "notifications": return renderNotificationsTab()
      case "scoring": return renderScoringTab()
      case "departments": return renderDepartmentsTab()
      case "leads": return renderLeadsTab()
      default: return renderGeneralTab()
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure system settings and preferences</p>
      </div>

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

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />}
          <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}

export default Settings