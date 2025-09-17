export interface Product {
  productId: string
  productName: string
  price: number
  productImageUrl: string
  categoryName: string
  brandName: string
  tags: string[]  // chỉ lưu productTagId
  description: string
  availabilityStatus: boolean
  rating: number
  categoryId?: string
  brandId?: string
  reviews: { userId: string; comment: string; rating: number }[]
}

export interface ProductFilters {
  categories: string[]
  priceRange: [number, number]
  brands: string[]
  tags: string[] // list productTagId đang chọn
  sortBy: "latest" | "price-low" | "price-high" | "rating"
}
