"use client"

import React, { useState } from "react"
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart } from "lucide-react"
import {
  LineChart,
  Line,
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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// Add this custom CSS for the scrollbar
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #f97316;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #e86305;
  }
`

const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data (same as before)
  const returnData = [
    { month: "Jan", rate: 3.2 },
    { month: "Feb", rate: 3.1 },
    { month: "Mar", rate: 2.8 },
    { month: "Apr", rate: 2.9 },
    { month: "May", rate: 2.7 },
  ]

  const userAcquisitionData = [
    { month: "Jan", organic: 1000, paid: 800 },
    { month: "Feb", organic: 1500, paid: 1000 },
    { month: "Mar", organic: 2000, paid: 1200 },
    { month: "Apr", organic: 2500, paid: 1500 },
    { month: "May", organic: 3000, paid: 1800 },
  ]

  const revenueData = [
    { name: "Product A", value: 400 },
    { name: "Product B", value: 300 },
    { name: "Product C", value: 300 },
    { name: "Product D", value: 200 },
    { name: "Product E", value: 100 },
  ]

  const userEngagementData = [
    { day: "Mon", sessions: 500, duration: 20 },
    { day: "Tue", sessions: 600, duration: 24 },
    { day: "Wed", sessions: 550, duration: 22 },
    { day: "Thu", sessions: 700, duration: 28 },
    { day: "Fri", sessions: 650, duration: 26 },
    { day: "Sat", sessions: 450, duration: 18 },
    { day: "Sun", sessions: 400, duration: 16 },
  ]

  const stockPredictions = [
    { name: "Gjurd", months: 0.5 },
    { name: "Kindra", months: 2.7 },
    { name: "Mathilde", months: 4.0 },
    { name: "Alvilde", months: 4.0 },
    { name: "Magnus", months: 4.7 },
    { name: "Njord", months: 6.0 },
    { name: "Øystein", months: 6.8 },
    { name: "Aegir", months: 8.7 },
    { name: "Rüdiger", months: 8.9 },
    { name: "Ebbe", months: 16.4 },
  ]

  const stockItems = [
    { name: "Aegir", inStock: 889, orders: 102, price: 759, value: "675K" },
    { name: "Alvilde", inStock: 1025, orders: 256, price: 659, value: "675K" },
    { name: "Ebbe", inStock: 804, orders: 49, price: 999, value: "803K" },
    { name: "Gjurd", inStock: 58, orders: 126, price: 1099, value: "70K" },
    { name: "Kindra", inStock: 236, orders: 88, price: 1399, value: "330K" },
  ]

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="flex h-screen bg-white text-gray-900">
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Stock Predictions */}
            <Card className="bg-white border-orange-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Pred. months until stock outage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stockPredictions.map((item) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <span className="text-gray-800">{item.name}</span>
                      <span className="font-medium text-gray-900">{item.months}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stock Check */}
            <Card className="bg-white border-orange-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Stock check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-gray-900">42</div>
                <div className="text-sm text-gray-700">days since last check</div>

                <Alert variant="destructive" className="bg-orange-100 border-orange-300">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <AlertDescription className="text-gray-800">Inventory accuracy warning</AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Inventory accuracy</div>
                  <Progress value={99.1} className="bg-orange-100" indicatorColor="bg-orange-500" />
                  <div className="text-sm text-gray-800">99.1%</div>
                </div>
              </CardContent>
            </Card>

            {/* Warehouse Utilization */}
            <Card className="bg-white border-orange-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Warehouse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Utilization</div>
                  <Progress value={81} className="bg-orange-100" indicatorColor="bg-orange-500" />
                  <div className="text-sm text-gray-800">81%</div>
                </div>

                <div className="pt-4">
                  <div className="text-3xl font-bold text-gray-900">$4.25M</div>
                  <div className="text-sm text-gray-700">Value of stock</div>
                </div>
              </CardContent>
            </Card>

            {/* In Stock Table */}
            <Card className="col-span-2 bg-white border-orange-200">
              <CardHeader>
                <CardTitle className="text-gray-900">In stock</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-700">Name</TableHead>
                      <TableHead className="text-gray-700">In stock</TableHead>
                      <TableHead className="text-gray-700">Avg 30d orders</TableHead>
                      <TableHead className="text-gray-700">Unit price</TableHead>
                      <TableHead className="text-gray-700">Stock value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockItems.map((item) => (
                      <TableRow key={item.name} className="hover:bg-orange-50 transition-colors">
                        <TableCell className="text-gray-900">{item.name}</TableCell>
                        <TableCell className="text-gray-800">{item.inStock}</TableCell>
                        <TableCell className="text-gray-800">{item.orders}</TableCell>
                        <TableCell className="text-gray-800">${item.price}</TableCell>
                        <TableCell className="text-gray-800">${item.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Returns Chart */}
            <Card className="bg-white border-orange-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <div className="text-4xl font-bold text-gray-900">43</div>
                    <div className="text-2xl font-semibold text-gray-800">2.9%</div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <div>To be processed</div>
                    <div>Return rate</div>
                  </div>
                  <div className="h-[200px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={returnData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                        <XAxis dataKey="month" stroke="#1f2937" />
                        <YAxis stroke="#1f2937" />
                        <Tooltip contentStyle={{ background: "white", border: "1px solid #f97316" }} />
                        <Line type="monotone" dataKey="rate" stroke="#f97316" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
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
                    <CardTitle className="text-gray-900">User Acquisition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={userAcquisitionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                          <XAxis dataKey="month" stroke="#1f2937" />
                          <YAxis stroke="#1f2937" />
                          <Tooltip contentStyle={{ background: "white", border: "1px solid #f97316" }} />
                          <Legend />
                          <Bar dataKey="organic" fill="#f97316" />
                          <Bar dataKey="paid" fill="#fb923c" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">User Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={userEngagementData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                          <XAxis dataKey="day" stroke="#1f2937" />
                          <YAxis yAxisId="left" stroke="#1f2937" />
                          <YAxis yAxisId="right" orientation="right" stroke="#1f2937" />
                          <Tooltip contentStyle={{ background: "white", border: "1px solid #f97316" }} />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="sessions" stroke="#f97316" />
                          <Line yAxisId="right" type="monotone" dataKey="duration" stroke="#fb923c" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {activeTab === "users" && (
              <Card className="bg-white border-orange-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">User Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {revenueData.map((entry, index) => (
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
            )}
            {activeTab === "revenue" && (
              <Card className="bg-white border-orange-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Revenue by Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {revenueData.map((entry, index) => (
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
            )}
          </div>
        </div>
      </div>
    </>
  )
}

