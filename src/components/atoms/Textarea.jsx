import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm transition-colors",
        "placeholder:text-gray-500",
        "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-vertical",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export default Textarea