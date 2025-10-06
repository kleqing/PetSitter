"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { Product, ProductFilters } from "@/types/product"
import {
  getProductCategories,
  getProductBrands,
  getProductTags,
} from "@/components/api/filter"
import { useEffect, useState } from "react"

interface Category {
  categoryId: string
  categoryName: string
  products: any[]
}
interface Brand {
  brandId: string
  brandName: string
}
interface Tag {
  productTagId: string
  productTagName: string
}

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: React.Dispatch<React.SetStateAction<ProductFilters>>
  products: Product[]
}

export default function ProductFiltersComponent({
  filters,
  onFiltersChange,
  products,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    Promise.all([getProductCategories(), getProductBrands(), getProductTags()])
        .then(([cats, brs, tgs]) => {
            setCategories(cats);
            setBrands(brs);
            setTags(tgs);
        })
        .catch((err) => {
            console.error("Failed to load filters", err);
        });
}, []);
  
  // init max price
  useEffect(() => {
    if (products.length > 0 && filters.priceRange[1] === 0) {
      const maxPrice = Math.max(...products.map((p) => p.price))
      onFiltersChange((prev) => ({
        ...prev,
        priceRange: [0, maxPrice],
      }))
    }
  }, [products, filters.priceRange, onFiltersChange])

  const handleCategoryChange = (id: string, checked: boolean) => {
    onFiltersChange((prev) => ({
        ...prev,
        categories: checked
            ? [...prev.categories, id]
            : prev.categories.filter((c) => c !== id),
    }));
};

  const handleBrandChange = (id: string, checked: boolean) => {
    onFiltersChange((prev) => ({
      ...prev,
      brands: checked
        ? [...prev.brands, id]
        : prev.brands.filter((b) => b !== id),
    }))
  }

  const handleTagChange = (id: string, checked: boolean) => {
    onFiltersChange((prev) => ({
      ...prev,
      tags: checked
        ? [...prev.tags, id]
        : prev.tags.filter((t) => t !== id),
    }))
  }

  const handlePriceChange = (value: number[]) => {
    onFiltersChange((prev) => ({ ...prev, priceRange: [value[0], value[1]] }))
  }

  const maxPriceFromProducts =
    products.length > 0 ? Math.max(...products.map((p) => p.price)) : 0

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((c) => (
            <div key={c.categoryId} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={c.categoryId}
                  checked={filters.categories.includes(c.categoryId)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(c.categoryId, checked as boolean)
                  }
                />
                <label htmlFor={c.categoryId} className="text-sm font-medium cursor-pointer">
                  {c.categoryName}
                </label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {c.products?.length ?? 0}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by Price</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={maxPriceFromProducts}
            min={0}
            step={1}
          />
          <div className="flex items-center justify-between text-sm">
            <span>
              Price: {new Intl.NumberFormat("vi-VN").format(filters.priceRange[0])} - {new Intl.NumberFormat("vi-VN").format(filters.priceRange[1])}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((b) => (
            <div key={b.brandId} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={b.brandId}
                  checked={filters.brands.includes(b.brandId)}
                  onCheckedChange={(checked) =>
                    handleBrandChange(b.brandId, checked as boolean)
                  }
                />
                <label htmlFor={b.brandId} className="text-sm font-medium cursor-pointer">
                  {b.brandName}
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge
              key={t.productTagId}
              variant={filters.tags.includes(t.productTagId) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() =>
                handleTagChange(
                  t.productTagId,
                  !filters.tags.includes(t.productTagId)
                )
              }
            >
              {t.productTagName}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}