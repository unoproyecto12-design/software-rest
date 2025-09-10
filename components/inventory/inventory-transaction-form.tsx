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
import type { InventoryItem, InventoryTransaction } from "@/types/restaurant"
import { ArrowLeft, Save, TrendingUp, TrendingDown, Package, AlertTriangle } from "lucide-react"

interface InventoryTransactionFormProps {
  item: InventoryItem
  onClose: () => void
}

export function InventoryTransactionForm({ item, onClose }: InventoryTransactionFormProps) {
  const { addInventoryTransaction } = useRestaurant()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    type: "purchase" as InventoryTransaction["type"],
    quantity: 0,
    unitCost: item.unitCost,
    reason: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const transactionData = {
      inventoryItemId: item.id,
      type: formData.type,
      quantity: formData.quantity,
      unitCost: formData.type === "purchase" ? formData.unitCost : undefined,
      totalCost: formData.type === "purchase" ? formData.quantity * formData.unitCost : undefined,
      reason: formData.reason || undefined,
      userId: user?.id || "unknown",
    }

    addInventoryTransaction(transactionData)
    onClose()
  }

  const getTransactionIcon = (type: InventoryTransaction["type"]) => {
    switch (type) {
      case "purchase":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "usage":
        return <TrendingDown className="h-4 w-4 text-blue-600" />
      case "waste":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "adjustment":
        return <Package className="h-4 w-4 text-gray-600" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getTransactionText = (type: InventoryTransaction["type"]) => {
    switch (type) {
      case "purchase":
        return "Compra"
      case "usage":
        return "Uso"
      case "waste":
        return "Desperdicio"
      case "adjustment":
        return "Ajuste"
      default:
        return type
    }
  }

  const predictedStock =
    formData.type === "purchase" || formData.type === "adjustment"
      ? item.currentStock + formData.quantity
      : item.currentStock - formData.quantity

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nueva Transacción</h2>
          <p className="text-gray-600">{item.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Stock Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Stock Actual</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold">
                  {item.currentStock} {item.unit}
                </p>
                <p className="text-sm text-gray-600">Disponible</p>
              </div>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Mínimo:</span>
                  <span>
                    {item.minStock} {item.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Máximo:</span>
                  <span>
                    {item.maxStock} {item.unit}
                  </span>
                </div>
              </div>
              {formData.quantity > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">Stock después de transacción:</p>
                  <p
                    className={`text-lg font-semibold ${
                      predictedStock < item.minStock
                        ? "text-red-600"
                        : predictedStock > item.maxStock
                          ? "text-blue-600"
                          : "text-green-600"
                    }`}
                  >
                    {Math.max(0, predictedStock)} {item.unit}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detalles de la Transacción</CardTitle>
            <CardDescription>Registra el movimiento de inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de transacción *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: InventoryTransaction["type"]) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span>Compra</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="usage">
                        <div className="flex items-center space-x-2">
                          <TrendingDown className="h-4 w-4 text-blue-600" />
                          <span>Uso</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="waste">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span>Desperdicio</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="adjustment">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-600" />
                          <span>Ajuste</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                      required
                    />
                    <div className="flex items-center px-3 bg-gray-100 rounded-md">
                      <span className="text-sm text-gray-600">{item.unit}</span>
                    </div>
                  </div>
                </div>

                {formData.type === "purchase" && (
                  <div className="space-y-2">
                    <Label htmlFor="unitCost">Costo unitario</Label>
                    <Input
                      id="unitCost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.unitCost}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          unitCost: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="0.00"
                    />
                  </div>
                )}

                {formData.type === "purchase" && formData.quantity > 0 && formData.unitCost > 0 && (
                  <div className="space-y-2">
                    <Label>Costo total</Label>
                    <div className="flex items-center px-3 py-2 bg-gray-100 rounded-md">
                      <span className="text-lg font-semibold text-green-600">
                        ${(formData.quantity * formData.unitCost).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="Describe el motivo de esta transacción..."
                  rows={3}
                />
              </div>

              {predictedStock < 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Advertencia: Esta transacción resultaría en stock negativo
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={formData.quantity <= 0}>
                  <Save className="mr-2 h-4 w-4" />
                  Registrar Transacción
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
