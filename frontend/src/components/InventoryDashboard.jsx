import { useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"]

const productData = [
  {
    id: "P020",
    name: "Table",
    vendorPhone: "+1987694199",
    manufacturerPhone: "+1234567890",
    agreedPrice: 589766,
    status: "Sold",
    itemsSold: 45,
  },
  {
    id: "P040",
    name: "Bed",
    vendorPhone: "+1987653295",
    manufacturerPhone: "+1234567890",
    agreedPrice: 779430,
    status: "Sold",
    itemsSold: 48,
  },
  {
    id: "P040",
    name: "Bed",
    vendorPhone: "+1987694180",
    manufacturerPhone: "+1234567890",
    agreedPrice: 190533,
    status: "Pending",
    itemsSold: 40,
  },
  {
    id: "P030",
    name: "Sofa",
    vendorPhone: "+1987620098",
    manufacturerPhone: "+1234567890",
    agreedPrice: 816154,
    status: "Pending",
    itemsSold: 30,
  },
  {
    id: "P040",
    name: "Bed",
    vendorPhone: "+1987653176",
    manufacturerPhone: "+1234567890",
    agreedPrice: 303642,
    status: "Available",
    itemsSold: 20,
  },
  {
    id: "P040",
    name: "Bed",
    vendorPhone: "+1987631069",
    manufacturerPhone: "+1234567890",
    agreedPrice: 322349,
    status: "Pending",
    itemsSold: 18,
  },
  {
    id: "P050",
    name: "Lamp",
    vendorPhone: "+1987648796",
    manufacturerPhone: "+1234567890",
    agreedPrice: 313075,
    status: "Pending",
    itemsSold: 94,
  },
  {
    id: "P030",
    name: "Sofa",
    vendorPhone: "+1987684414",
    manufacturerPhone: "+1234567890",
    agreedPrice: 835753,
    status: "Sold",
    itemsSold: 91,
  },
  {
    id: "P040",
    name: "Bed",
    vendorPhone: "+1987627782",
    manufacturerPhone: "+1234567890",
    agreedPrice: 124499,
    status: "Available",
    itemsSold: 47,
  },
  {
    id: "P010",
    name: "Chair",
    vendorPhone: "+1987691187",
    manufacturerPhone: "+1234567890",
    agreedPrice: 523263,
    status: "Available",
    itemsSold: 66,
  },
  {
    id: "P030",
    name: "Sofa",
    vendorPhone: "+1987688949",
    manufacturerPhone: "+1234567890",
    agreedPrice: 569779,
    status: "Available",
    itemsSold: 70,
  },
  {
    id: "P030",
    name: "Sofa",
    vendorPhone: "+1987622210",
    manufacturerPhone: "+1234567890",
    agreedPrice: 618099,
    status: "Pending",
    itemsSold: 28,
  },
  {
    id: "P010",
    name: "Chair",
    vendorPhone: "+1987617155",
    manufacturerPhone: "+1234567890",
    agreedPrice: 899084,
    status: "Available",
    itemsSold: 35,
  },
  {
    id: "P050",
    name: "Lamp",
    vendorPhone: "+1987678407",
    manufacturerPhone: "+1234567890",
    agreedPrice: 323964,
    status: "Available",
    itemsSold: 31,
  },
  {
    id: "P050",
    name: "Lamp",
    vendorPhone: "+1987612630",
    manufacturerPhone: "+1234567890",
    agreedPrice: 612944,
    status: "Available",
    itemsSold: 5,
  },
  {
    id: "P050",
    name: "Lamp",
    vendorPhone: "+1987639584",
    manufacturerPhone: "+1234567890",
    agreedPrice: 430551,
    status: "Available",
    itemsSold: 80,
  },
  {
    id: "P010",
    name: "Chair",
    vendorPhone: "+1987698283",
    manufacturerPhone: "+1234567890",
    agreedPrice: 577519,
    status: "Pending",
    itemsSold: 98,
  },
]

const getHighestSellingProduct = () => {
  return productData.reduce((max, product) => (max.itemsSold > product.itemsSold ? max : product))
}

const getTop5Buyers = () => {
  return productData
    .sort((a, b) => b.itemsSold - a.itemsSold)
    .slice(0, 5)
    .map((product) => ({ name: product.name, itemsSold: product.itemsSold }))
}

const getSalesData = () => {
  const salesByProduct = productData.reduce((acc, product) => {
    acc[product.name] = (acc[product.name] || 0) + product.itemsSold
    return acc
  }, {})
  return Object.entries(salesByProduct).map(([name, value]) => ({ name, value }))
}

const getRecentProductHistory = () => {
  return productData
    .sort((a, b) => b.agreedPrice - a.agreedPrice)
    .slice(0, 5)
    .map((product) => ({
      name: product.name,
      status: product.status,
      price: product.agreedPrice,
      itemsSold: product.itemsSold,
    }))
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const highestSellingProduct = getHighestSellingProduct()
  const top5Buyers = getTop5Buyers()
  const salesData = getSalesData()
  const recentProductHistory = getRecentProductHistory()

  return (
    <div className="flex h-screen w-[100vw] bg-white text-gray-900">
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Highest Selling Product */}
          <Card className="bg-white border-orange-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Highest Selling Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">{highestSellingProduct.name}</div>
                <div className="text-sm text-gray-700">Items Sold: {highestSellingProduct.itemsSold}</div>
                <div className="text-sm text-gray-700">Status: {highestSellingProduct.status}</div>
                <div className="text-sm text-gray-700">
                  Agreed Price: ${highestSellingProduct.agreedPrice.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Buyers */}
          <Card className="bg-white border-orange-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Top 5 Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {top5Buyers.map((buyer, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-800">{buyer.name}</span>
                    <span className="font-medium text-gray-900">{buyer.itemsSold} items</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Data */}
          <Card className="bg-white border-orange-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Sales Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "white", border: "1px solid #f97316" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Product History */}
          <Card className="col-span-2 bg-white border-orange-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Product History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Name</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Price</TableHead>
                    <TableHead className="text-gray-700">Items Sold</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProductHistory.map((item, index) => (
                    <TableRow key={index} className="hover:bg-orange-50 transition-colors">
                      <TableCell className="text-gray-900">{item.name}</TableCell>
                      <TableCell className="text-gray-800">{item.status}</TableCell>
                      <TableCell className="text-gray-800">${item.price.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-800">{item.itemsSold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right sidebar with scrollable graphs */}
      <div className="w-96 bg-white p-4 shadow-md border-l border-orange-200 flex flex-col">
        <div className="flex mb-4">
          {["overview", "users", "revenue"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              className={`flex-1 ${
                activeTab === tab
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-white text-gray-700 border-orange-300 hover:bg-orange-50"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <Card className="bg-white border-orange-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Product Sales Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                        <XAxis dataKey="name" stroke="#1f2937" />
                        <YAxis stroke="#1f2937" />
                        <Tooltip contentStyle={{ background: "white", border: "1px solid #f97316" }} />
                        <Legend />
                        <Bar dataKey="value" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === "users" && (
            <Card className="bg-white border-orange-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Top Buyers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top5Buyers} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                      <XAxis type="number" stroke="#1f2937" />
                      <YAxis dataKey="name" type="category" stroke="#1f2937" />
                      <Tooltip contentStyle={{ background: "white", border: "1px solid #f97316" }} />
                      <Legend />
                      <Bar dataKey="itemsSold" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
          {activeTab === "revenue" && (
            <Card className="bg-white border-orange-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Product Price Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                      <XAxis dataKey="name" stroke="#1f2937" />
                      <YAxis stroke="#1f2937" />
                      <Tooltip contentStyle={{ background: "white", border: "1px solid #f97316" }} />
                      <Legend />
                      <Bar dataKey="agreedPrice" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

