"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRestaurant } from "@/contexts/restaurant-context"
import type { Product } from "@/types/restaurant"
import { ArrowLeft, Save, Plus, X } from "lucide-react"

interface ProductFormProps {
  product?: Product | null
  onClose: () => void
}

const commonAllergens = [
  "Gluten",
  "Lácteos",
  "Huevo",
  "Frutos secos",
  "Cacahuetes",
  "Soja",
  "Pescado",
  "Mariscos",
  "Apio",
  "Mostaza",
  "Sésamo",
  "Sulfitos",
]

export function ProductForm({ product, onClose }: ProductFormProps) {
  const { categories, addProduct, updateProduct } = useRestaurant()
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    categoryId: product?.categoryId || "",
    preparationTime: product?.preparationTime || 10,
    isActive: product?.isActive ?? true,
    ingredients: product?.ingredients || [],
    allergens: product?.allergens || [],
  })
  const [newIngredient, setNewIngredient] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (product) {
      updateProduct(product.id, formData)
    } else {
      addProduct(formData)
    }

    onClose()
  }

  const addIngredient = () => {
    if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()],
      }))
      setNewIngredient("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i !== ingredient),
    }))
  }

  const toggleAllergen = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{product ? "Editar Producto" : "Nuevo Producto"}</h2>
          <p className="text-gray-600">
            {product ? "Modifica los datos del producto" : "Crea un nuevo producto para el menú"}
          </p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
          <CardDescription>Completa los datos para {product ? "actualizar" : "crear"} el producto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Pizza Margherita"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preparationTime">Tiempo de preparación (minutos)</Label>
                <Input
                  id="preparationTime"
                  type="number"
                  min="1"
                  value={formData.preparationTime}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, preparationTime: Number.parseInt(e.target.value) || 10 }))
                  }
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe el producto, sus características principales..."
                rows={3}
              />
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <Label>Ingredientes</Label>
              <div className="flex space-x-2">
                <Input
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Agregar ingrediente"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
                />
                <Button type="button" onClick={addIngredient} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary" className="flex items-center space-x-1">
                    <span>{ingredient}</span>
                    <button
                      type="button"
                      onClick={() => removeIngredient(ingredient)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-4">
              <Label>Alérgenos</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {commonAllergens.map((allergen) => (
                  <label key={allergen} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allergens.includes(allergen)}
                      onChange={() => toggleAllergen(allergen)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{allergen}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Producto disponible</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                <Save className="mr-2 h-4 w-4" />
                {product ? "Actualizar" : "Crear"} Producto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
