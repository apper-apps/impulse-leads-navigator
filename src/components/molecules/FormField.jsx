import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  error, 
  required = false, 
  className, 
  children,
  description 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default FormField