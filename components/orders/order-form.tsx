"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRestaurant } from "@/contexts/restaurant-context"
import { useAuth } from "@/contexts/auth-context"
import type { Order, OrderItem } from "@/types/restaurant"
import { ArrowLeft, Save, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"

interface OrderFormProps {
  order?: Order | null
  onClose: () => void
}

export function OrderForm({ order, onClose }: OrderFormProps) {
  const { tables, products, categories, createOrder, updateOrder, addOrderItem, updateOrderItem, removeOrderItem } =
    useRestaurant()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    tableId: order?.tableId || "",
    customerName: order?.customerName || "",
    customerCount: order?.customerCount || 1,
    orderType: order?.orderType || ("dine-in" as Order["orderType"]),
    notes: order?.notes || "",
    status: order?.status || ("draft" as Order["status"]),
  })

  const [orderItems, setOrderItems] = useState<OrderItem[]>(order?.items || [])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const availableTables = tables.filter((t) => t.status === "available" || (order && t.id === order.tableId))

  const filteredProducts = products.filter(
    (p) => p.isActive && (selectedCategory === "all" || p.categoryId === selectedCategory),
  )

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const addProductToOrder = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const existingItem = orderItems.find((item) => item.productId === productId)

    if (existingItem) {
      setOrderItems((prev) =>
        prev.map((item) => (item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      const newItem: OrderItem = {
        id: `temp-${Date.now()}`,
        productId: product.id,
        quantity: 1,
        price: product.price,
        status: "pending",
      }
      setOrderItems((prev) => [...prev, newItem])
    }
  }

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems((prev) => prev.filter((item) => item.id !== itemId))
    } else {
      setOrderItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    }
  }

  const removeItem = (itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Producto desconocido"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const orderData = {
      ...formData,
      items: orderItems,
      subtotal,
      tax,
      discount: 0,
      total,
      waiterId: user?.id,
    }

    if (order) {
      updateOrder(order.id, orderData)
    } else {
      createOrder(orderData)
    }

    onClose()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{order ? "Editar Pedido" : "Nuevo Pedido"}</h2>
          <p className="text-gray-600">{order ? "Modifica los datos del pedido" : "Crea un nuevo pedido"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Pedido</CardTitle>
            <CardDescription>Información básica del pedido</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderType">Tipo de pedido</Label>
                  <Select
                    value={formData.orderType}
                    onValueChange={(value: Order["orderType"]) =>
                      setFormData((prev) => ({ ...prev, orderType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dine-in">En restaurante</SelectItem>
                      <SelectItem value="takeaway">Para llevar</SelectItem>
                      <SelectItem value="delivery">Domicilio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.orderType === "dine-in" && (
                  <div className="space-y-2">
                    <Label htmlFor="tableId">Mesa</Label>
                    <Select
                      value={formData.tableId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, tableId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar mesa" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTables.map((table) => (
                          <SelectItem key={table.id} value={table.id}>
                            Mesa {table.number} (Cap: {table.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nombre del cliente</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Nombre del cliente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerCount">Número de personas</Label>
                  <Input
                    id="customerCount"
                    type="number"
                    min="1"
                    value={formData.customerCount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customerCount: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas especiales</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Instrucciones especiales, alergias, etc."
                  rows={3}
                />
              </div>

              {order && (
                <div className="space-y-2">
                  <Label htmlFor="status">Estado del pedido</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Order["status"]) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
              )}
            </form>
          </CardContent>
        </Card>

        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Agregar Productos</CardTitle>
            <CardDescription>Selecciona productos del menú</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => addProductToOrder(product.id)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Items del Pedido</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{getProductName(item.productId)}</p>
                  <p className="text-sm text-gray-600">${item.price.toFixed(2)} c/u</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-right ml-4">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}

            {orderItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No hay items en el pedido</p>
                <p className="text-sm">Selecciona productos del menú para agregar</p>
              </div>
            )}
          </div>

          {orderItems.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700" disabled={orderItems.length === 0}>
          <Save className="mr-2 h-4 w-4" />
          {order ? "Actualizar" : "Crear"} Pedido
        </Button>
      </div>
    </div>
  )
}
