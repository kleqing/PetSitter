"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/types/feature"; // Đảm bảo import type từ types/feature.ts
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import router from "next/router";

function WriteReviewDialog({ serviceId, onReviewAdded }: { serviceId: string, onReviewAdded: (review: any) => void }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async () => {
    if (!user) return alert("Please login first")
    setLoading(true)
    try {
      const res = await fetch("https://petsitter.runasp.net/api/service/write-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          serviceId: serviceId,
          context: comment,
          rating: rating,
        }),
      })

      const result = await res.json()
      if (result.success) {
        onReviewAdded(result.data) // update review list
        setOpen(false)
        setComment("")
        setRating(0)
        router.reload();
      } else {
        alert(result.message || "Failed to submit review")
      }
    } catch (err) {
      alert("Error submitting review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-50" onClick={() => setOpen(true)}>
        Write a Review
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Rating stars */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 cursor-pointer ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setRating(i)}
                />
              ))}
            </div>
            <Textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
  
export default function BookingPage() {
  const params = useParams();
  const serviceId = params.id as string;
  const { user} = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContacting, setIsContacting] = useState(false); // Thêm state cho nút contact
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchServiceDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://petsitter.runasp.net/api/service/service/${serviceId}`, {
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

const handleContact = () => {
    if (!user) {
      toast.error("Please log in to start a conversation.");
      router.push("/login");
      return;
    }
    if (!service || !service.shop) return;
      
      // Điều hướng đến trang chat với ID của conversation
      router.push(`/chat?new=${service.shop.shopId}`);
  };

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

  // Xử lý serviceImageUrl linh hoạt với cả chuỗi và mảng
  const serviceImageUrl = service.serviceImageUrl
    ? Array.isArray(service.serviceImageUrl)
      ? service.serviceImageUrl[0] || "/placeholder.svg"
      : typeof service.serviceImageUrl === "string" && service.serviceImageUrl.trim() !== ""
        ? service.serviceImageUrl
        : "/placeholder.svg"
    : "/placeholder.svg"; 

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
                  src={service.shop?.shopImageUrl || "/placeholder.svg"}
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
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <div className="relative w-full h-96">
                    <Image
                      src={serviceImageUrl}
                      alt={`${service.serviceName} photo`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
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
                  <WriteReviewDialog
                    serviceId={service.serviceId}
                    onReviewAdded={(newReview) => {
                      setService((prev) =>
                        prev ? { ...prev, serviceReviews: [...prev.serviceReviews, newReview] } : prev
                      )
                    }}
                  />
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  {service.serviceReviews.map((review) => (
                    <div key={review.reviewId} className="flex gap-4">
                      <Image
                        src={review.users?.profilePictureUrl || "/placeholder.svg"}
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
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 mb-2"
                    onClick={handleContact}>Contact</Button>
                </CardContent>
              </Card>

              {/* Service Pricing */}
              <Card className="bg-orange-100">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2">{service.serviceName}</h3>
                  {service.pricePerPerson === 0 ? (
                    <>
                      <p className="text-sm text-gray-500">Please contact the shop for the service price</p>
                      <br  />
                    </>
                  )
                  : (
                    <p className="text-3xl font-bold text-orange-600 mb-2">
                      ${service.pricePerPerson
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                  )}
                  <Link href={service.shop?.socialMediaLinks || "#"} target="_blank">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 mb-2">
                      Shop profile
                    </Button>
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