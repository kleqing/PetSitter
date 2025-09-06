export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    bio?: string
  }
  category: BlogCategory
  tags: string[]
  featuredImage: string
  publishedAt: string
  readTime: number
  views?: number
  likes?: number
}

export type BlogCategory = "Dog" | "Cat" | "Product Reviews" | "Rescue Groups" | "Pet Care" | "Training" | "Health"

export interface BlogFilters {
  category: BlogCategory | "All"
  searchQuery: string
}
