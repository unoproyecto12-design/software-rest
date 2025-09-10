"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRestaurant } from "@/contexts/restaurant-context"
import { InventoryForm } from "./inventory-form"
import { InventoryTransactionForm } from "./inventory-transaction-form"
import { Plus, Search, Package, AlertTriangle, TrendingUp, Calendar, Tag } from "lucide-react"
import type { InventoryItem } from "@/types/restaurant"

export function InventoryList() {
  const { inventoryItems, stockAlerts, productGroups, settings } = useRestaurant()
  const [showForm, setShowForm] = useState(false)
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [groupFilter, setGroupFilter] = useState<string>("all")
  const [subgroupFilter, setSubgroupFilter] = useState<string>("all")

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ""
    const matchesGroup = groupFilter === "all" || item.groupId === groupFilter
    const matchesSubgroup = subgroupFilter === "all" || item.subgroupId === subgroupFilter
    return matchesSearch && matchesGroup && matchesSubgroup
  })

  const formatCurrency = (amount: number) => {
    const currency = settings.currency?.code || "USD"
    if (currency === "COP") {
      return `$${amount.toLocaleString("es-CO")} COP`
    }
    return `$${amount.toFixed(2)} USD`
  }

  const getGroupInfo = (groupId?: string, subgroupId?: string) => {
    if (!groupId) return { groupName: "Sin grupo", subgroupName: "" }

    const group = productGroups.find((g) => g.id === groupId)
    const subgroup = group?.subgroups.find((s) => s.id === subgroupId)

    return {
      groupName: group?.name || "Sin grupo",
      subgroupName: subgroup?.name || "",
    }
  }

  const availableSubgroups =
    groupFilter === "all" ? [] : productGroups.find((g) => g.id === groupFilter)?.subgroups || []

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return { status: "out", color: "bg-red-100 text-red-800", text: "Agotado" }
    if (item.currentStock <= item.minStock)
      return { status: "low", color: "bg-yellow-100 text-yellow-800", text: "Stock Bajo" }
    if (item.currentStock >= item.maxStock)
      return { status: "high", color: "bg-blue-100 text-blue-800", text: "Stock Alto" }
    return { status: "normal", color: "bg-green-100 text-green-800", text: "Normal" }
  }

  const getItemAlerts = (itemId: string) => {
    return stockAlerts.filter((alert) => alert.inventoryItemId === itemId && !alert.isRead)
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleTransaction = (item: InventoryItem) => {
    setSelectedItem(item)
    setShowTransactionForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  const handleCloseTransactionForm = () => {
    setShowTransactionForm(false)
    setSelectedItem(null)
  }

  const handleGroupFilterChange = (value: string) => {
    setGroupFilter(value)
    setSubgroupFilter("all")
  }

  if (showForm) {
    return <InventoryForm item={editingItem} onClose={handleCloseForm} />
  }

  if (showTransactionForm && selectedItem) {
    return <InventoryTransactionForm item={selectedItem} onClose={handleCloseTransactionForm} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventario</h2>
          <p className="text-gray-600">Gestiona el stock de ingredientes y suministros por grupos</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Item
        </Button>
      </div>

      {/* Stock Alerts */}
      {stockAlerts.filter((alert) => !alert.isRead).length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Alertas de Stock</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stockAlerts
                .filter((alert) => !alert.isRead)
                .slice(0, 3)
                .map((alert) => (
                  <div key={alert.id} className="text-sm text-orange-700">
                    • {alert.message}
                  </div>
                ))}
              {stockAlerts.filter((alert) => !alert.isRead).length > 3 && (
                <div className="text-sm text-orange-600">
                  Y {stockAlerts.filter((alert) => !alert.isRead).length - 3} alertas más...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={groupFilter} onValueChange={handleGroupFilterChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los grupos</SelectItem>
            {productGroups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {groupFilter !== "all" && availableSubgroups.length > 0 && (
          <Select value={subgroupFilter} onValueChange={setSubgroupFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por subgrupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los subgrupos</SelectItem>
              {availableSubgroups.map((subgroup) => (
                <SelectItem key={subgroup.id} value={subgroup.id}>
                  {subgroup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item)
          const alerts = getItemAlerts(item.id)
          const { groupName, subgroupName } = getGroupInfo(item.groupId, item.subgroupId)

          return (
            <Card key={item.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{item.name}</span>
                      {alerts.length > 0 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    </CardTitle>
                    <CardDescription className="mt-1">{item.description}</CardDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <Tag className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {groupName}
                        {subgroupName && ` > ${subgroupName}`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-semibold">
                        {item.currentStock} {item.unit}
                      </span>
                    </div>
                    <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
                  </div>

                  <div className="text-sm text-gray-600">
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
                    <div className="flex justify-between">
                      <span>Costo unitario:</span>
                      <span>{formatCurrency(item.unitCost)}</span>
                    </div>
                  </div>

                  {item.supplier && (
                    <div className="text-xs text-gray-500">
                      <strong>Proveedor:</strong> {item.supplier}
                    </div>
                  )}

                  {item.expirationDate && (
                    <div className="flex items-center space-x-2 text-xs">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span
                        className={
                          new Date(item.expirationDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                            ? "text-red-600"
                            : "text-gray-500"
                        }
                      >
                        Expira: {item.expirationDate.toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleTransaction(item)} className="flex-1">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Transacción
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm || groupFilter !== "all" ? "No se encontraron items" : "No hay items en inventario"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || groupFilter !== "all"
              ? "Intenta con otros términos de búsqueda o filtros"
              : "Comienza agregando items a tu inventario."}
          </p>
          {!searchTerm && groupFilter === "all" && (
            <div className="mt-6">
              <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Item
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
