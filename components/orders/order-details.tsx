"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRestaurant } from "@/contexts/restaurant-context"
import type { Order } from "@/types/restaurant"
import { ArrowLeft, Clock, Users, MapPin, FileText, DollarSign } from "lucide-react"

interface OrderDetailsProps {
  order: Order
  onClose: () => void
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const { tables, products } = useRestaurant()

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

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Producto desconocido"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detalles del Pedido</h2>
          <p className="text-gray-600">{order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Información General</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
            </div>

            <div>
              <p className="text-sm text-gray-600">Tipo de pedido</p>
              <p className="font-medium">{getOrderTypeText(order.orderType)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Ubicación</p>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{getTableNumber(order.tableId)}</span>
              </div>
            </div>

            {order.customerName && (
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>
                    {order.customerName} ({order.customerCount} personas)
                  </span>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600">Creado</p>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{order.createdAt.toLocaleString("es-ES")}</span>
              </div>
            </div>

            {order.servedAt && (
              <div>
                <p className="text-sm text-gray-600">Servido</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{order.servedAt.toLocaleString("es-ES")}</span>
                </div>
              </div>
            )}

            {order.estimatedTime && order.status === "preparing" && (
              <div>
                <p className="text-sm text-gray-600">Tiempo estimado</p>
                <p className="font-medium text-orange-600">{order.estimatedTime} minutos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items del Pedido</CardTitle>
            <CardDescription>{order.items.length} items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{getProductName(item.productId)}</p>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-gray-500 mt-1">
                        <strong>Notas:</strong> {item.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <Badge variant={item.status === "served" ? "default" : "secondary"} className="text-xs">
                      {item.status === "pending"
                        ? "Pendiente"
                        : item.status === "preparing"
                          ? "Preparando"
                          : item.status === "ready"
                            ? "Listo"
                            : "Servido"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-green-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Notas especiales:</p>
                <p className="text-sm text-blue-800">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
