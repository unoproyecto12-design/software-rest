"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { ShoppingCart, DollarSign, TrendingUp, Table, Clock, AlertTriangle } from "lucide-react"

export function DashboardHome() {
  const { user } = useAuth()

  // Mock data - in real app this would come from API
  const stats = {
    totalTables: 12,
    occupiedTables: 8,
    todayOrders: 45,
    todayRevenue: 2850.5,
    lowStockItems: 3,
    pendingOrders: 7,
  }

  const recentOrders = [
    { id: "ORD-001", table: "Mesa 5", items: 3, total: 125.5, status: "En preparación" },
    { id: "ORD-002", table: "Mesa 2", items: 2, total: 89.0, status: "Listo" },
    { id: "ORD-003", table: "Mesa 8", items: 5, total: 234.75, status: "Pendiente" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">¡Bienvenido, {user?.name}!</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mesas Ocupadas</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.occupiedTables}/{stats.totalTables}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.occupiedTables / stats.totalTables) * 100)}% ocupación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoy</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">+12% vs ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.todayRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+8% vs ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Pedidos Recientes</span>
            </CardTitle>
            <CardDescription>Últimos pedidos del día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.table} • {order.items} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Listo"
                          ? "bg-green-100 text-green-800"
                          : order.status === "En preparación"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Resumen del Día</span>
            </CardTitle>
            <CardDescription>Métricas importantes de hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pedidos pendientes</span>
                <span className="font-medium">{stats.pendingOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo promedio</span>
                <span className="font-medium">18 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Satisfacción cliente</span>
                <span className="font-medium">4.8/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Productos más vendidos</span>
                <span className="font-medium">Pizza Margherita</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
