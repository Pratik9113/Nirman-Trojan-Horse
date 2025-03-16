import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import ChatBot from "./ChatBot";

const DUMMY_PRODUCTS = [
  {
    _id: "1",
    name: "Luxury Sofa",
    price: 899,
    quantity: 50,
    manufacturer: { name: "Comfort Furniture Co." },
    description: "Premium 3-seater sofa with genuine leather upholstery",
    image: "sofa.jpg",
  },
  {
    _id: "2",
    name: "Dining Table Set",
    price: 1299,
    quantity: 30,
    manufacturer: { name: "WoodCraft Industries" },
    description: "6-seater dining table with matching chairs",
    image: "dining-set.jpg",
  },
  {
    _id: "3",
    name: "Queen Size Bed",
    price: 799,
    quantity: 25,
    manufacturer: { name: "DreamRest Furniture" },
    description: "Modern platform bed with headboard",
    image: "bed.jpg",
  },
  {
    _id: "4",
    name: "Office Chair",
    price: 299,
    quantity: 100,
    manufacturer: { name: "ErgoComfort Solutions" },
    description: "Ergonomic office chair with lumbar support",
    image: "chair.jpg",
  },
  {
    _id: "5",
    name: "Bookshelf",
    price: 249,
    quantity: 45,
    manufacturer: { name: "WoodCraft Industries" },
    description: "5-tier modern bookshelf",
    image: "bookshelf.jpg",
  },
  {
    _id: "6",
    name: "Coffee Table",
    price: 199,
    quantity: 60,
    manufacturer: { name: "Modern Living Furniture" },
    description: "Contemporary glass and wood coffee table",
    image: "coffee-table.jpg",
  },
];

const UserDashboard = () => {
  const [showChat, setShowChat] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleNegotiate = (product) => {
    setSelectedProduct(product);
    setShowChat(true);
  };

  return (
    <div className="mx-auto p-6 w-screen bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Products</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_PRODUCTS.map((product) => (
          <Card key={product._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Price:</span>
                  <span>${product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Available Quantity:</span>
                  <span>{product.quantity} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Manufacturer:</span>
                  <span>{product.manufacturer?.name || "N/A"}</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
                <div className="mt-4">
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleNegotiate(product)}
                  >
                    Negotiate Price
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Chatbot */}
      {showChat && selectedProduct && (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl">
          <ChatBot
            onClose={() => {
              setShowChat(false);
              setSelectedProduct(null);
            }}
            productId={selectedProduct._id}
            initialPrice={selectedProduct.price}
            productName={selectedProduct.name}
            retailerId={selectedProduct.manufacturer?._id || "1"}
          />
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
