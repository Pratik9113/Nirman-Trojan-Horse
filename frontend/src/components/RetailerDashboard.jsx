"use client"

import { useState } from "react"
import { Slider } from "./ui/slider"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

// Mock data for initial render (empty list now)
const initialMaterials = []

export default function RetailerDashboard() {
  const [materials, setMaterials] = useState(initialMaterials)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  })
  const [finalPrice, setFinalPrice] = useState(0)
  const [filteredMaterials, setFilteredMaterials] = useState(initialMaterials)

  const handleAddMaterial = () => {
    const updatedMaterials = [...materials, { ...newMaterial, id: Date.now() }]
    setMaterials(updatedMaterials)
    setFilteredMaterials(updatedMaterials)
    setNewMaterial({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
    })
    setFinalPrice(0)
  }

  const handleMaterialChange = (e) => {
    const { name, value } = e.target
    setNewMaterial((prev) => {
      const updatedMaterial = { ...prev, [name]: value }
      if (updatedMaterial.price && updatedMaterial.quantity) {
        updatedMaterial.finalPrice = updatedMaterial.price * updatedMaterial.quantity
      }
      setFinalPrice(updatedMaterial.finalPrice || 0)
      return updatedMaterial
    })
  }

  const handleFetchMaterials = () => {
    const filtered = materials.filter(
      (product) =>
        product.name.toLowerCase().includes(newMaterial.name.toLowerCase()) &&
        product.description.toLowerCase().includes(newMaterial.description.toLowerCase()) &&
        product.price <= finalPrice,
    )
    setFilteredMaterials(filtered)
  }

  const handleAcceptDeal = () => {
    console.log("Accepted product:", selectedMaterial)
    setIsModalOpen(false)
  }

  return (
    <div className="flex min-h-screen w-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white p-6 shadow-md">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">product Name</label>
              <Input
                value={newMaterial.name}
                onChange={handleMaterialChange}
                name="name"
                placeholder="Enter product name..."
                className="border-gray-300 text-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={newMaterial.description}
                onChange={handleMaterialChange}
                name="description"
                placeholder="Enter product description..."
                className="border-gray-300 text-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price per Unit</label>
              <Input
                value={newMaterial.price}
                onChange={handleMaterialChange}
                name="price"
                type="number"
                placeholder="Enter price..."
                className="border-gray-300 text-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <Input
                value={newMaterial.quantity}
                onChange={handleMaterialChange}
                name="quantity"
                type="number"
                placeholder="Enter quantity..."
                className="border-gray-300 text-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Final Price</label>
              <Input
                value={`₹${finalPrice}`}
                disabled
                className="border-gray-300 text-black"
              />
            </div>

            <Button onClick={handleAddMaterial} className="w-full bg-[#f9960e] text-white hover:bg-[#da850d]">
              Add product
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
            {materials.map((product) => (
              <div key={product.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-lg font-medium text-[#f9960e]">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-800 font-medium">Price:</span>
                      <span className="text-gray-800 font-medium ml-2">₹{product.price}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-800 font-medium">Quantity:</span>
                      <span className="text-gray-800 font-medium ml-2">{product.quantity} units</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMaterial(product)
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
      </div>

      {selectedMaterial && (
        <RawMaterialModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedMaterial(null)
          }}
          product={selectedMaterial}
          onAcceptDeal={handleAcceptDeal}
        />
      )}
    </div>
  )
}

// RawMaterialModal component
export const RawMaterialModal = ({ isOpen, onClose, product, onAcceptDeal }) => {
  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-[#f9960e]">{product.name}</h2>
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
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800">Description</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Price</h3>
              <p className="text-sm text-gray-600">₹{product.price}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Quantity</h3>
              <p className="text-sm text-gray-600">{product.quantity} units</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Supplier</h3>
              <p className="text-sm text-gray-600">{product.supplier}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Last Updated</h3>
              <p className="text-sm text-gray-600">{product.lastUpdated}</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <Button onClick={onClose} className="flex-1 border-orange-200 bg-white text-gray-700 hover:bg-gray-400 hover:text-white">
            Cancel
          </Button>
          <Button onClick={onAcceptDeal} className="flex-1 bg-[#f9960e] text-white hover:bg-[#da850d]">
            Accept Deal
          </Button>
        </div>
      </div>
    </div>
  )
}
