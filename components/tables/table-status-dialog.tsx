"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Table } from "@/types/restaurant"
import { Users, Clock, User, CheckCircle, XCircle, AlertCircle, Trash2 } from "lucide-react"

interface TableStatusDialogProps {
  table: Table
  onStatusUpdate: (status: Table["status"], customerData?: { name?: string; count?: number }) => void
  onClose: () => void
}

export function TableStatusDialog({ table, onStatusUpdate, onClose }: TableStatusDialogProps) {
  const [customerName, setCustomerName] = useState(table.customerName || "")
  const [customerCount, setCustomerCount] = useState(table.customerCount || 1)

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "text-green-600"
      case "occupied":
        return "text-red-600"
      case "reserved":
        return "text-yellow-600"
      case "cleaning":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-5 w-5" />
      case "occupied":
        return <XCircle className="h-5 w-5" />
      case "reserved":
        return <Clock className="h-5 w-5" />
      case "cleaning":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const handleStatusChange = (newStatus: Table["status"]) => {
    if (newStatus === "occupied" || newStatus === "reserved") {
      if (customerName.trim()) {
        onStatusUpdate(newStatus, { name: customerName.trim(), count: customerCount })
      }
    } else {
      onStatusUpdate(newStatus)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Mesa {table.number}</span>
          </DialogTitle>
          <DialogDescription>
            Capacidad: {table.capacity} personas • Forma:{" "}
            {table.shape === "round" ? "Redonda" : table.shape === "square" ? "Cuadrada" : "Rectangular"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className={getStatusColor(table.status)}>{getStatusIcon(table.status)}</span>
              <span className="font-medium">Estado actual</span>
            </div>
            <Badge variant={table.status === "available" ? "default" : "secondary"}>
              {table.status === "available"
                ? "Disponible"
                : table.status === "occupied"
                  ? "Ocupada"
                  : table.status === "reserved"
                    ? "Reservada"
                    : "Limpieza"}
            </Badge>
          </div>

          {/* Current Customer Info */}
          {(table.status === "occupied" || table.status === "reserved") && table.customerName && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Cliente actual</span>
              </div>
              <p className="text-sm text-blue-800">{table.customerName}</p>
              <p className="text-sm text-blue-600">{table.customerCount} personas</p>
              {table.reservationTime && (
                <p className="text-xs text-blue-500 mt-1">Reserva: {table.reservationTime.toLocaleString("es-ES")}</p>
              )}
            </div>
          )}

          {/* Customer Input for Occupied/Reserved */}
          {table.status !== "occupied" && table.status !== "reserved" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nombre del cliente</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nombre del cliente o reserva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerCount">Número de personas</Label>
                <Input
                  id="customerCount"
                  type="number"
                  min="1"
                  max={table.capacity}
                  value={customerCount}
                  onChange={(e) => setCustomerCount(Number.parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={table.status === "available" ? "default" : "outline"}
              onClick={() => handleStatusChange("available")}
              className="flex items-center space-x-2"
              disabled={table.status === "available"}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Disponible</span>
            </Button>

            <Button
              variant={table.status === "occupied" ? "destructive" : "outline"}
              onClick={() => handleStatusChange("occupied")}
              className="flex items-center space-x-2"
              disabled={table.status === "occupied" || !customerName.trim()}
            >
              <XCircle className="h-4 w-4" />
              <span>Ocupar</span>
            </Button>

            <Button
              variant={table.status === "reserved" ? "secondary" : "outline"}
              onClick={() => handleStatusChange("reserved")}
              className="flex items-center space-x-2"
              disabled={table.status === "reserved" || !customerName.trim()}
            >
              <Clock className="h-4 w-4" />
              <span>Reservar</span>
            </Button>

            <Button
              variant={table.status === "cleaning" ? "secondary" : "outline"}
              onClick={() => handleStatusChange("cleaning")}
              className="flex items-center space-x-2"
              disabled={table.status === "cleaning"}
            >
              <Trash2 className="h-4 w-4" />
              <span>Limpieza</span>
            </Button>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
