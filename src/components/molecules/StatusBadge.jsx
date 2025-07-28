import Badge from "@/components/atoms/Badge"

const StatusBadge = ({ status }) => {
  const statusConfig = {
    "Ready": { variant: "success", text: "Ready" },
    "Developing": { variant: "warning", text: "Developing" },
    "Not Ready": { variant: "error", text: "Not Ready" },
    "High": { variant: "success", text: "High" },
    "Medium": { variant: "warning", text: "Medium" },
    "Low": { variant: "error", text: "Low" },
    "Exceeds": { variant: "success", text: "Exceeds" },
    "Meets": { variant: "info", text: "Meets" },
    "Below": { variant: "error", text: "Below" }
  }

  const config = statusConfig[status] || { variant: "default", text: status }

  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  )
}

export default StatusBadge