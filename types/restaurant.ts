export interface Category {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  groupId?: string
  subgroupId?: string
  imageUrl?: string
  isActive: boolean
  preparationTime: number // in minutes
  ingredients: string[]
  allergens: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Table {
  id: string
  number: number
  capacity: number
  status: "available" | "occupied" | "reserved" | "cleaning"
  currentOrder?: string // order ID
  customerName?: string
  customerCount?: number
  reservationTime?: Date
  lastUpdated: Date
  position: {
    x: number
    y: number
  }
  shape: "round" | "square" | "rectangle"
}

export interface TableArea {
  id: string
  name: string
  color: string
  tables: string[] // table IDs
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  notes?: string
  status: "pending" | "preparing" | "ready" | "served"
}

export interface Order {
  id: string
  tableId?: string
  customerName?: string
  customerCount?: number
  items: OrderItem[]
  status: "draft" | "confirmed" | "preparing" | "ready" | "served" | "paid" | "cancelled"
  orderType: "dine-in" | "takeaway" | "delivery"
  subtotal: number
  tax: number
  discount: number
  total: number
  notes?: string
  createdAt: Date
  updatedAt: Date
  servedAt?: Date
  waiterId?: string
  estimatedTime?: number // in minutes
}

export interface KitchenTicket {
  id: string
  orderId: string
  tableNumber?: number
  items: OrderItem[]
  priority: "low" | "normal" | "high"
  estimatedTime: number
  createdAt: Date
  status: "pending" | "preparing" | "ready"
}

export interface InventoryItem {
  id: string
  name: string
  description?: string
  unit: string // kg, liters, pieces, etc.
  currentStock: number
  minStock: number
  maxStock: number
  unitCost: number
  supplier?: string
  category: "ingredients" | "beverages" | "supplies" | "cleaning"
  groupId?: string
  subgroupId?: string
  expirationDate?: Date
  lastRestocked: Date
  createdAt: Date
  updatedAt: Date
}

export interface Recipe {
  id: string
  productId: string
  name: string
  description?: string
  servings: number
  prepTime: number // in minutes
  cookTime: number // in minutes
  difficulty: "easy" | "medium" | "hard"
  instructions: string[]
  ingredients: RecipeIngredient[]
  totalCost: number
  costPerServing: number
  createdAt: Date
  updatedAt: Date
}

export interface RecipeIngredient {
  id: string
  inventoryItemId: string
  quantity: number
  unit: string
  notes?: string
}

export interface InventoryTransaction {
  id: string
  inventoryItemId: string
  type: "purchase" | "usage" | "waste" | "adjustment"
  quantity: number
  unitCost?: number
  totalCost?: number
  reason?: string
  orderId?: string // if related to an order
  userId: string
  createdAt: Date
}

export interface StockAlert {
  id: string
  inventoryItemId: string
  type: "low_stock" | "out_of_stock" | "expiring_soon" | "expired"
  message: string
  isRead: boolean
  createdAt: Date
}

export interface Invoice {
  id: string
  orderId: string
  invoiceNumber: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  total: number
  paymentMethod: "cash" | "card" | "transfer" | "mixed"
  paymentStatus: "pending" | "paid" | "partial" | "refunded"
  paidAmount: number
  changeAmount: number
  notes?: string
  createdAt: Date
  paidAt?: Date
  dueDate?: Date
  cashierId: string
}

export interface InvoiceItem {
  id: string
  productId: string
  name: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  method: "cash" | "card" | "transfer"
  reference?: string
  createdAt: Date
  cashierId: string
}

export interface CashRegister {
  id: string
  cashierId: string
  openingAmount: number
  closingAmount?: number
  totalSales: number
  totalCash: number
  totalCard: number
  totalTransfer: number
  openedAt: Date
  closedAt?: Date
  status: "open" | "closed"
  transactions: string[] // payment IDs
}

export interface Discount {
  id: string
  name: string
  type: "percentage" | "fixed"
  value: number
  isActive: boolean
  validFrom: Date
  validTo: Date
  applicableProducts?: string[] // product IDs, empty means all products
  minimumAmount?: number
  createdAt: Date
}

export interface ProductGroup {
  id: string
  name: string
  description?: string
  color: string
  isActive: boolean
  subgroups: ProductSubgroup[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductSubgroup {
  id: string
  name: string
  description?: string
  groupId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CurrencyConfig {
  code: "USD" | "COP"
  symbol: string
  name: string
  exchangeRate: number // rate to USD
}

export interface RestaurantSettings {
  currency: CurrencyConfig
  taxRate: number
  serviceCharge: number
  restaurantInfo: {
    name: string
    address: string
    phone: string
    email: string
    website?: string
  }
  notifications: {
    lowStock: boolean
    newOrders: boolean
    paymentReceived: boolean
  }
}

export interface RestaurantContextType {
  // Categories
  categories: Category[]
  addCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void

  // Products
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Product Groups
  productGroups: ProductGroup[]
  addProductGroup: (group: Omit<ProductGroup, "id" | "createdAt" | "updatedAt" | "subgroups">) => void
  updateProductGroup: (id: string, group: Partial<ProductGroup>) => void
  deleteProductGroup: (id: string) => void

  // Product Subgroups
  productSubgroups: ProductSubgroup[]
  addProductSubgroup: (subgroup: Omit<ProductSubgroup, "id" | "createdAt" | "updatedAt">) => void
  updateProductSubgroup: (id: string, subgroup: Partial<ProductSubgroup>) => void
  deleteProductSubgroup: (id: string) => void

  // Tables
  tables: Table[]
  addTable: (table: Omit<Table, "id" | "lastUpdated">) => void
  updateTable: (id: string, table: Partial<Table>) => void
  deleteTable: (id: string) => void
  updateTableStatus: (id: string, status: Table["status"], customerInfo?: { name?: string; count?: number }) => void

  // Orders
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void
  updateOrder: (id: string, order: Partial<Order>) => void
  deleteOrder: (id: string) => void

  // Inventory
  inventoryItems: InventoryItem[]
  addInventoryItem: (item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => void
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void
  deleteInventoryItem: (id: string) => void

  // Inventory Transactions
  inventoryTransactions: InventoryTransaction[]
  addInventoryTransaction: (transaction: Omit<InventoryTransaction, "id" | "createdAt">) => void

  // Stock Alerts
  stockAlerts: StockAlert[]
  markAlertAsRead: (id: string) => void

  // Invoices
  invoices: Invoice[]
  addInvoice: (invoice: Omit<Invoice, "id" | "createdAt">) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void

  // Payments
  payments: Payment[]
  addPayment: (payment: Omit<Payment, "id" | "createdAt">) => void

  // Cash Register
  cashRegisters: CashRegister[]
  openCashRegister: (cashierId: string, openingAmount: number) => void
  closeCashRegister: (id: string, closingAmount: number) => void

  // Discounts
  discounts: Discount[]
  addDiscount: (discount: Omit<Discount, "id" | "createdAt">) => void
  updateDiscount: (id: string, discount: Partial<Discount>) => void
  deleteDiscount: (id: string) => void

  // Settings
  settings: RestaurantSettings
  updateSettings: (settings: Partial<RestaurantSettings>) => void
}
