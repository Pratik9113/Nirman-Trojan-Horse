"use client"

import { useState } from "react"
import { Slider } from "./ui/slider"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

// Mock data for initial render
const initialMaterials = [
  {
    id: 1,
    name: "Carbon Fiber",
    description: "High-strength composite material made of carbon fibers",
    price: 450,
    quantity: 1000,
    supplier: "TechFiber Industries",
    lastUpdated: "2024-01-28",
  },
  {
    id: 2,
    name: "Aluminum Alloy 6061",
    description: "Precipitation-hardened aluminum alloy with good mechanical properties",
    price: 280,
    quantity: 2500,
    supplier: "MetalWorks Co.",
    lastUpdated: "2024-01-27",
  },
  {
    id: 3,
    name: "Titanium Grade 5",
    description: "High-strength titanium alloy with excellent corrosion resistance",
    price: 890,
    quantity: 500,
    supplier: "TitaniumPro Supply",
    lastUpdated: "2024-01-28",
  },
  {
    id: 4,
    name: "Steel 4140",
    description: "Chrome-molybdenum alloy steel with high fatigue strength",
    price: 320,
    quantity: 1500,
    supplier: "SteelMax Industries",
    lastUpdated: "2024-01-26",
  },
]

const material_ids=[]

export default function ProducersDashboard() {
  const [materials, setMaterials] = useState(initialMaterials)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([1000])
  const [searchTerm, setSearchTerm] = useState("")
  const [materialDescription, setMaterialDescription] = useState("")
  const [filteredMaterials, setFilteredMaterials] = useState(initialMaterials)
  const [confirmedMaterialIds, setConfirmedMaterialIds] = useState([])

  const handleUpdateMaterial = (updatedMaterial) => {
    console.log("Confirmed Material ID:", updatedMaterial.id); // Only print the id
    // Remove the confirmed material from the materials list
    material_ids.push(updatedMaterial.id)
    const updatedMaterials = materials.filter((material) => material.id !== updatedMaterial.id)
    setMaterials(updatedMaterials)
    setFilteredMaterials(updatedMaterials)

    // Add material ID to the confirmed array using functional state update
    setConfirmedMaterialIds((prev) => [...prev, updatedMaterial.id])
  }

  const handleFetchMaterials = () => {
    const filtered = materials.filter(
      (material) =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        material.description.toLowerCase().includes(materialDescription.toLowerCase()) &&
        material.price <= priceRange[0],
    )
    setFilteredMaterials(filtered)
  }

  const handlePurchase = () => {
    // Get all confirmed materials by filtering materials based on confirmed IDs
    const confirmedMaterials = filteredMaterials.filter((material) =>
      confirmedMaterialIds.includes(material.id)
    )
    console.log("Confirmed Materials for Purchase:", confirmedMaterials)
    console.log("Material IDs for Purchase:", material_ids)
  }

  return (
    <div className="flex min-h-screen w-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white p-6 shadow-md">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Material Name</label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search materials..."
                className="border-gray-300 text-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                placeholder="Enter material description..."
                className="border-gray-300 text-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Maximum Price</label>
              <div className="pt-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  step={10}
                  className="[&_[role=slider]]:bg-[#f9960e]"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹0</span>
                <span>₹{priceRange[0]}</span>
              </div>
            </div>

            <Button onClick={handleFetchMaterials} className="w-full bg-[#f9960e] text-white hover:bg-[#da850d]">
              Fetch Materials
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex space-x-4">
            <button className="text-[#f9960e] border-none hover:text-[#da850d] font-medium">Raw Materials</button>
          </div>
        </div>

        {/* Materials List */}
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-lg font-medium text-[#f9960e]">{material.name}</h3>
                    <p className="text-sm text-gray-600">{material.description}</p>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-800 font-medium">Price:</span>
                      <span className="text-gray-800 font-medium ml-2">₹{material.price}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-800 font-medium">Quantity:</span>
                      <span className="text-gray-800 font-medium ml-2">{material.quantity} units</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMaterial(material)
                      setIsModalOpen(true)
                    }}
                    className="ml-4 px-4 py-2 bg-[#f9960e] text-white rounded hover:bg-[#da850d] transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Button */}
        {confirmedMaterialIds.length > 0 && (
          <div className="p-4">
            <Button
              onClick={handlePurchase}
              className="w-full bg-[#f9960e] text-white hover:bg-[#da850d]"
            >
              Purchase Confirmed Materials
            </Button>
          </div>
        )}
      </div>

      {selectedMaterial && (
        <RawMaterialModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedMaterial(null)
          }}
          material={selectedMaterial}
          onUpdate={handleUpdateMaterial}
        />
      )}
    </div>
  )
}

// RawMaterialModal component
export const RawMaterialModal = ({ isOpen, onClose, material, onUpdate }) => {
  if (!isOpen || !material) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-[#f9960e]">{material.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Material Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800">Description</h3>
              <p className="text-sm text-gray-600">{material.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Price</h3>
              <p className="text-sm text-gray-600">₹{material.price}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Quantity</h3>
              <p className="text-sm text-gray-600">{material.quantity} units</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Supplier</h3>
              <p className="text-sm text-gray-600">{material.supplier}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Last Updated</h3>
              <p className="text-sm text-gray-600">{material.lastUpdated}</p>
            </div>
          </div>

          {/* Right column: Images */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Images</h3>
            <div className="h-64 overflow-y-auto space-y-4 pr-2">
              <img
                src="https://4.imimg.com/data4/CB/YF/ANDROID-60760157/product-250x250.jpeg"
                alt="Material 1"
                className="w-full object-cover rounded-lg"
              />
              <img
                src="https://s.alicdn.com/@sc04/kf/He05f249b7d4c42c68c58014265e945d53.jpg_300x300.jpg"
                alt="Material 2"
                className="w-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <Button onClick={onClose} className="flex-1 border-orange-200 bg-white text-gray-700 hover:bg-gray-400 hover:text-white">
            Close
          </Button>
          <Button
            onClick={() => {
              onClose()
              onUpdate({ id: material.id }) // Only send the material's id when confirming
            }}
            className="flex-1 bg-[#f9960e] text-white hover:bg-[#da850d]"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}