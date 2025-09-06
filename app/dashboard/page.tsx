"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Package, DollarSign, ShoppingBag, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { products } from "@/data/products"
import type { Product } from "@/types/product"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    description: "",
    image: "",
    tags: [] as string[],
  })

  // Redirect if not a shop owner
  if (!user || user.role !== "shop") {
    router.push("/")
    return null
  }

  // Mock shop products (in real app, this would be filtered by shop owner)
  const shopProducts = products.slice(0, 6)
  const totalProducts = shopProducts.length
  const totalRevenue = shopProducts.reduce((sum, product) => sum + product.price, 0)
  const totalOrders = 24 // Mock data

  const handleAddProduct = () => {
    // In real app, this would make an API call
    console.log("Adding product:", newProduct)
    setNewProduct({
      name: "",
      price: "",
      category: "",
      brand: "",
      description: "",
      image: "",
      tags: [],
    })
    setIsAddProductOpen(false)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      description: product.description || "",
      image: product.image,
      tags: product.tags,
    })
  }

  const handleUpdateProduct = () => {
    // In real app, this would make an API call
    console.log("Updating product:", editingProduct?.id, newProduct)
    setEditingProduct(null)
    setNewProduct({
      name: "",
      price: "",
      category: "",
      brand: "",
      description: "",
      image: "",
      tags: [],
    })
  }

  const handleDeleteProduct = (productId: string) => {
    // In real app, this would make an API call
    console.log("Deleting product:", productId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}! Manage your products and track your sales.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Shop Profile</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Products</h2>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Furniture">Furniture</SelectItem>
                            <SelectItem value="Bowls">Bowls</SelectItem>
                            <SelectItem value="Clothing">Clothing</SelectItem>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Toys">Toys</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                          placeholder="Enter brand name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="image">Product Image URL</Label>
                      <Input
                        id="image"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Enter product description"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        {editingProduct ? "Update Product" : "Add Product"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddProductOpen(false)
                          setEditingProduct(null)
                          setNewProduct({
                            name: "",
                            price: "",
                            category: "",
                            brand: "",
                            description: "",
                            image: "",
                            tags: [],
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-orange-500 mb-2">${product.price}</p>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="secondary">{product.category}</Badge>
                      <Badge variant="outline">{product.brand}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/shop/edit/${product.id}`)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet. Your orders will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Sales Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Analytics dashboard coming soon. Track your sales performance here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shop Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Shop Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input id="shopName" defaultValue={`${user.name}'s Pet Store`} />
                </div>
                <div>
                  <Label htmlFor="shopDescription">Shop Description</Label>
                  <Textarea
                    id="shopDescription"
                    placeholder="Tell customers about your shop..."
                    rows={4}
                    defaultValue="Welcome to our pet store! We offer high-quality products for your furry friends."
                  />
                </div>
                <div>
                  <Label htmlFor="shopLocation">Location</Label>
                  <Input id="shopLocation" placeholder="Enter your shop location" />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" defaultValue={user.email} />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600">Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
