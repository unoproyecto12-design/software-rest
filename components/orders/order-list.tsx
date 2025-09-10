"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRestaurant } from "@/contexts/restaurant-context"
import { useAuth } from "@/contexts/auth-context"
import { OrderForm } from "./order-form"
import { OrderDetails } from "./order-details"
import { Plus, Search, Clock, DollarSign, Users, Eye, Edit } from "lucide-react"
import type { Order } from "@/types/restaurant"

export function OrderList() {
  const { orders, tables, products, settings } = useRestaurant()
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ""
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    const currency = settings?.currency || "COP"
    if (currency?.toString() === "COP") {
      return `$${amount.toLocaleString("es-CO")} COP`
    }
    return `$${amount.toFixed(2)} USD`
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "served":
        return "bg-purple-100 text-purple-800"
      case "paid":
        return "bg-emerald-100 text-emerald-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "draft":
        return "Borrador"
      case "confirmed":
        return "Confirmado"
      case "preparing":
        return "Preparando"
      case "ready":
        return "Listo"
      case "served":
        return "Servido"
      case "paid":
        return "Pagado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getTableNumber = (tableId?: string) => {
    if (!tableId) return "Para llevar"
    const table = tables.find((t) => t.id === tableId)
    return table ? `Mesa ${table.number}` : "Mesa desconocida"
  }

  const getOrderTypeText = (type: Order["orderType"]) => {
    switch (type) {
      case "dine-in":
        return "En restaurante"
      case "takeaway":
        return "Para llevar"
      case "delivery":
        return "Domicilio"
      default:
        return type
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetails(true)
  }

  const handleEdit = (order: Order) => {
    setSelectedOrder(order)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedOrder(null)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedOrder(null)
  }

  if (showForm) {
    return <OrderForm order={selectedOrder} onClose={handleCloseForm} />
  }

  if (showDetails && selectedOrder) {
    return <OrderDetails order={selectedOrder} onClose={handleCloseDetails} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pedidos</h2>
          <p className="text-gray-600">Gestiona todos los pedidos del restaurante</p>
        </div>
        {(user?.role === "admin" || user?.role === "waiter") && (
          <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pedido
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="draft">Borrador</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="preparing">Preparando</SelectItem>
            <SelectItem value="ready">Listo</SelectItem>
            <SelectItem value="served">Servido</SelectItem>
            <SelectItem value="paid">Pagado</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <CardDescription className="mt-1">
                    {getTableNumber(order.tableId)} • {getOrderTypeText(order.orderType)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(order)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {(user?.role === "admin" || user?.role === "waiter") && (
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(order)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.customerName && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {order.customerName} ({order.customerCount} personas)
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-semibold text-green-600">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {order.createdAt.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                  <span className="text-sm text-gray-500">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {order.estimatedTime && order.status === "preparing" && (
                  <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    Tiempo estimado: {order.estimatedTime} minutos
                  </div>
                )}

                {order.notes && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Notas:</strong> {order.notes}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm || statusFilter !== "all" ? "No se encontraron pedidos" : "No hay pedidos"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "Intenta con otros términos de búsqueda o filtros"
              : "Los pedidos aparecerán aquí cuando se creen."}
          </p>
        </div>
      )}
    </div>
  )
}
