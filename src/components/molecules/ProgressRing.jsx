const ProgressRing = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8, 
  color = "#0056b3",
  label,
  value
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="progress-ring"
        width={size}
        height={size}
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-circle"
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray,
            strokeDashoffset
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {label && <span className="text-xs text-gray-600 mt-1">{label}</span>}
      </div>
    </div>
  )
}

export default ProgressRing