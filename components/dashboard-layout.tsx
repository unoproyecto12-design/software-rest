"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  ChefHat,
  Home,
  Package,
  Users,
  Table,
  ShoppingCart,
  Warehouse,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
}

export function DashboardLayout({ children, currentPage, onPageChange }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, roles: ["admin", "waiter", "cashier"] },
    { id: "products", label: "Productos", icon: Package, roles: ["admin"] },
    { id: "categories", label: "Categorías", icon: Users, roles: ["admin"] },
    { id: "tables", label: "Mesas", icon: Table, roles: ["admin", "waiter"] },
    { id: "orders", label: "Pedidos", icon: ShoppingCart, roles: ["admin", "waiter", "cashier"] },
    { id: "inventory", label: "Inventario", icon: Warehouse, roles: ["admin"] },
    { id: "billing", label: "Facturación", icon: Receipt, roles: ["admin", "cashier"] },
    { id: "reports", label: "Reportes", icon: BarChart3, roles: ["admin"] },
    { id: "settings", label: "Configuración", icon: Settings, roles: ["admin"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => user && item.roles.includes(user.role))

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "waiter":
        return "bg-blue-100 text-blue-800"
      case "cashier":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <span className="text-xl font-bold text-gray-900">RestaurantePOS</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col h-full">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    currentPage === item.id && "bg-orange-100 text-orange-900 hover:bg-orange-200",
                  )}
                  onClick={() => {
                    onPageChange(item.id)
                    setSidebarOpen(false)
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold">{user?.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    getRoleColor(user?.role || ""),
                  )}
                >
                  {user?.role === "admin" ? "Administrador" : user?.role === "waiter" ? "Mesero" : "Cajero"}
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            {filteredMenuItems.find((item) => item.id === currentPage)?.label || "Dashboard"}
          </h1>
          <div className="w-10" /> {/* Spacer for mobile */}
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
