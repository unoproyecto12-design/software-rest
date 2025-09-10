"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { RestaurantProvider } from "@/contexts/restaurant-context"
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHome } from "@/components/dashboard-home"
import { CategoryList } from "@/components/categories/category-list"
import { ProductList } from "@/components/products/product-list"
import { TableFloorPlan } from "@/components/tables/table-floor-plan"
import { OrderList } from "@/components/orders/order-list"
import { InventoryList } from "@/components/inventory/inventory-list"
import { InvoiceList } from "@/components/billing/invoice-list"
import { CashRegister } from "@/components/billing/cash-register"
import { ReportsDashboard } from "@/components/reports/reports-dashboard"
import { RestaurantSettings } from "@/components/settings/restaurant-settings"

function AppContent() {
  const { user, isLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState("dashboard")

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardHome />
      case "products":
        return <ProductList />
      case "categories":
        return <CategoryList />
      case "tables":
        return <TableFloorPlan />
      case "orders":
        return <OrderList />
      case "inventory":
        return <InventoryList />
      case "billing":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <InvoiceList />
              </div>
              <div>
                <CashRegister />
              </div>
            </div>
          </div>
        )
      case "reports":
        return <ReportsDashboard />
      case "settings":
        return <RestaurantSettings />
      default:
        return <DashboardHome />
    }
  }

  return (
    <RestaurantProvider>
      <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </DashboardLayout>
    </RestaurantProvider>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
