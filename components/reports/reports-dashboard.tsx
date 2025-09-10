"use client"

import { useState, useMemo } from "react"
import { useRestaurant } from "@/contexts/restaurant-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, AlertTriangle, Calendar, Download } from "lucide-react"

export function ReportsDashboard() {
  const { orders, products, categories, invoices, payments, inventoryItems, tables } = useRestaurant()

  const [dateRange, setDateRange] = useState("today")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Filter data based on date range
  const filteredData = useMemo(() => {
    const now = new Date()
    let filterDate = new Date()

    switch (dateRange) {
      case "today":
        filterDate.setHours(0, 0, 0, 0)
        break
      case "week":
        filterDate.setDate(now.getDate() - 7)
        break
      case "month":
        filterDate.setMonth(now.getMonth() - 1)
        break
      case "custom":
        if (startDate && endDate) {
          const start = new Date(startDate)
          const end = new Date(endDate)
          return {
            orders: orders.filter((o) => new Date(o.createdAt) >= start && new Date(o.createdAt) <= end),
            invoices: invoices.filter((i) => new Date(i.createdAt) >= start && new Date(i.createdAt) <= end),
            payments: payments.filter((p) => new Date(p.createdAt) >= start && new Date(p.createdAt) <= end),
          }
        }
        return { orders: [], invoices: [], payments: [] }
      default:
        filterDate = new Date(0)
    }

    return {
      orders: orders.filter((o) => new Date(o.createdAt) >= filterDate),
      invoices: invoices.filter((i) => new Date(i.createdAt) >= filterDate),
      payments: payments.filter((p) => new Date(p.createdAt) >= filterDate),
    }
  }, [dateRange, startDate, endDate, orders, invoices, payments])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalRevenue = filteredData.payments.reduce((sum, p) => sum + p.amount, 0)
    const totalOrders = filteredData.orders.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const completedOrders = filteredData.orders.filter((o) => o.status === "paid").length

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      completedOrders,
      conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    }
  }, [filteredData])

  // Sales by day chart data
  const salesByDay = useMemo(() => {
    const dayMap = new Map()

    filteredData.payments.forEach((payment) => {
      const day = new Date(payment.createdAt).toLocaleDateString()
      dayMap.set(day, (dayMap.get(day) || 0) + payment.amount)
    })

    return Array.from(dayMap.entries())
      .map(([day, amount]) => ({
        day,
        amount: Number(amount.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())
  }, [filteredData.payments])

  // Product performance data
  const productPerformance = useMemo(() => {
    const productMap = new Map()

    filteredData.orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (product) {
          const current = productMap.get(product.id) || { name: product.name, quantity: 0, revenue: 0 }
          current.quantity += item.quantity
          current.revenue += item.price * item.quantity
          productMap.set(product.id, current)
        }
      })
    })

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }, [filteredData.orders, products])

  // Payment methods distribution
  const paymentMethods = useMemo(() => {
    const methodMap = new Map()

    filteredData.payments.forEach((payment) => {
      const method = payment.method === "cash" ? "Efectivo" : payment.method === "card" ? "Tarjeta" : "Transferencia"
      methodMap.set(method, (methodMap.get(method) || 0) + payment.amount)
    })

    return Array.from(methodMap.entries()).map(([method, amount]) => ({
      name: method,
      value: Number(amount.toFixed(2)),
    }))
  }, [filteredData.payments])

  // Table utilization
  const tableUtilization = useMemo(() => {
    const tableMap = new Map()

    filteredData.orders.forEach((order) => {
      if (order.tableId) {
        const table = tables.find((t) => t.id === order.tableId)
        if (table) {
          const current = tableMap.get(table.number) || { table: `Mesa ${table.number}`, orders: 0, revenue: 0 }
          current.orders += 1
          current.revenue += order.total
          tableMap.set(table.number, current)
        }
      }
    })

    return Array.from(tableMap.values()).sort((a, b) => b.revenue - a.revenue)
  }, [filteredData.orders, tables])

  // Low stock alerts
  const lowStockItems = inventoryItems.filter((item) => item.currentStock <= item.minStock)

  const COLORS = ["#f97316", "#ea580c", "#dc2626", "#b91c1c", "#991b1b"]

  const exportReport = () => {
    const reportData = {
      dateRange,
      startDate,
      endDate,
      kpis,
      salesByDay,
      productPerformance,
      paymentMethods,
      tableUtilization,
      lowStockItems: lowStockItems.map((item) => ({
        name: item.name,
        currentStock: item.currentStock,
        minStock: item.minStock,
      })),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filtros de Reporte
            </span>
            <Button onClick={exportReport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <Label htmlFor="date-range">Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mes</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <>
                <div>
                  <Label htmlFor="start-date">Fecha Inicio</Label>
                  <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="end-date">Fecha Fin</Label>
                  <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold">${kpis.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Órdenes</p>
                <p className="text-2xl font-bold">{kpis.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
                <p className="text-2xl font-bold">${kpis.avgOrderValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Órdenes Completadas</p>
                <p className="text-2xl font-bold">{kpis.completedOrders}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="tables">Mesas</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Día</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Ventas"]} />
                    <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Productos por Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productPerformance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`$${value}`, "Ingresos"]} />
                    <Bar dataKey="revenue" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethods}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, "Monto"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method, index) => (
                    <div key={method.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{method.name}</span>
                      </div>
                      <span className="font-bold">${method.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle>Utilización de Mesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tableUtilization}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="table" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#3b82f6" name="Órdenes" />
                    <Bar dataKey="revenue" fill="#f97316" name="Ingresos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Alertas de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Stock actual: {item.currentStock} {item.unit} | Mínimo: {item.minStock} {item.unit}
                        </p>
                      </div>
                      <Badge variant="destructive">Stock Bajo</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No hay alertas de inventario</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
