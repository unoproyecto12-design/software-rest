"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRestaurant } from "@/contexts/restaurant-context"
import { TableStatusDialog } from "./table-status-dialog"
import { TableForm } from "./table-form"
import { Plus, Users, Clock, User } from "lucide-react"
import type { Table } from "@/types/restaurant"

export function TableFloorPlan() {
  const { tables, updateTableStatus } = useRestaurant()
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showTableForm, setShowTableForm] = useState(false)

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500 hover:bg-green-600"
      case "occupied":
        return "bg-red-500 hover:bg-red-600"
      case "reserved":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "cleaning":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-300"
    }
  }

  const getStatusText = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "occupied":
        return "Ocupada"
      case "reserved":
        return "Reservada"
      case "cleaning":
        return "Limpieza"
      default:
        return "Desconocido"
    }
  }

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
    setShowStatusDialog(true)
  }

  const handleStatusUpdate = (status: Table["status"], customerData?: { name?: string; count?: number }) => {
    if (selectedTable) {
      updateTableStatus(selectedTable.id, status, customerData)
      setShowStatusDialog(false)
      setSelectedTable(null)
    }
  }

  const getTableShape = (table: Table) => {
    const baseClasses = `absolute cursor-pointer transition-all duration-200 flex items-center justify-center text-white font-semibold shadow-lg ${getStatusColor(table.status)}`

    switch (table.shape) {
      case "round":
        return `${baseClasses} rounded-full w-20 h-20`
      case "square":
        return `${baseClasses} rounded-lg w-20 h-20`
      case "rectangle":
        return `${baseClasses} rounded-lg w-24 h-16`
      default:
        return `${baseClasses} rounded-lg w-20 h-20`
    }
  }

  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    cleaning: tables.filter((t) => t.status === "cleaning").length,
  }

  if (showTableForm) {
    return <TableForm onClose={() => setShowTableForm(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Mesas</h2>
          <p className="text-gray-600">Vista en tiempo real del estado de las mesas</p>
        </div>
        <Button onClick={() => setShowTableForm(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Mesa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-xs text-gray-600">Disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{stats.occupied}</p>
                <p className="text-xs text-gray-600">Ocupadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{stats.reserved}</p>
                <p className="text-xs text-gray-600">Reservadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{stats.cleaning}</p>
                <p className="text-xs text-gray-600">Limpieza</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floor Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Plano del Restaurante</CardTitle>
          <CardDescription>Haz clic en una mesa para cambiar su estado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg p-8 min-h-96 overflow-auto">
            {tables.map((table) => (
              <div
                key={table.id}
                className={getTableShape(table)}
                style={{
                  left: `${table.position.x}px`,
                  top: `${table.position.y}px`,
                }}
                onClick={() => handleTableClick(table)}
                title={`Mesa ${table.number} - ${getStatusText(table.status)}`}
              >
                <span className="text-sm">{table.number}</span>
              </div>
            ))}

            {tables.length === 0 && (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay mesas</h3>
                  <p className="mt-1 text-sm text-gray-500">Comienza agregando mesas a tu restaurante.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Mesas Ocupadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tables
                .filter((t) => t.status === "occupied")
                .map((table) => (
                  <div key={table.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">Mesa {table.number}</p>
                      <p className="text-sm text-gray-600">
                        {table.customerName} • {table.customerCount} personas
                      </p>
                    </div>
                    <Badge variant="destructive">Ocupada</Badge>
                  </div>
                ))}
              {tables.filter((t) => t.status === "occupied").length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay mesas ocupadas</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Reservas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tables
                .filter((t) => t.status === "reserved")
                .map((table) => (
                  <div key={table.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">Mesa {table.number}</p>
                      <p className="text-sm text-gray-600">
                        {table.customerName} • {table.customerCount} personas
                      </p>
                      {table.reservationTime && (
                        <p className="text-xs text-gray-500">
                          {table.reservationTime.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Reservada</Badge>
                  </div>
                ))}
              {tables.filter((t) => t.status === "reserved").length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay reservas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Dialog */}
      {showStatusDialog && selectedTable && (
        <TableStatusDialog
          table={selectedTable}
          onStatusUpdate={handleStatusUpdate}
          onClose={() => {
            setShowStatusDialog(false)
            setSelectedTable(null)
          }}
        />
      )}
    </div>
  )
}
