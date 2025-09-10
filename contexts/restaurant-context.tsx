"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type {
  Category,
  Product,
  Table,
  TableArea,
  Order,
  OrderItem,
  KitchenTicket,
  InventoryItem,
  Recipe,
  InventoryTransaction,
  StockAlert,
  Invoice,
  Payment,
  CashRegister,
  Discount,
  ProductGroup,
  ProductSubgroup,
  CurrencyConfig,
  RestaurantSettings,
} from "@/types/restaurant"

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

// Mock data
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Pizzas",
    description: "Deliciosas pizzas artesanales",
    color: "#ef4444",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Bebidas",
    description: "Refrescos, jugos y bebidas calientes",
    color: "#3b82f6",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Ensaladas",
    description: "Ensaladas frescas y saludables",
    color: "#10b981",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Pizza clásica con tomate, mozzarella y albahaca",
    price: 18.5,
    categoryId: "1",
    isActive: true,
    preparationTime: 15,
    ingredients: ["Masa de pizza", "Salsa de tomate", "Mozzarella", "Albahaca"],
    allergens: ["Gluten", "Lácteos"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Pizza Pepperoni",
    description: "Pizza con pepperoni y queso mozzarella",
    price: 22.0,
    categoryId: "1",
    isActive: true,
    preparationTime: 15,
    ingredients: ["Masa de pizza", "Salsa de tomate", "Mozzarella", "Pepperoni"],
    allergens: ["Gluten", "Lácteos"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Coca Cola",
    description: "Refresco de cola 350ml",
    price: 3.5,
    categoryId: "2",
    isActive: true,
    preparationTime: 1,
    ingredients: ["Agua carbonatada", "Azúcar", "Cafeína"],
    allergens: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Ensalada César",
    description: "Lechuga romana, crutones, parmesano y aderezo césar",
    price: 12.0,
    categoryId: "3",
    isActive: true,
    preparationTime: 8,
    ingredients: ["Lechuga romana", "Crutones", "Queso parmesano", "Aderezo césar"],
    allergens: ["Lácteos", "Huevo"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

const mockTables: Table[] = [
  {
    id: "1",
    number: 1,
    capacity: 2,
    status: "available",
    lastUpdated: new Date(),
    position: { x: 100, y: 100 },
    shape: "round",
  },
  {
    id: "2",
    number: 2,
    capacity: 4,
    status: "occupied",
    currentOrder: "ORD-001",
    customerName: "Juan Pérez",
    customerCount: 3,
    lastUpdated: new Date(),
    position: { x: 250, y: 100 },
    shape: "square",
  },
  {
    id: "3",
    number: 3,
    capacity: 6,
    status: "reserved",
    customerName: "María García",
    customerCount: 5,
    reservationTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    lastUpdated: new Date(),
    position: { x: 400, y: 100 },
    shape: "rectangle",
  },
  {
    id: "4",
    number: 4,
    capacity: 2,
    status: "cleaning",
    lastUpdated: new Date(),
    position: { x: 100, y: 250 },
    shape: "round",
  },
  {
    id: "5",
    number: 5,
    capacity: 4,
    status: "available",
    lastUpdated: new Date(),
    position: { x: 250, y: 250 },
    shape: "square",
  },
  {
    id: "6",
    number: 6,
    capacity: 8,
    status: "occupied",
    currentOrder: "ORD-002",
    customerName: "Familia Rodríguez",
    customerCount: 7,
    lastUpdated: new Date(),
    position: { x: 400, y: 250 },
    shape: "rectangle",
  },
]

const mockTableAreas: TableArea[] = [
  {
    id: "1",
    name: "Área Principal",
    color: "#3b82f6",
    tables: ["1", "2", "3"],
  },
  {
    id: "2",
    name: "Terraza",
    color: "#10b981",
    tables: ["4", "5", "6"],
  },
]

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    tableId: "2",
    customerName: "Juan Pérez",
    customerCount: 3,
    items: [
      {
        id: "item-1",
        productId: "1",
        quantity: 2,
        price: 18.5,
        status: "preparing",
      },
      {
        id: "item-2",
        productId: "3",
        quantity: 3,
        price: 3.5,
        status: "ready",
      },
    ],
    status: "preparing",
    orderType: "dine-in",
    subtotal: 47.5,
    tax: 4.75,
    discount: 0,
    total: 52.25,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    waiterId: "2",
    estimatedTime: 25,
  },
  {
    id: "ORD-002",
    tableId: "6",
    customerName: "Familia Rodríguez",
    customerCount: 7,
    items: [
      {
        id: "item-3",
        productId: "2",
        quantity: 3,
        price: 22.0,
        status: "served",
      },
      {
        id: "item-4",
        productId: "4",
        quantity: 2,
        price: 12.0,
        status: "served",
      },
    ],
    status: "served",
    orderType: "dine-in",
    subtotal: 90.0,
    tax: 9.0,
    discount: 5.0,
    total: 94.0,
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 20 * 60 * 1000),
    servedAt: new Date(Date.now() - 20 * 60 * 1000),
    waiterId: "2",
  },
]

const mockKitchenTickets: KitchenTicket[] = [
  {
    id: "TICKET-001",
    orderId: "ORD-001",
    tableNumber: 2,
    items: [
      {
        id: "item-1",
        productId: "1",
        quantity: 2,
        price: 18.5,
        status: "preparing",
      },
    ],
    priority: "normal",
    estimatedTime: 15,
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    status: "preparing",
  },
]

const mockInventoryItems: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Harina de Trigo",
    description: "Harina para pizza y pan",
    unit: "kg",
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    unitCost: 2.5,
    supplier: "Molinos del Sur",
    category: "ingredients",
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "inv-2",
    name: "Queso Mozzarella",
    description: "Queso mozzarella para pizzas",
    unit: "kg",
    currentStock: 8,
    minStock: 15,
    maxStock: 30,
    unitCost: 12.0,
    supplier: "Lácteos Premium",
    category: "ingredients",
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "inv-3",
    name: "Tomates",
    description: "Tomates frescos para salsa",
    unit: "kg",
    currentStock: 12,
    minStock: 8,
    maxStock: 25,
    unitCost: 3.5,
    supplier: "Verduras Frescas",
    category: "ingredients",
    expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "inv-4",
    name: "Coca Cola",
    description: "Refresco de cola 2L",
    unit: "unidades",
    currentStock: 24,
    minStock: 12,
    maxStock: 48,
    unitCost: 2.8,
    supplier: "Distribuidora Bebidas",
    category: "beverages",
    lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

const mockRecipes: Recipe[] = [
  {
    id: "recipe-1",
    productId: "1", // Pizza Margherita
    name: "Pizza Margherita",
    description: "Receta clásica de pizza margherita",
    servings: 1,
    prepTime: 10,
    cookTime: 15,
    difficulty: "easy",
    instructions: [
      "Extender la masa de pizza",
      "Aplicar salsa de tomate uniformemente",
      "Agregar queso mozzarella",
      "Hornear a 220°C por 12-15 minutos",
      "Decorar con albahaca fresca",
    ],
    ingredients: [
      {
        id: "ri-1",
        inventoryItemId: "inv-1",
        quantity: 0.3,
        unit: "kg",
        notes: "Para la masa",
      },
      {
        id: "ri-2",
        inventoryItemId: "inv-2",
        quantity: 0.15,
        unit: "kg",
      },
      {
        id: "ri-3",
        inventoryItemId: "inv-3",
        quantity: 0.1,
        unit: "kg",
        notes: "Para la salsa",
      },
    ],
    totalCost: 3.85,
    costPerServing: 3.85,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

const mockInventoryTransactions: InventoryTransaction[] = [
  {
    id: "trans-1",
    inventoryItemId: "inv-1",
    type: "purchase",
    quantity: 50,
    unitCost: 2.5,
    totalCost: 125,
    reason: "Restock semanal",
    userId: "1",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "trans-2",
    inventoryItemId: "inv-2",
    type: "usage",
    quantity: 2,
    reason: "Pedido ORD-001",
    orderId: "ORD-001",
    userId: "2",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

const mockStockAlerts: StockAlert[] = [
  {
    id: "alert-1",
    inventoryItemId: "inv-2",
    type: "low_stock",
    message: "Queso Mozzarella está por debajo del stock mínimo (8 kg < 15 kg)",
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "alert-2",
    inventoryItemId: "inv-3",
    type: "expiring_soon",
    message: "Tomates expiran en 3 días",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
  },
]

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    orderId: "ORD-001",
    invoiceNumber: "FAC-2024-001",
    customerName: "Juan Pérez",
    customerEmail: "juan@email.com",
    customerPhone: "+1234567890",
    items: [
      {
        id: "inv-item-1",
        productId: "1",
        name: "Pizza Margherita",
        quantity: 2,
        unitPrice: 18.5,
        discount: 0,
        total: 37.0,
      },
      {
        id: "inv-item-2",
        productId: "3",
        name: "Coca Cola",
        quantity: 3,
        unitPrice: 3.5,
        discount: 0,
        total: 10.5,
      },
    ],
    subtotal: 47.5,
    taxRate: 0.1,
    taxAmount: 4.75,
    discountAmount: 0,
    total: 52.25,
    paymentMethod: "cash",
    paymentStatus: "paid",
    paidAmount: 52.25,
    changeAmount: 0,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    paidAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    cashierId: "1",
  },
]

const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    invoiceId: "INV-001",
    amount: 52.25,
    method: "cash",
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    cashierId: "1",
  },
]

const mockCashRegisters: CashRegister[] = [
  {
    id: "REG-001",
    cashierId: "1",
    openingAmount: 100.0,
    closingAmount: 152.25,
    totalSales: 52.25,
    totalCash: 52.25,
    totalCard: 0,
    totalTransfer: 0,
    openedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    closedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: "closed",
    transactions: ["PAY-001"],
  },
]

const mockDiscounts: Discount[] = [
  {
    id: "DISC-001",
    name: "Descuento Estudiante",
    type: "percentage",
    value: 10,
    isActive: true,
    validFrom: new Date("2024-01-01"),
    validTo: new Date("2024-12-31"),
    minimumAmount: 20,
    createdAt: new Date("2024-01-01"),
  },
]

const mockProductGroups: ProductGroup[] = [
  {
    id: "1",
    name: "Bebidas",
    description: "Todas las bebidas del restaurante",
    color: "#3B82F6",
    isActive: true,
    subgroups: [
      {
        id: "1",
        name: "Frías",
        description: "Bebidas frías y refrescantes",
        groupId: "1",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Calientes",
        description: "Bebidas calientes",
        groupId: "1",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Gaseosas",
        description: "Bebidas gaseosas",
        groupId: "1",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Comidas",
    description: "Platos principales y acompañamientos",
    color: "#EF4444",
    isActive: true,
    subgroups: [
      {
        id: "4",
        name: "Entradas",
        description: "Aperitivos y entradas",
        groupId: "2",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        name: "Platos Principales",
        description: "Platos principales",
        groupId: "2",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "6",
        name: "Postres",
        description: "Postres y dulces",
        groupId: "2",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const availableCurrencies: CurrencyConfig[] = [
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    exchangeRate: 1,
  },
  {
    code: "COP",
    symbol: "$",
    name: "Peso Colombiano",
    exchangeRate: 4200, // 1 USD = 4200 COP (approximate)
  },
]

const defaultSettings: RestaurantSettings = {
  currency: availableCurrencies[1], // Default to COP
  taxRate: 19, // 19% IVA in Colombia
  serviceCharge: 10,
  restaurantInfo: {
    name: "Mi Restaurante",
    address: "Calle 123 #45-67, Bogotá, Colombia",
    phone: "+57 1 234 5678",
    email: "info@mirestaurante.com",
    website: "www.mirestaurante.com",
  },
  notifications: {
    lowStock: true,
    newOrders: true,
    paymentReceived: true,
  },
}

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [tableAreas, setTableAreas] = useState<TableArea[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [kitchenTickets, setKitchenTickets] = useState<KitchenTicket[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([])
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>(mockProductGroups)
  const [productSubgroups, setProductSubgroups] = useState<ProductSubgroup[]>(
    mockProductGroups.flatMap((group) => group.subgroups),
  )
  const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings)
  const [currentUser] = useState({ id: "1", name: "Admin", role: "admin" })

  useEffect(() => {
    // Load mock data
    setCategories(mockCategories)
    setProducts(mockProducts)
    setTables(mockTables)
    setTableAreas(mockTableAreas)
    setOrders(mockOrders)
    setKitchenTickets(mockKitchenTickets)
    setInventoryItems(mockInventoryItems)
    setRecipes(mockRecipes)
    setInventoryTransactions(mockInventoryTransactions)
    setStockAlerts(mockStockAlerts)
    setInvoices(mockInvoices)
    setPayments(mockPayments)
    setCashRegisters(mockCashRegisters)
    setDiscounts(mockDiscounts)
  }, [])

  const addCategory = (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...categoryData, updatedAt: new Date() } : cat)),
    )
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
    // Also remove products in this category
    setProducts((prev) => prev.filter((prod) => prod.categoryId !== id))
  }

  const addProduct = (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...productData, updatedAt: new Date() } : prod)),
    )
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id))
  }

  const addTable = (tableData: Omit<Table, "id" | "lastUpdated">) => {
    const newTable: Table = {
      ...tableData,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    }
    setTables((prev) => [...prev, newTable])
  }

  const updateTable = (id: string, tableData: Partial<Table>) => {
    setTables((prev) =>
      prev.map((table) => (table.id === id ? { ...table, ...tableData, lastUpdated: new Date() } : table)),
    )
  }

  const deleteTable = (id: string) => {
    setTables((prev) => prev.filter((table) => table.id !== id))
    // Remove table from areas
    setTableAreas((prev) =>
      prev.map((area) => ({
        ...area,
        tables: area.tables.filter((tableId) => tableId !== id),
      })),
    )
  }

  const updateTableStatus = (id: string, status: Table["status"], customerData?: { name?: string; count?: number }) => {
    setTables((prev) =>
      prev.map((table) => {
        if (table.id === id) {
          const updatedTable: Table = {
            ...table,
            status,
            lastUpdated: new Date(),
          }

          if (status === "occupied" && customerData) {
            updatedTable.customerName = customerData.name
            updatedTable.customerCount = customerData.count
          } else if (status === "available") {
            // Clear customer data when table becomes available
            delete updatedTable.customerName
            delete updatedTable.customerCount
            delete updatedTable.currentOrder
            delete updatedTable.reservationTime
          }

          return updatedTable
        }
        return table
      }),
    )
  }

  const addTableArea = (areaData: Omit<TableArea, "id">) => {
    const newArea: TableArea = {
      ...areaData,
      id: Date.now().toString(),
    }
    setTableAreas((prev) => [...prev, newArea])
  }

  const updateTableArea = (id: string, areaData: Partial<TableArea>) => {
    setTableAreas((prev) => prev.map((area) => (area.id === id ? { ...area, ...areaData } : area)))
  }

  const deleteTableArea = (id: string) => {
    setTableAreas((prev) => prev.filter((area) => area.id !== id))
  }

  const createOrder = (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): string => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setOrders((prev) => [...prev, newOrder])

    // Update table status if it's a dine-in order
    if (newOrder.tableId && newOrder.orderType === "dine-in") {
      updateTableStatus(newOrder.tableId, "occupied", {
        name: newOrder.customerName,
        count: newOrder.customerCount,
      })
      updateTable(newOrder.tableId, { currentOrder: newOrder.id })
    }

    // Create kitchen ticket if order has items
    if (newOrder.items.length > 0) {
      const kitchenItems = newOrder.items.filter((item) => {
        const product = products.find((p) => p.id === item.productId)
        return product && product.preparationTime > 1 // Only items that need preparation
      })

      if (kitchenItems.length > 0) {
        const ticket: KitchenTicket = {
          id: `TICKET-${Date.now()}`,
          orderId: newOrder.id,
          tableNumber: newOrder.tableId ? tables.find((t) => t.id === newOrder.tableId)?.number : undefined,
          items: kitchenItems,
          priority: "normal",
          estimatedTime: Math.max(
            ...kitchenItems.map((item) => {
              const product = products.find((p) => p.id === item.productId)
              return product?.preparationTime || 10
            }),
          ),
          createdAt: new Date(),
          status: "pending",
        }
        setKitchenTickets((prev) => [...prev, ticket])
      }
    }

    return newOrder.id
  }

  const updateOrder = (id: string, orderData: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...orderData, updatedAt: new Date() } : order)),
    )
  }

  const deleteOrder = (id: string) => {
    const order = orders.find((o) => o.id === id)
    if (order?.tableId) {
      updateTable(order.tableId, { currentOrder: undefined })
      updateTableStatus(order.tableId, "available")
    }
    setOrders((prev) => prev.filter((order) => order.id !== id))
    setKitchenTickets((prev) => prev.filter((ticket) => ticket.orderId !== id))
  }

  const addOrderItem = (orderId: string, itemData: Omit<OrderItem, "id">) => {
    const newItem: OrderItem = {
      ...itemData,
      id: `item-${Date.now()}`,
    }

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedItems = [...order.items, newItem]
          const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const tax = subtotal * (settings.taxRate / 100)
          const total = subtotal + tax - order.discount

          return {
            ...order,
            items: updatedItems,
            subtotal,
            tax,
            total,
            updatedAt: new Date(),
          }
        }
        return order
      }),
    )
  }

  const updateOrderItem = (orderId: string, itemId: string, itemData: Partial<OrderItem>) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) => (item.id === itemId ? { ...item, ...itemData } : item))
          const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const tax = subtotal * (settings.taxRate / 100)
          const total = subtotal + tax - order.discount

          return {
            ...order,
            items: updatedItems,
            subtotal,
            tax,
            total,
            updatedAt: new Date(),
          }
        }
        return order
      }),
    )
  }

  const removeOrderItem = (orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.filter((item) => item.id !== itemId)
          const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const tax = subtotal * (settings.taxRate / 100)
          const total = subtotal + tax - order.discount

          return {
            ...order,
            items: updatedItems,
            subtotal,
            tax,
            total,
            updatedAt: new Date(),
          }
        }
        return order
      }),
    )
  }

  const updateKitchenTicket = (id: string, ticketData: Partial<KitchenTicket>) => {
    setKitchenTickets((prev) => prev.map((ticket) => (ticket.id === id ? { ...ticket, ...ticketData } : ticket)))
  }

  const addInventoryItem = (itemData: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setInventoryItems((prev) => [...prev, newItem])
  }

  const updateInventoryItem = (id: string, itemData: Partial<InventoryItem>) => {
    setInventoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...itemData, updatedAt: new Date() } : item)),
    )
  }

  const deleteInventoryItem = (id: string) => {
    setInventoryItems((prev) => prev.filter((item) => item.id !== id))
    // Remove related transactions and recipes
    setInventoryTransactions((prev) => prev.filter((trans) => trans.inventoryItemId !== id))
    setRecipes((prev) =>
      prev.map((recipe) => ({
        ...recipe,
        ingredients: recipe.ingredients.filter((ing) => ing.inventoryItemId !== id),
      })),
    )
  }

  const addInventoryTransaction = (transactionData: Omit<InventoryTransaction, "id" | "createdAt">) => {
    const newTransaction: InventoryTransaction = {
      ...transactionData,
      id: `trans-${Date.now()}`,
      createdAt: new Date(),
    }
    setInventoryTransactions((prev) => [...prev, newTransaction])

    // Update inventory stock
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id === transactionData.inventoryItemId) {
          let newStock = item.currentStock

          if (transactionData.type === "purchase" || transactionData.type === "adjustment") {
            newStock += transactionData.quantity
          } else if (transactionData.type === "usage" || transactionData.type === "waste") {
            newStock -= transactionData.quantity
          }

          return {
            ...item,
            currentStock: Math.max(0, newStock),
            lastRestocked: transactionData.type === "purchase" ? new Date() : item.lastRestocked,
            updatedAt: new Date(),
          }
        }
        return item
      }),
    )

    // Check stock levels after transaction
    setTimeout(checkStockLevels, 100)
  }

  const addRecipe = (recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => {
    // Calculate total cost
    const totalCost = recipeData.ingredients.reduce((sum, ingredient) => {
      const inventoryItem = inventoryItems.find((item) => item.id === ingredient.inventoryItemId)
      return sum + (inventoryItem ? inventoryItem.unitCost * ingredient.quantity : 0)
    }, 0)

    const newRecipe: Recipe = {
      ...recipeData,
      id: `recipe-${Date.now()}`,
      totalCost,
      costPerServing: totalCost / recipeData.servings,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setRecipes((prev) => [...prev, newRecipe])
  }

  const updateRecipe = (id: string, recipeData: Partial<Recipe>) => {
    setRecipes((prev) =>
      prev.map((recipe) => {
        if (recipe.id === id) {
          const updatedRecipe = { ...recipe, ...recipeData, updatedAt: new Date() }

          // Recalculate cost if ingredients changed
          if (recipeData.ingredients) {
            const totalCost = updatedRecipe.ingredients.reduce((sum, ingredient) => {
              const inventoryItem = inventoryItems.find((item) => item.id === ingredient.inventoryItemId)
              return sum + (inventoryItem ? inventoryItem.unitCost * ingredient.quantity : 0)
            }, 0)
            updatedRecipe.totalCost = totalCost
            updatedRecipe.costPerServing = totalCost / updatedRecipe.servings
          }

          return updatedRecipe
        }
        return recipe
      }),
    )
  }

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
  }

  const markAlertAsRead = (id: string) => {
    setStockAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert)))
  }

  const checkStockLevels = () => {
    const newAlerts: StockAlert[] = []
    const now = new Date()

    inventoryItems.forEach((item) => {
      // Check low stock
      if (item.currentStock <= item.minStock) {
        const existingAlert = stockAlerts.find(
          (alert) => alert.inventoryItemId === item.id && alert.type === "low_stock" && !alert.isRead,
        )

        if (!existingAlert) {
          newAlerts.push({
            id: `alert-${Date.now()}-${item.id}`,
            inventoryItemId: item.id,
            type: item.currentStock === 0 ? "out_of_stock" : "low_stock",
            message:
              item.currentStock === 0
                ? `${item.name} está agotado`
                : `${item.name} está por debajo del stock mínimo (${item.currentStock} ${item.unit} < ${item.minStock} ${item.unit})`,
            isRead: false,
            createdAt: now,
          })
        }
      }

      // Check expiration
      if (item.expirationDate) {
        const daysUntilExpiration = Math.ceil((item.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiration <= 0) {
          const existingAlert = stockAlerts.find(
            (alert) => alert.inventoryItemId === item.id && alert.type === "expired" && !alert.isRead,
          )

          if (!existingAlert) {
            newAlerts.push({
              id: `alert-${Date.now()}-exp-${item.id}`,
              inventoryItemId: item.id,
              type: "expired",
              message: `${item.name} ha expirado`,
              isRead: false,
              createdAt: now,
            })
          }
        } else if (daysUntilExpiration <= 3) {
          const existingAlert = stockAlerts.find(
            (alert) => alert.inventoryItemId === item.id && alert.type === "expiring_soon" && !alert.isRead,
          )

          if (!existingAlert) {
            newAlerts.push({
              id: `alert-${Date.now()}-exp-${item.id}`,
              inventoryItemId: item.id,
              type: "expiring_soon",
              message: `${item.name} expira en ${daysUntilExpiration} días`,
              isRead: false,
              createdAt: now,
            })
          }
        }
      }
    })

    if (newAlerts.length > 0) {
      setStockAlerts((prev) => [...prev, ...newAlerts])
    }
  }

  const createInvoice = (orderId: string, customerData?: Partial<Invoice>): string => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return ""

    const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`

    const invoiceItems = order.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return {
        id: `inv-item-${Date.now()}-${item.id}`,
        productId: item.productId,
        name: product?.name || "Producto",
        quantity: item.quantity,
        unitPrice: item.price,
        discount: 0,
        total: item.price * item.quantity,
      }
    })

    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      orderId,
      invoiceNumber,
      customerName: customerData?.customerName || order.customerName,
      customerEmail: customerData?.customerEmail,
      customerPhone: customerData?.customerPhone,
      customerAddress: customerData?.customerAddress,
      items: invoiceItems,
      subtotal: order.subtotal,
      taxRate: settings.taxRate / 100,
      taxAmount: order.tax,
      discountAmount: order.discount,
      total: order.total,
      paymentMethod: "cash",
      paymentStatus: "pending",
      paidAmount: 0,
      changeAmount: 0,
      notes: customerData?.notes,
      createdAt: new Date(),
      dueDate: customerData?.dueDate,
      cashierId: currentUser?.id || "1",
    }

    setInvoices((prev) => [...prev, newInvoice])
    return newInvoice.id
  }

  const processPayment = (invoiceId: string, paymentData: Omit<Payment, "id" | "createdAt">) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `PAY-${Date.now()}`,
      createdAt: new Date(),
    }

    setPayments((prev) => [...prev, newPayment])

    // Update invoice payment status
    setInvoices((prev) =>
      prev.map((invoice) => {
        if (invoice.id === invoiceId) {
          const newPaidAmount = invoice.paidAmount + paymentData.amount
          const paymentStatus: Invoice["paymentStatus"] =
            newPaidAmount >= invoice.total ? "paid" : newPaidAmount > 0 ? "partial" : "pending"

          return {
            ...invoice,
            paidAmount: newPaidAmount,
            paymentStatus,
            paidAt: paymentStatus === "paid" ? new Date() : invoice.paidAt,
            changeAmount: newPaidAmount > invoice.total ? newPaidAmount - invoice.total : 0,
          }
        }
        return invoice
      }),
    )

    // Update order status if fully paid
    const invoice = invoices.find((inv) => inv.id === invoiceId)
    if (invoice) {
      const newPaidAmount = invoice.paidAmount + paymentData.amount
      if (newPaidAmount >= invoice.total) {
        updateOrder(invoice.orderId, { status: "paid" })
        // Free up table if it's a dine-in order
        const order = orders.find((o) => o.id === invoice.orderId)
        if (order?.tableId && order.orderType === "dine-in") {
          updateTableStatus(order.tableId, "available")
        }
      }
    }
  }

  const openCashRegister = (cashierId: string, openingAmount: number) => {
    const newRegister: CashRegister = {
      id: `REG-${Date.now()}`,
      cashierId,
      openingAmount,
      totalSales: 0,
      totalCash: 0,
      totalCard: 0,
      totalTransfer: 0,
      openedAt: new Date(),
      status: "open" as const,
      transactions: [],
    }

    setCashRegisters((prev) => [...prev, newRegister])
  }

  const closeCashRegister = (registerId: string, closingAmount: number) => {
    setCashRegisters((prev) =>
      prev.map((register) =>
        register.id === registerId
          ? {
              ...register,
              closingAmount,
              closedAt: new Date(),
              status: "closed" as const,
            }
          : register,
      ),
    )
  }

  const addDiscount = (discountData: Omit<Discount, "id" | "createdAt">) => {
    const newDiscount: Discount = {
      ...discountData,
      id: `DISC-${Date.now()}`,
      createdAt: new Date(),
    }
    setDiscounts((prev) => [...prev, newDiscount])
  }

  const updateDiscount = (id: string, discountData: Partial<Discount>) => {
    setDiscounts((prev) => prev.map((discount) => (discount.id === id ? { ...discount, ...discountData } : discount)))
  }

  const deleteDiscount = (id: string) => {
    setDiscounts((prev) => prev.filter((discount) => discount.id !== id))
  }

  const addProductGroup = (group: Omit<ProductGroup, "id" | "createdAt" | "updatedAt">) => {
    const newGroup: ProductGroup = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setProductGroups((prev) => [...prev, newGroup])
  }

  const updateProductGroup = (id: string, group: Partial<ProductGroup>) => {
    setProductGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...group, updatedAt: new Date() } : g)))
  }

  const deleteProductGroup = (id: string) => {
    setProductGroups((prev) => prev.filter((g) => g.id !== id))
    // Also remove subgroups of this group
    setProductSubgroups((prev) => prev.filter((sg) => sg.groupId !== id))
  }

  const addProductSubgroup = (subgroup: Omit<ProductSubgroup, "id" | "createdAt" | "updatedAt">) => {
    const newSubgroup: ProductSubgroup = {
      ...subgroup,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setProductSubgroups((prev) => [...prev, newSubgroup])
  }

  const updateProductSubgroup = (id: string, subgroup: Partial<ProductSubgroup>) => {
    setProductSubgroups((prev) => prev.map((sg) => (sg.id === id ? { ...sg, ...subgroup, updatedAt: new Date() } : sg)))
  }

  const deleteProductSubgroup = (id: string) => {
    setProductSubgroups((prev) => prev.filter((sg) => sg.id !== id))
  }

  const setCurrency = (currency: CurrencyConfig) => {
    setSettings((prev) => ({
      ...prev,
      currency,
    }))
  }

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price)
    return `${settings.currency.symbol}${convertedPrice.toLocaleString("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`
  }

  const convertPrice = (price: number, fromCurrency = "USD"): number => {
    if (fromCurrency === settings.currency.code) return price
    if (fromCurrency === "USD" && settings.currency.code === "COP") {
      return price * settings.currency.exchangeRate
    }
    if (fromCurrency === "COP" && settings.currency.code === "USD") {
      return price / availableCurrencies[1].exchangeRate
    }
    return price
  }

  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }))
  }

  return (
    <RestaurantContext.Provider
      value={{
        categories,
        products,
        tables,
        tableAreas,
        orders,
        kitchenTickets,
        inventoryItems,
        recipes,
        inventoryTransactions,
        stockAlerts,
        invoices,
        payments,
        cashRegisters,
        discounts,
        productGroups,
        productSubgroups,
        settings,
        updateSettings,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        addTable,
        updateTable,
        deleteTable,
        updateTableStatus,
        addTableArea,
        updateTableArea,
        deleteTableArea,
        createOrder,
        updateOrder,
        deleteOrder,
        addOrderItem,
        updateOrderItem,
        removeOrderItem,
        updateKitchenTicket,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addInventoryTransaction,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        markAlertAsRead,
        checkStockLevels,
        createInvoice,
        processPayment,
        openCashRegister,
        closeCashRegister,
        addDiscount,
        updateDiscount,
        deleteDiscount,
        addProductGroup,
        updateProductGroup,
        deleteProductGroup,
        addProductSubgroup,
        updateProductSubgroup,
        deleteProductSubgroup,
        setCurrency,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider")
  }
  return context
}

interface RestaurantContextType {
  categories: Category[]
  products: Product[]
  tables: Table[]
  tableAreas: TableArea[]
  orders: Order[]
  kitchenTickets: KitchenTicket[]
  inventoryItems: InventoryItem[]
  recipes: Recipe[]
  inventoryTransactions: InventoryTransaction[]
  stockAlerts: StockAlert[]
  invoices: Invoice[]
  payments: Payment[]
  cashRegisters: CashRegister[]
  discounts: Discount[]
  productGroups: ProductGroup[]
  productSubgroups: ProductSubgroup[]
  settings: RestaurantSettings
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void
  addCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addTable: (table: Omit<Table, "id" | "lastUpdated">) => void
  updateTable: (id: string, table: Partial<Table>) => void
  deleteTable: (id: string) => void
  updateTableStatus: (id: string, status: Table["status"], customerData?: { name?: string; count?: number }) => void
  addTableArea: (area: Omit<TableArea, "id">) => void
  updateTableArea: (id: string, area: Partial<TableArea>) => void
  deleteTableArea: (id: string) => void
  createOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => string
  updateOrder: (id: string, order: Partial<Order>) => void
  deleteOrder: (id: string) => void
  addOrderItem: (orderId: string, item: Omit<OrderItem, "id">) => void
  updateOrderItem: (orderId: string, itemId: string, item: Partial<OrderItem>) => void
  removeOrderItem: (orderId: string, itemId: string) => void
  updateKitchenTicket: (id: string, ticket: Partial<KitchenTicket>) => void
  addInventoryItem: (item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => void
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void
  deleteInventoryItem: (id: string) => void
  addInventoryTransaction: (transaction: Omit<InventoryTransaction, "id" | "createdAt">) => void
  addRecipe: (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => void
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void
  deleteRecipe: (id: string) => void
  markAlertAsRead: (id: string) => void
  checkStockLevels: () => void
  createInvoice: (orderId: string, customerData?: Partial<Invoice>) => string
  processPayment: (invoiceId: string, paymentData: Omit<Payment, "id" | "createdAt">) => void
  openCashRegister: (cashierId: string, openingAmount: number) => void
  closeCashRegister: (registerId: string, closingAmount: number) => void
  addDiscount: (discount: Omit<Discount, "id" | "createdAt">) => void
  updateDiscount: (id: string, discount: Partial<Discount>) => void
  deleteDiscount: (id: string) => void
  addProductGroup: (group: Omit<ProductGroup, "id" | "createdAt" | "updatedAt">) => void
  updateProductGroup: (id: string, group: Partial<ProductGroup>) => void
  deleteProductGroup: (id: string) => void
  addProductSubgroup: (subgroup: Omit<ProductSubgroup, "id" | "createdAt" | "updatedAt">) => void
  updateProductSubgroup: (id: string, subgroup: Partial<ProductSubgroup>) => void
  deleteProductSubgroup: (id: string) => void
  setCurrency: (currency: CurrencyConfig) => void
  formatPrice: (price: number) => string
  convertPrice: (price: number, fromCurrency?: string) => number
}
