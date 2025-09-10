"use client"

import { useState } from "react"
import { useRestaurant } from "@/contexts/restaurant-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, Eye, CreditCard } from "lucide-react"
import type { Invoice } from "@/types/restaurant"
import { InvoiceDetails } from "./invoice-details"

export function InvoiceList() {
  const { invoices, orders, products } = useRestaurant()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowDetails(true)
  }

  const handleDownloadPDF = (invoice: Invoice) => {
    // Generate PDF content
    const pdfContent = generatePDFContent(invoice)

    // Create blob and download
    const blob = new Blob([pdfContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${invoice.invoiceNumber}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generatePDFContent = (invoice: Invoice) => {
    const order = orders.find((o) => o.id === invoice.orderId)

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Factura ${invoice.invoiceNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .customer-info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .totals { text-align: right; }
        .total-row { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RESTAURANTE</h1>
        <h2>FACTURA</h2>
    </div>
    
    <div class="invoice-info">
        <div>
            <strong>Factura #:</strong> ${invoice.invoiceNumber}<br>
            <strong>Fecha:</strong> ${invoice.createdAt.toLocaleDateString()}
        </div>
        <div>
            <strong>Mesa:</strong> ${order?.tableId ? `Mesa ${order.tableId}` : "N/A"}<br>
            <strong>Tipo:</strong> ${order?.orderType || "N/A"}
        </div>
    </div>
    
    ${
      invoice.customerName
        ? `
    <div class="customer-info">
        <strong>Cliente:</strong> ${invoice.customerName}<br>
        ${invoice.customerEmail ? `<strong>Email:</strong> ${invoice.customerEmail}<br>` : ""}
        ${invoice.customerPhone ? `<strong>Teléfono:</strong> ${invoice.customerPhone}<br>` : ""}
    </div>
    `
        : ""
    }
    
    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${invoice.items
              .map(
                (item) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.unitPrice.toFixed(2)}</td>
                    <td>$${item.total.toFixed(2)}</td>
                </tr>
            `,
              )
              .join("")}
        </tbody>
    </table>
    
    <div class="totals">
        <p><strong>Subtotal:</strong> $${invoice.subtotal.toFixed(2)}</p>
        ${invoice.discountAmount > 0 ? `<p><strong>Descuento:</strong> -$${invoice.discountAmount.toFixed(2)}</p>` : ""}
        <p><strong>IVA (${(invoice.taxRate * 100).toFixed(0)}%):</strong> $${invoice.taxAmount.toFixed(2)}</p>
        <p class="total-row"><strong>TOTAL:</strong> $${invoice.total.toFixed(2)}</p>
    </div>
    
    <div style="margin-top: 30px; text-align: center;">
        <p>¡Gracias por su preferencia!</p>
    </div>
</body>
</html>
    `
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Facturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por número de factura o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredInvoices.map((invoice) => {
              const order = orders.find((o) => o.id === invoice.orderId)

              return (
                <Card key={invoice.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.paymentStatus)}>
                          {getStatusText(invoice.paymentStatus)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Cliente:</span>
                          <br />
                          {invoice.customerName || "Sin nombre"}
                        </div>
                        <div>
                          <span className="font-medium">Mesa:</span>
                          <br />
                          {order?.tableId ? `Mesa ${order.tableId}` : "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>
                          <br />
                          <span className="font-semibold text-lg">${invoice.total.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Fecha:</span>
                          <br />
                          {invoice.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(invoice)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(invoice)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.paymentStatus !== "paid" && (
                        <Button size="sm" onClick={() => handleViewDetails(invoice)}>
                          <CreditCard className="h-4 w-4 mr-1" />
                          Cobrar
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}

            {filteredInvoices.length === 0 && (
              <div className="text-center py-8 text-gray-500">No se encontraron facturas</div>
            )}
          </div>
        </CardContent>
      </Card>

      {showDetails && selectedInvoice && (
        <InvoiceDetails invoice={selectedInvoice} onClose={() => setShowDetails(false)} />
      )}
    </>
  )
}
