export interface PetSitter {
  id: string
  name: string
  location: string
  city: string
  distance: string
  rating: number
  reviewCount: number
  pricing: {
    service: string
    amount: number
    currency: string
    unit: string
  }
  avatar: string
  images: string[]
  description: string
  skills: string[]
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    whatsapp?: string
    telegram?: string
  }
  services: ServiceType[]
  completedBookings?: number
  verified: boolean
}

export type ServiceType = "House Sitting" | "Pet Daycare" | "Pet Walking" | "Pet Boarding" | "Pet Grooming" | "Pet Taxi"

export type PetType = "All Pet Type" | "Dog" | "Cat" | "Bird" | "Rabbit" | "Fish"

export interface ServiceFilters {
  serviceType: ServiceType | null
  location: string
  petType: PetType
}
