import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg",
    secondary: "bg-gradient-to-r from-secondary to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10"
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button