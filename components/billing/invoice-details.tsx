"use client"

import { useState } from "react"
import { useRestaurant } from "@/contexts/restaurant-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Download, X } from "lucide-react"
import type { Invoice, Payment } from "@/types/restaurant"

interface InvoiceDetailsProps {
  invoice: Invoice
  onClose: () => void
}

export function InvoiceDetails({ invoice, onClose }: InvoiceDetailsProps) {
  const { processPayment, orders, currentUser } = useRestaurant()
  const [paymentAmount, setPaymentAmount] = useState(invoice.total - invoice.paidAmount)
  const [paymentMethod, setPaymentMethod] = useState<Payment["method"]>("cash")
  const [reference, setReference] = useState("")

  const order = orders.find((o) => o.id === invoice.orderId)
  const remainingAmount = invoice.total - invoice.paidAmount

  const handlePayment = () => {
    if (paymentAmount <= 0 || paymentAmount > remainingAmount) return

    processPayment(invoice.id, {
      invoiceId: invoice.id,
      amount: paymentAmount,
      method: paymentMethod,
      reference: reference || undefined,
      cashierId: currentUser?.id || "1",
    })

    // Reset form
    setPaymentAmount(remainingAmount - paymentAmount)
    setReference("")
  }

  const getStatusColor = (status: Invoice["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "partial":
        return "bg-blue-100 text-blue-800"
      case "refunded":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: Invoice["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "Pagado"
      case "pending":
        return "Pendiente"
      case "partial":
        return "Parcial"
      case "refunded":
        return "Reembolsado"
      default:
        return status
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Factura {invoice.invoiceNumber}</span>
            <Badge className={getStatusColor(invoice.paymentStatus)}>{getStatusText(invoice.paymentStatus)}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Fecha</Label>
              <p>{invoice.createdAt.toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Mesa</Label>
              <p>{order?.tableId ? `Mesa ${order.tableId}` : "N/A"}</p>
            </div>
            {invoice.customerName && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Cliente</Label>
                <p>{invoice.customerName}</p>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-500">Tipo de Orden</Label>
              <p className="capitalize">{order?.orderType || "N/A"}</p>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <Label className="text-sm font-medium text-gray-500 mb-3 block">Productos</Label>
            <div className="space-y-2">
              {invoice.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento:</span>
                <span>-${invoice.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>IVA ({(invoice.taxRate * 100).toFixed(0)}%):</span>
              <span>${invoice.taxAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Pagado:</span>
                  <span>${invoice.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Pendiente:</span>
                  <span>${remainingAmount.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Payment Section */}
          {invoice.paymentStatus !== "paid" && (
            <>
              <Separator />
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-500">Procesar Pago</Label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Monto a Pagar</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      max={remainingAmount}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="method">Método de Pago</Label>
                    <Select value={paymentMethod} onValueChange={(value: Payment["method"]) => setPaymentMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="card">Tarjeta</SelectItem>
                        <SelectItem value="transfer">Transferencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {paymentMethod !== "cash" && (
                  <div>
                    <Label htmlFor="reference">Referencia</Label>
                    <Input
                      id="reference"
                      placeholder="Número de referencia o autorización"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={paymentAmount <= 0 || paymentAmount > remainingAmount}
                  className="w-full"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Procesar Pago de ${paymentAmount.toFixed(2)}
                </Button>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
