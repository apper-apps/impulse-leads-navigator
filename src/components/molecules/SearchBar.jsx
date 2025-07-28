import { useState } from "react"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (value) => {
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="relative">
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        size={16} 
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

export default SearchBar