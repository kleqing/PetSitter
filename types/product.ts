export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand: string
  tags: string[]
  description: string
  inStock: boolean
  rating: number
  reviews: number
  isFavorite?: boolean
}

export interface ProductFilters {
  categories: string[]
  priceRange: [number, number]
  brands: string[]
  tags: string[]
  sortBy: "latest" | "price-low" | "price-high" | "rating"
}
