"use client"

import { useState } from "react"
import { useRestaurant } from "@/contexts/restaurant-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { CashRegister as CashRegisterType } from "@/types/restaurant"
import { Calculator, DollarSign, TrendingUp, Clock } from "lucide-react"

export function CashRegister() {
  const { cashRegisters, openCashRegister, closeCashRegister, currentUser, invoices, payments } = useRestaurant()

  const [openingAmount, setOpeningAmount] = useState(0)
  const [closingAmount, setClosingAmount] = useState(0)

  const currentRegister = cashRegisters.find((r) => r.status === "open" && r.cashierId === currentUser?.id)
  const todayRegisters = cashRegisters.filter((r) => {
    const today = new Date()
    const registerDate = new Date(r.openedAt)
    return registerDate.toDateString() === today.toDateString()
  })

  const handleOpenRegister = () => {
    if (currentUser && openingAmount >= 0) {
      openCashRegister(currentUser.id, openingAmount)
      setOpeningAmount(0)
    }
  }

  const handleCloseRegister = () => {
    if (currentRegister && closingAmount >= 0) {
      closeCashRegister(currentRegister.id, closingAmount)
      setClosingAmount(0)
    }
  }

  const calculateRegisterTotals = (register: CashRegisterType) => {
    const registerPayments = payments.filter((p) => {
      const paymentDate = new Date(p.createdAt)
      const registerStart = new Date(register.openedAt)
      const registerEnd = register.closedAt ? new Date(register.closedAt) : new Date()

      return paymentDate >= registerStart && paymentDate <= registerEnd && p.cashierId === register.cashierId
    })

    const totalSales = registerPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalCash = registerPayments.filter((p) => p.method === "cash").reduce((sum, p) => sum + p.amount, 0)
    const totalCard = registerPayments.filter((p) => p.method === "card").reduce((sum, p) => sum + p.amount, 0)
    const totalTransfer = registerPayments.filter((p) => p.method === "transfer").reduce((sum, p) => sum + p.amount, 0)

    return { totalSales, totalCash, totalCard, totalTransfer }
  }

  return (
    <div className="space-y-6">
      {/* Current Register Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Caja Registradora
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentRegister ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-800">Caja Abierta</Badge>
                <span className="text-sm text-gray-500">Abierta: {currentRegister.openedAt.toLocaleTimeString()}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm text-gray-600">Monto Inicial</p>
                  <p className="text-lg font-semibold">${currentRegister.openingAmount.toFixed(2)}</p>
                </div>

                {(() => {
                  const totals = calculateRegisterTotals(currentRegister)
                  return (
                    <>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="h-6 w-6 mx-auto mb-1 text-green-600" />
                        <p className="text-sm text-gray-600">Ventas Total</p>
                        <p className="text-lg font-semibold">${totals.totalSales.toFixed(2)}</p>
                      </div>

                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <DollarSign className="h-6 w-6 mx-auto mb-1 text-yellow-600" />
                        <p className="text-sm text-gray-600">Efectivo</p>
                        <p className="text-lg font-semibold">${totals.totalCash.toFixed(2)}</p>
                      </div>

                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <DollarSign className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                        <p className="text-sm text-gray-600">Tarjetas</p>
                        <p className="text-lg font-semibold">${totals.totalCard.toFixed(2)}</p>
                      </div>
                    </>
                  )
                })()}
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="closing-amount">Monto de Cierre (Efectivo en Caja)</Label>
                <div className="flex gap-2">
                  <Input
                    id="closing-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={closingAmount || ""}
                    onChange={(e) => setClosingAmount(Number(e.target.value))}
                  />
                  <Button onClick={handleCloseRegister}>Cerrar Caja</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">No hay caja abierta</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="opening-amount">Monto Inicial</Label>
                <div className="flex gap-2">
                  <Input
                    id="opening-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={openingAmount || ""}
                    onChange={(e) => setOpeningAmount(Number(e.target.value))}
                  />
                  <Button onClick={handleOpenRegister}>Abrir Caja</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Registers */}
      {todayRegisters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cajas del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayRegisters.map((register) => {
                const totals = calculateRegisterTotals(register)
                const expectedCash = register.openingAmount + totals.totalCash
                const difference = register.closingAmount ? register.closingAmount - expectedCash : 0

                return (
                  <Card key={register.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            register.status === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {register.status === "open" ? "Abierta" : "Cerrada"}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {register.openedAt.toLocaleTimeString()} -{" "}
                          {register.closedAt?.toLocaleTimeString() || "Actual"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Inicial:</span>
                        <p className="font-semibold">${register.openingAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Ventas:</span>
                        <p className="font-semibold">${totals.totalSales.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Efectivo:</span>
                        <p className="font-semibold">${totals.totalCash.toFixed(2)}</p>
                      </div>
                      {register.closingAmount !== undefined && (
                        <>
                          <div>
                            <span className="text-gray-500">Cierre:</span>
                            <p className="font-semibold">${register.closingAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Diferencia:</span>
                            <p className={`font-semibold ${difference >= 0 ? "text-green-600" : "text-red-600"}`}>
                              ${difference.toFixed(2)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
