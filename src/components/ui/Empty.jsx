import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating your first item.",
  actionLabel = "Get Started",
  onAction,
  icon = "FileText"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{description}</p>
      {onAction && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty