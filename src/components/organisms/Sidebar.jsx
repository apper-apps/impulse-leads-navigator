import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = ({ isOpen = true, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Candidates", href: "/candidates", icon: "Users" },
    { name: "Succession Forms", href: "/succession-form", icon: "FileText" },
    { name: "LEADS Assessment", href: "/leads-assessment", icon: "Target" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ]

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  LEADS Navigator
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2024 LEADS Navigator
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar