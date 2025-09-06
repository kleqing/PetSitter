"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, MessageCircle, ArrowLeft } from "lucide-react"
import { petSitters, sampleReviews } from "@/data/pet-sitters"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"

export default function BookingPage() {
  const params = useParams()
  const sitterId = params.id as string
  const sitter = petSitters.find((s) => s.id === sitterId)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!sitter) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Pet Sitter Not Found</h1>
            <Link href="/services">
              <Button>Back to Services</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/services" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Services
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <Image
                  src={sitter.avatar || "/placeholder.svg"}
                  alt={sitter.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">
                    {sitter.name} @{sitter.location}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < sitter.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600">{sitter.reviewCount} REVIEW</span>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {sitter.images.map((image, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer rounded-lg overflow-hidden ${
                          selectedImage === index ? "ring-2 ring-orange-500" : ""
                        }`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${sitter.name} photo ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed mb-6">{sitter.description}</p>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Skills and qualifications</h3>
                    <ul className="space-y-2">
                      {sitter.skills.map((skill, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">+</span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">1 REVIEW</CardTitle>
                  <Button variant="outline" className="text-orange-500 border-orange-500 bg-transparent">
                    WRITE A REVIEW
                  </Button>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {sampleReviews.map((review) => (
                    <div key={review.id} className="flex gap-4">
                      <Image
                        src={review.userAvatar || "/placeholder.svg"}
                        alt={review.userName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{review.userName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="bg-purple-100">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2">Talk & Greet</h3>
                  <p className="text-sm text-gray-600 mb-4">Get to know each other first</p>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 mb-2">Contact</Button>
                  <Badge className="bg-green-400 text-green-900">FREE</Badge>
                </CardContent>
              </Card>

              {/* Service Pricing */}
              <Card className="bg-orange-100">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2">Dog Walking</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    From {sitter.pricing.amount}$ {sitter.pricing.currency}/{sitter.pricing.unit}
                  </p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 mb-2">Make Reservation</Button>
                </CardContent>
              </Card>

              {/* Additional Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Services</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-2">
                    {sitter.services.map((service) => (
                      <Badge key={service} variant="outline" className="mr-2 mb-2">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>{sitter.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>Contact via platform</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <span>Message directly</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
