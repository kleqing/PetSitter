"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/types/feature"; // Đảm bảo import type từ types/feature.ts

export default function BookingPage() {
  const params = useParams();
  const serviceId = params.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://localhost:7277/api/service/service/${serviceId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch service details");
        const result = await res.json();
        setService(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetail();
  }, [serviceId]);

  if (loading) return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center">Loading service details...</p>
      </div>
      <Footer />
    </>
  );

  if (error || !service) return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Link href="/features">
            <Button>Back to Services</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );

  const reviewCount = service.serviceReviews.length;
  const avgRating = reviewCount > 0
    ? service.serviceReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/features" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
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
                  src="/placeholder.svg" // Thay bằng shopImageUrl nếu có
                  alt={service.shop?.shopName || "Shop"}
                  width={80}
                  height={80}
                  className="rounded-full object-cover bg-gray-200"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">
                    {service.serviceName} <span className="text-gray-500">@{service.shop?.location || "Unknown"}</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < avgRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600">{reviewCount} Review{reviewCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="cursor-pointer rounded-lg overflow-hidden">
                      <Image
                        src={service.serviceImageUrl instanceof Array ? service.serviceImageUrl[0] : service.serviceImageUrl || "/placeholder.svg"}
                        alt={`${service.serviceName} photo`}
                        width={500}
                        height={500}
                        className="w-full h-32 object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed mb-6">{service.description}</p>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Shop Details</h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Shop Name:</span> {service.shop?.shopName || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Address:</span> {service.shop?.address || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{reviewCount} Review{reviewCount !== 1 ? "s" : ""}</CardTitle>
                  <Button variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-50">
                    Write a Review
                  </Button>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  {service.serviceReviews.map((review) => (
                    <div key={review.reviewId} className="flex gap-4">
                      <Image
                        src="/placeholder.svg" // Thay bằng profilePictureUrl nếu có
                        alt={review.users?.fullName || "User"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover bg-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{review.users?.fullName || "Anonymous"}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
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
                  <h3 className="font-semibold text-lg mb-2">{service.serviceName}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    From ${service.pricePerPerson}/{service.serviceId.split("-")[0]} {/* Giả định đơn vị */}
                  </p>
                  <Link href={`/features/booking/${service.serviceId}`}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 mb-2">Make Reservation</Button>
                  </Link>
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
                    <span>{service.shop?.location || "N/A"}</span>
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
  );
}