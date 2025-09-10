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
import type { InventoryItem } from "@/types/restaurant"
import { ArrowLeft, Save } from "lucide-react"

interface InventoryFormProps {
  item?: InventoryItem | null
  onClose: () => void
}

export function InventoryForm({ item, onClose }: InventoryFormProps) {
  const { addInventoryItem, updateInventoryItem, productGroups, settings } = useRestaurant()
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    unit: item?.unit || "kg",
    currentStock: item?.currentStock || 0,
    minStock: item?.minStock || 0,
    maxStock: item?.maxStock || 0,
    unitCost: item?.unitCost || 0,
    supplier: item?.supplier || "",
    groupId: item?.groupId || "",
    subgroupId: item?.subgroupId || "",
    expirationDate: item?.expirationDate ? item.expirationDate.toISOString().split("T")[0] : "",
  })

  const formatCurrency = (currency: string) => {
    return currency === "COP" ? "COP (Pesos Colombianos)" : "USD (Dólares)"
  }

  const availableSubgroups = formData.groupId
    ? productGroups.find((g) => g.id === formData.groupId)?.subgroups || []
    : []

  const handleGroupChange = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      groupId,
      subgroupId: "", // Reset subgroup when group changes
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const group = formData.groupId ? productGroups.find((g) => g.id === formData.groupId) : undefined
    const validCategories = ["ingredients", "beverages", "supplies", "cleaning"] as const
    const category = group && validCategories.includes(group.name as typeof validCategories[number])
      ? (group.name as typeof validCategories[number])
      : "ingredients"

    const itemData = {
      ...formData,
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined,
      lastRestocked: item?.lastRestocked || new Date(),
      category,
    }

    if (item) {
      updateInventoryItem(item.id, itemData)
    } else {
      addInventoryItem(itemData)
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
          <h2 className="text-2xl font-bold text-gray-900">{item ? "Editar Item" : "Nuevo Item de Inventario"}</h2>
          <p className="text-gray-600">{item ? "Modifica los datos del item" : "Agrega un nuevo item al inventario"}</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información del Item</CardTitle>
          <CardDescription>Completa los datos para {item ? "actualizar" : "crear"} el item</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Harina de Trigo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Grupo *</Label>
                <Select value={formData.groupId} onValueChange={handleGroupChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {productGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.groupId && availableSubgroups.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="subgroup">Subgrupo</Label>
                  <Select
                    value={formData.subgroupId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, subgroupId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un subgrupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin subgrupo</SelectItem>
                      {availableSubgroups.map((subgroup) => (
                        <SelectItem key={subgroup.id} value={subgroup.id}>
                          {subgroup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="unit">Unidad de medida *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                    <SelectItem value="g">Gramos (g)</SelectItem>
                    <SelectItem value="l">Litros (l)</SelectItem>
                    <SelectItem value="ml">Mililitros (ml)</SelectItem>
                    <SelectItem value="unidades">Unidades</SelectItem>
                    <SelectItem value="cajas">Cajas</SelectItem>
                    <SelectItem value="paquetes">Paquetes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitCost">Costo unitario ({formatCurrency(settings.currency?.code || "USD")}) *</Label>
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentStock">Stock actual</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  value={formData.currentStock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentStock: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Stock mínimo *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minStock: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStock">Stock máximo *</Label>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  value={formData.maxStock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxStock: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Proveedor</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData((prev) => ({ ...prev, supplier: e.target.value }))}
                  placeholder="Nombre del proveedor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Fecha de expiración</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expirationDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del item, características especiales..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                <Save className="mr-2 h-4 w-4" />
                {item ? "Actualizar" : "Crear"} Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
