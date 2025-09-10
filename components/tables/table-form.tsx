"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRestaurant } from "@/contexts/restaurant-context"
import type { Table } from "@/types/restaurant"
import { ArrowLeft, Save } from "lucide-react"

interface TableFormProps {
  table?: Table | null
  onClose: () => void
}

export function TableForm({ table, onClose }: TableFormProps) {
  const { addTable, updateTable } = useRestaurant()
  const [formData, setFormData] = useState({
    number: table?.number || 1,
    capacity: table?.capacity || 2,
    shape: table?.shape || ("round" as Table["shape"]),
    position: table?.position || { x: 100, y: 100 },
    status: table?.status || ("available" as Table["status"]),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (table) {
      updateTable(table.id, formData)
    } else {
      addTable(formData)
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
          <h2 className="text-2xl font-bold text-gray-900">{table ? "Editar Mesa" : "Nueva Mesa"}</h2>
          <p className="text-gray-600">
            {table ? "Modifica los datos de la mesa" : "Agrega una nueva mesa al restaurante"}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información de la Mesa</CardTitle>
          <CardDescription>Completa los datos para {table ? "actualizar" : "crear"} la mesa</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="number">Número de Mesa *</Label>
                <Input
                  id="number"
                  type="number"
                  min="1"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      number: Number.parseInt(e.target.value) || 1,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidad *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      capacity: Number.parseInt(e.target.value) || 2,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shape">Forma</Label>
                <Select
                  value={formData.shape}
                  onValueChange={(value: Table["shape"]) => setFormData((prev) => ({ ...prev, shape: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round">Redonda</SelectItem>
                    <SelectItem value="square">Cuadrada</SelectItem>
                    <SelectItem value="rectangle">Rectangular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado Inicial</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Table["status"]) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="cleaning">En limpieza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Posición en el plano</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="positionX">Posición X</Label>
                  <Input
                    id="positionX"
                    type="number"
                    min="0"
                    value={formData.position.x}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        position: {
                          ...prev.position,
                          x: Number.parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positionY">Posición Y</Label>
                  <Input
                    id="positionY"
                    type="number"
                    min="0"
                    value={formData.position.y}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        position: {
                          ...prev.position,
                          y: Number.parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                <Save className="mr-2 h-4 w-4" />
                {table ? "Actualizar" : "Crear"} Mesa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
