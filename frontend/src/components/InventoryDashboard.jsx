"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for various charts
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

  // Mock data for stock predictions
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

  // Mock data for in-stock items
  const stockItems = [
    { name: "Aegir", inStock: 889, orders: 102, price: 759, value: "675K" },
    { name: "Alvilde", inStock: 1025, orders: 256, price: 659, value: "675K" },
    { name: "Ebbe", inStock: 804, orders: 49, price: 999, value: "803K" },
    { name: "Gjurd", inStock: 58, orders: 126, price: 1099, value: "70K" },
    { name: "Kindra", inStock: 236, orders: 88, price: 1399, value: "330K" },
  ]

  return (
    <div className="flex h-screen bg-slate-950">
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Stock Predictions */}
          <Card className="col-span-1 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle>Pred. months until stock outage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stockPredictions.map((item) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span>{item.months}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stock Check */}
          <Card className="col-span-1 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle>Stock check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">42</div>
              <div className="text-sm text-gray-400">days since last check</div>

              <Alert variant="destructive" className="bg-red-900/50 border-red-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Inventory accuracy warning</AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="text-sm font-medium">Inventory accuracy</div>
                <Progress value={99.1} className="h-2" />
                <div className="text-sm text-gray-400">99.1%</div>
              </div>
            </CardContent>
          </Card>

          {/* Warehouse Utilization */}
          <Card className="col-span-1 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle>Warehouse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Utilization</div>
                <Progress value={81} className="h-2" />
                <div className="text-sm text-gray-400">81%</div>
              </div>

              <div className="pt-4">
                <div className="text-3xl font-bold">$4.25M</div>
                <div className="text-sm text-gray-400">Value of stock</div>
              </div>
            </CardContent>
          </Card>

          {/* In Stock Table */}
          <Card className="col-span-2 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle>In stock</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>In stock</TableHead>
                    <TableHead>Avg 30d orders</TableHead>
                    <TableHead>Unit price</TableHead>
                    <TableHead>Stock value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockItems.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.inStock}</TableCell>
                      <TableCell>{item.orders}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>${item.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Returns Chart */}
          <Card className="col-span-1 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle>Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <div className="text-4xl font-bold">43</div>
                  <div className="text-2xl font-semibold">2.9%</div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <div>To be processed</div>
                  <div>Return rate</div>
                </div>
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={returnData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right sidebar with scrollable graphs */}
      <div className="w-96 bg-slate-900 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-120px)] mt-4">
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Acquisition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userAcquisitionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="organic" fill="#8884d8" />
                        <Bar dataKey="paid" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userEngagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="sessions" stroke="#8884d8" />
                        <Line yAxisId="right" type="monotone" dataKey="duration" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
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
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Product</CardTitle>
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
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  )
}

