"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const reviewCount = product.reviews?.length ?? 0
  const averageRating =
    reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Link href={`/shop/product/${product.productId}`}>
      <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={product.productImageUrl || "/placeholder.svg"}
              alt={product.productName}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white"
              onClick={toggleFavorite}
            />
          </div>

          <div className="p-4">
            {/* Tên sản phẩm */}
            <h3 className="font-semibold text-lg mb-1">{product.productName}</h3>

            {/* Rating + số lượng review */}
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {averageRating.toFixed(1)} ★ ({reviewCount} review
                {reviewCount !== 1 ? "s" : ""})
              </span>
            </div>

            {/* Giá */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
