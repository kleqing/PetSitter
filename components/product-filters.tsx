"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { ProductFilters } from "@/types/product"
import { categories, brands, tags } from "@/data/products"

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  totalResults: number
}

export function ProductFiltersComponent({ filters, onFiltersChange, totalResults }: ProductFiltersProps) {
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...filters.categories, category] : filters.categories.filter((c) => c !== category)
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...filters.brands, brand] : filters.brands.filter((b) => b !== brand)
    onFiltersChange({ ...filters, brands: newBrands })
  }

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked ? [...filters.tags, tag] : filters.tags.filter((t) => t !== tag)
    onFiltersChange({ ...filters, tags: newTags })
  }

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]]
    onFiltersChange({ ...filters, priceRange: newRange })
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {totalResults > 12 ? "12-12" : `1-${totalResults}`} of {totalResults} results
      </div>

      {/* Filter by Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <label htmlFor={category} className="text-sm font-medium cursor-pointer">
                  {category}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {category === "Food" ? "20" : category === "Bowls" ? "15" : category === "Toys" ? "12" : "8"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Filter by Price */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by Price</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={200}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>
              Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Filter by Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                />
                <label htmlFor={brand} className="text-sm font-medium cursor-pointer">
                  {brand}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {brand === "Natural food" ? "15" : brand === "Pet care" ? "12" : "8"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Filter by Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagChange(tag, !filters.tags.includes(tag))}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Premium Dog Food", price: "$29.99", image: "/premium-dog-food-small.png" },
            { name: "Premium Cat Food", price: "$20.99", image: "/premium-cat-food-small.png" },
            { name: "Cat Bed", price: "$49.99", image: "/cat-bed-small.png" },
            { name: "Dog Leash", price: "$9.99", image: "/dog-leash-small.png" },
            { name: "Cat Bowl", price: "$19.99", image: "/cat-bowl-small.png" },
          ].map((product, index) => (
            <div key={index} className="flex items-center space-x-3">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.price}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
