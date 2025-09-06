"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Facebook, Instagram, Twitter, Linkedin, MessageCircle, Send } from "lucide-react"
import { petSitters } from "@/data/pet-sitters"
import type { ServiceType, PetType, ServiceFilters } from "@/types/service"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const serviceTypes: ServiceType[] = [
  "House Sitting",
  "Pet Daycare",
  "Pet Walking",
  "Pet Boarding",
  "Pet Grooming",
  "Pet Taxi",
]

const petTypes: PetType[] = ["All Pet Type", "Dog", "Cat", "Bird", "Rabbit", "Fish"]

export default function ServicesPage() {
  const [filters, setFilters] = useState<ServiceFilters>({
    serviceType: null,
    location: "Sai Gon, Viet Nam",
    petType: "All Pet Type",
  })

  const [activeService, setActiveService] = useState<ServiceType | null>(null)

  const filteredSitters = petSitters.filter((sitter) => {
    if (filters.serviceType && !sitter.services.includes(filters.serviceType)) {
      return false
    }
    return true
  })

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="w-4 h-4" />
      case "instagram":
        return <Instagram className="w-4 h-4" />
      case "twitter":
        return <Twitter className="w-4 h-4" />
      case "linkedin":
        return <Linkedin className="w-4 h-4" />
      case "whatsapp":
        return <MessageCircle className="w-4 h-4" />
      case "telegram":
        return <Send className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Component */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-400 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                If animals could talk,
                <br />
                they'd talk about us!
              </h1>
              <p className="text-lg mb-8 max-w-md">
                Whether you're grooming, walking, sitting, or scheduling a ride — our pet service partners are here to
                help. We've built a trusted network of certified providers to make your life easier and your pet's life
                happier.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Book Now
              </Button>
            </div>
            <div className="hidden md:block">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Happy dog"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Selection */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Pick a Services</h2>

          {/* Service Type Buttons */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">I am looking for</p>
            <div className="flex flex-wrap gap-3">
              {serviceTypes.map((service) => (
                <Button
                  key={service}
                  variant={activeService === service ? "default" : "outline"}
                  onClick={() => {
                    setActiveService(service)
                    setFilters((prev) => ({ ...prev, serviceType: service }))
                  }}
                  className="rounded-full"
                >
                  {service}
                </Button>
              ))}
            </div>
          </div>

          {/* Location and Pet Type Filters */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-gray-600 mb-2">Near me in</p>
              <Select
                value={filters.location}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sai Gon, Viet Nam">Sai Gon, Viet Nam</SelectItem>
                  <SelectItem value="Ha Noi, Viet Nam">Ha Noi, Viet Nam</SelectItem>
                  <SelectItem value="Da Nang, Viet Nam">Da Nang, Viet Nam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-gray-600 mb-2">My Pet Type</p>
              <Select
                value={filters.petType}
                onValueChange={(value: PetType) => setFilters((prev) => ({ ...prev, petType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {petTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Sitters List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">
              Scroll down to browse {filteredSitters.length} Dog Sitters near you in {filters.location}
            </h3>
            <div className="hidden md:block w-1/3">
              {/* Map placeholder - can be implemented later */}
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map Integration</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredSitters.map((sitter) => (
              <Card key={sitter.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={sitter.avatar || "/placeholder.svg"}
                        alt={sitter.name}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-xl font-semibold">{sitter.name}</h4>
                          <p className="text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {sitter.location}, {sitter.distance}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">From</p>
                          <p className="text-lg font-bold text-orange-500">
                            {sitter.pricing.currency} {sitter.pricing.amount}
                          </p>
                          <p className="text-sm text-gray-500">/{sitter.pricing.unit}</p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">{sitter.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < sitter.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">{sitter.reviewCount} Reviews</span>
                          </div>

                          {/* Social Media Icons */}
                          <div className="flex gap-2">
                            {Object.entries(sitter.socialMedia).map(([platform, url]) => (
                              <a
                                key={platform}
                                href={url}
                                className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                              >
                                {getSocialIcon(platform)}
                              </a>
                            ))}
                          </div>

                          {/* Completed Bookings Badge */}
                          {sitter.completedBookings && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {sitter.completedBookings} Completed Bookings
                            </Badge>
                          )}
                        </div>

                        <Link href={`/features/booking/${sitter.id}`}>
                          <Button className="bg-orange-500 hover:bg-orange-600">View Profile</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-4">
              Don't have time to find the right pet sitters? Let us help you!
            </p>
            <Button size="lg" className="bg-red-500 hover:bg-red-600">
              REQUEST TOP 5 QUOTES
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  )
}
