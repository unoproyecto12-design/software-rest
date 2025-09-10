"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Store, CreditCard, Bell, Database, Download, AlertCircle, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RestaurantConfig {
  name: string
  address: string
  phone: string
  email: string
  taxId: string
  currency: string
  taxRate: number
  serviceCharge: number
  logo?: string
  theme: string
  language: string
  timezone: string
  notifications: {
    lowStock: boolean
    newOrders: boolean
    paymentReceived: boolean
  }
  integrations: {
    pos: boolean
    accounting: boolean
    delivery: boolean
  }
}

export function RestaurantSettings() {
  const { toast } = useToast()
  const [config, setConfig] = useState<RestaurantConfig>({
    name: "Mi Restaurante",
    address: "Calle Principal 123, Ciudad",
    phone: "+1 234 567 8900",
    email: "contacto@mirestaurante.com",
    taxId: "12345678-9",
    currency: "USD",
    taxRate: 18,
    serviceCharge: 10,
    theme: "orange",
    language: "es",
    timezone: "America/Lima",
    notifications: {
      lowStock: true,
      newOrders: true,
      paymentReceived: false,
    },
    integrations: {
      pos: false,
      accounting: false,
      delivery: false,
    },
  })

  const handleSave = () => {
    // Aquí se guardaría en la base de datos
    localStorage.setItem("restaurant-config", JSON.stringify(config))
    toast({
      title: "Configuración guardada",
      description: "Los cambios se han guardado correctamente.",
    })
  }

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "restaurant-config.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado",
      description: "Texto copiado al portapapeles",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-gray-600">Administra la configuración de tu restaurante</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportConfig}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Store className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Facturación
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Base de Datos
          </TabsTrigger>
          <TabsTrigger value="connection">
            <AlertCircle className="h-4 w-4 mr-2" />
            Conexión
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Información del Restaurante</CardTitle>
              <CardDescription>Configura la información básica de tu restaurante</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Restaurante</Label>
                  <Input
                    id="name"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={config.phone}
                    onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={config.email}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">RUC/NIT</Label>
                  <Input
                    id="taxId"
                    value={config.taxId}
                    onChange={(e) => setConfig({ ...config, taxId: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  value={config.address}
                  onChange={(e) => setConfig({ ...config, address: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Facturación</CardTitle>
              <CardDescription>Configura impuestos, moneda y cargos por servicio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Input
                    id="currency"
                    value={config.currency}
                    onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tasa de Impuesto (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={config.taxRate}
                    onChange={(e) => setConfig({ ...config, taxRate: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceCharge">Cargo por Servicio (%)</Label>
                  <Input
                    id="serviceCharge"
                    type="number"
                    value={config.serviceCharge}
                    onChange={(e) => setConfig({ ...config, serviceCharge: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Configura qué notificaciones deseas recibir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stock Bajo</Label>
                  <p className="text-sm text-gray-600">Recibir alertas cuando el inventario esté bajo</p>
                </div>
                <Switch
                  checked={config.notifications.lowStock}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      notifications: { ...config.notifications, lowStock: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nuevas Órdenes</Label>
                  <p className="text-sm text-gray-600">Notificar cuando lleguen nuevas órdenes</p>
                </div>
                <Switch
                  checked={config.notifications.newOrders}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      notifications: { ...config.notifications, newOrders: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pagos Recibidos</Label>
                  <p className="text-sm text-gray-600">Confirmar cuando se reciban pagos</p>
                </div>
                <Switch
                  checked={config.notifications.paymentReceived}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      notifications: { ...config.notifications, paymentReceived: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado de la Base de Datos</CardTitle>
                <CardDescription>Información sobre la conexión y estructura de la base de datos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Estado de Conexión</span>
                    <Badge variant="secondary">Sin Configurar</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tablas Creadas</span>
                    <Badge variant="secondary">0/8</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Última Sincronización</span>
                    <span className="text-sm text-gray-600">Nunca</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scripts de Base de Datos</CardTitle>
                <CardDescription>Scripts SQL disponibles para configurar la base de datos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">01_create_tables.sql</p>
                      <p className="text-sm text-gray-600">Crea todas las tablas principales</p>
                    </div>
                    <Badge variant="outline">Disponible</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">02_seed_data.sql</p>
                      <p className="text-sm text-gray-600">Datos de ejemplo para pruebas</p>
                    </div>
                    <Badge variant="outline">Disponible</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="connection">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Guía de Conexión a Base de Datos MySQL (XAMPP)
                </CardTitle>
                <CardDescription>
                  Sigue estos pasos para conectar el sistema a tu base de datos MySQL local
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Paso 1 */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Paso 1: Configurar XAMPP</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Asegúrate de que Apache y MySQL estén ejecutándose en XAMPP</p>
                    <p>
                      • Abre phpMyAdmin en:{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded">http://localhost/phpmyadmin</code>
                    </p>
                    <p>
                      • Crea una nueva base de datos llamada:{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded">restaurant_management</code>
                    </p>
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Paso 2: Ejecutar Scripts SQL</h3>
                  <div className="space-y-3">
                    <p className="text-sm">Ejecuta estos scripts en phpMyAdmin en el siguiente orden:</p>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">1. scripts/01_create_tables.sql</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard("scripts/01_create_tables.sql")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600">Crea todas las tablas necesarias</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">2. scripts/02_seed_data.sql</span>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard("scripts/02_seed_data.sql")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600">Inserta datos de ejemplo</p>
                    </div>
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Paso 3: Configurar Variables de Entorno</h3>
                  <div className="space-y-3">
                    <p className="text-sm">
                      Crea un archivo <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> en la raíz del
                      proyecto:
                    </p>

                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span>Configuración de Base de Datos:</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(`DATABASE_URL="mysql://root:@localhost:3306/restaurant_management"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD=""
DB_NAME="restaurant_management"`)
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <div>DATABASE_URL="mysql://root:@localhost:3306/restaurant_management"</div>
                        <div>DB_HOST="localhost"</div>
                        <div>DB_PORT="3306"</div>
                        <div>DB_USER="root"</div>
                        <div>DB_PASSWORD=""</div>
                        <div>DB_NAME="restaurant_management"</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paso 4 */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Paso 4: Instalar Dependencias</h3>
                  <div className="space-y-3">
                    <p className="text-sm">Instala las dependencias necesarias para MySQL:</p>

                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span>Comandos a ejecutar:</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard("npm install mysql2 @types/mysql2")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>npm install mysql2 @types/mysql2</div>
                    </div>
                  </div>
                </div>

                {/* Paso 5 */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Paso 5: Actualizar el Código</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Reemplazar React Context con llamadas a la base de datos</p>
                    <p>
                      • Crear funciones de conexión MySQL en{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded">lib/database.ts</code>
                    </p>
                    <p>• Actualizar todos los componentes para usar APIs en lugar de estado local</p>
                    <p>
                      • Crear rutas API en <code className="bg-gray-100 px-2 py-1 rounded">app/api/</code> para cada
                      módulo
                    </p>
                  </div>
                </div>

                {/* Estado de Conexión */}
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-yellow-800 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Estado Actual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Sistema:</span>
                        <Badge variant="secondary">Funcionando con datos simulados</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Base de Datos:</span>
                        <Badge variant="destructive">No conectada</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Persistencia:</span>
                        <Badge variant="outline">Solo en memoria del navegador</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Botón de Ayuda */}
                <div className="text-center">
                  <Button variant="outline" className="w-full bg-transparent">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    ¿Necesitas ayuda con la conexión? Contacta soporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
