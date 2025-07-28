import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const UserProfile = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()

  if (!isOpen) return null

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Department:</span>
              <span className="text-gray-900">{user?.department}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Portfolio:</span>
              <span className="text-gray-900">{user?.portfolio}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Username:</span>
              <span className="text-gray-900">{user?.username}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <Button
              onClick={handleLogout}
              variant="danger"
              className="w-full"
            >
              <ApperIcon name="LogOut" size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default UserProfile