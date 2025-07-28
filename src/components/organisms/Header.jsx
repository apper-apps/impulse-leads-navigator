import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"
const Header = ({ onMenuToggle, user = { name: "Admin User", role: "System Administrator" } }) => {
  const { logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
<header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-14 md:h-16 items-center justify-between px-3 md:px-4 lg:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden min-h-[44px] min-w-[44px] -ml-2"
          onClick={onMenuToggle}
        >
          <ApperIcon name="Menu" size={20} />
        </Button>

        {/* Logo */}
        <div className="flex items-center space-x-2 md:space-x-3 flex-1 lg:flex-initial justify-center lg:justify-start">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Users" className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="block">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <span className="hidden sm:inline">LEADS Navigator</span>
              <span className="sm:hidden">LEADS</span>
            </h1>
          </div>
        </div>

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
<div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">{user.name}</div>
              <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">{user.role}</div>
            </div>
            <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-500 hidden sm:block" />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <ApperIcon name="User" className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <ApperIcon name="Settings" className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <hr className="my-1" />
<button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header