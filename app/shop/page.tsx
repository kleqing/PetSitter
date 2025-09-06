"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFiltersComponent } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { ProductFilters } from "@/types/product"
import { products } from "@/data/products"

export default function ShopPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    categories: [],
    priceRange: [0, 200],
    brands: [],
    tags: [],
    sortBy: "latest",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some((tag) => product.tags.includes(tag))) {
        return false
      }

      return true
    })

    // Sort products
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        // latest - keep original order
        break
    }

    return filtered
  }, [filters, searchQuery])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-100 to-orange-200 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full opacity-60"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-orange-300 rounded-full opacity-40"></div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-orange-500 rounded-full opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium inline-block">
                Pet Shop
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Pet Essentials - Everything Your Pet Needs
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                From nutritious food to fun toys and everyday care items — we bring you a curated selection of
                high-quality pet products your furry friend will love.
              </p>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
              </div>
            </div>
            <div className="relative">
              <img src="/happy-pets.png" alt="Happy pets" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProductFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                totalResults={filteredProducts.length}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Sort and Results */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)}-
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                </p>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: any) => setFilters({ ...filters, sortBy: value })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by latest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Sort by latest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-orange-500 hover:bg-orange-600" : ""}
                      >
                        {page}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button variant="outline" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
