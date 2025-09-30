"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Star, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react"
import { getProductById, getRelatedProduct, productReview, writeProductReview } from "@/components/api/product" 
import type { Product } from "@/types/product"
import type { Review } from "@/types/review"
import { useCart } from "@/contexts/cart-context" 
import { toast } from "sonner" 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [averageRating, setAverageRating] = useState<number>(0)
  const { addToCart } = useCart() // Lấy hàm addToCart từ context

  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmitReview = async () => {
    if (!product) return

    try {
      // Lấy user từ localStorage
      const userData = localStorage.getItem("user")
      if (!userData) {
        toast.error("You must be logged in to write a review")
        return
      }

      const user = JSON.parse(userData)

      const result = await writeProductReview({
        userId: user.userId,
        productId: product.productId,
        context: comment,
        rating,
      })

      toast.success("Review submitted successfully!")
      // refresh lại reviews
      setReviews((prev) => [...prev, result.data])
      setOpen(false)
      setRating(0)
      setComment("")
      router.refresh();
    } catch (err) {
      toast.error("Failed to submit review")
    }
  }

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.productName} has been added to your cart!`);
  };

  useEffect(() => {
    if (reviews.length > 0) {
      const total = reviews.reduce((sum, r) => sum + r.rating, 0)
      setAverageRating(total / reviews.length)
    } else {
      setAverageRating(0)
    }
  }, [reviews])

  useEffect(() => {
    if (params?.id) {
      getProductById(params.id as string)
        .then((data) => setProduct(data))
        .catch(() => setProduct(null))
        .finally(() => setLoading(false))
    }
  }, [params?.id])

  useEffect(() => {
    if (params?.id) {
      getRelatedProduct(params.id as string)
        .then((data) => setRelatedProducts(data))
        .catch(() => setRelatedProducts([]))
        .finally(() => setLoading(false))
    }
  }, [params?.id])

  useEffect(() => {
    if (params?.id) {
      setLoadingReviews(true)
      productReview(params.id as string)
        .then(setReviews)
        .catch(() => setReviews([]))
        .finally(() => setLoadingReviews(false))
    }
  }, [params?.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Button variant="ghost" onClick={() => router.push("/shop")} className="p-0 h-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
          <span>/</span>
          {/* <span>{product.category}</span> */}
          {/* <span>/</span> */}
          <span className="text-gray-900">{product.productName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.productImageUrl || "/placeholder.svg"}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.categoryName}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.productName}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Brand:</span>
                <Badge variant="outline">{product.brandName}</Badge>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Availability:</span>
                <Badge variant={product.availabilityStatus ? "default" : "destructive"}>
                  {product.availabilityStatus ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={!product.availabilityStatus}
                onClick={handleAddToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  {product.description} This high-quality pet product is designed with your furry friend's comfort and
                  safety in mind. Made from premium materials and tested for durability, it's the perfect addition to
                  your pet care routine.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {reviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <p className="text-muted-foreground">No reviews yet.</p>
                    <Button onClick={() => setOpen(true)}>Write a Review</Button>
                  </div>
                ) : (
                  <>
                    {reviews.map((review) => (
                      <div key={review.reviewId} className="flex items-start gap-4 border-b py-4">
                        <img
                          src={review.users?.profilePictureUrl || "/placeholder.svg"}
                          alt={review.users?.fullName || "Anonymous"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{review.users?.fullName || "Anonymous"}</p>
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2">{review.comment}</p>
                        </div>
                      </div>
                    ))}

                    {/* nút viết review ở dưới cùng */}
                    <div className="flex justify-center py-6">
                      <Button onClick={() => setOpen(true)}>Write a Review</Button>
                    </div>
                  </>
                )}

                {/* Dialog viết review */}
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Write a Review</DialogTitle>
                    </DialogHeader>

                    {/* Rating */}
                    <div className="flex space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 cursor-pointer ${
                            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                          onClick={() => setRating(i + 1)}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    <DialogFooter>
                      <Button onClick={handleSubmitReview}>Submit</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Shipping Options</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Standard Shipping: 5-7 business days - Free</li>
                      <li>• Express Shipping: 2-3 business days - $9.99</li>
                      <li>• Overnight Shipping: 1 business day - $19.99</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Return Policy</h4>
                    <p className="text-gray-600">
                      30-day return policy. Items must be in original condition with packaging.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        Related Products
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.productId} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <img
                      src={relatedProduct.productImageUrl || "/placeholder.svg"}
                      alt={relatedProduct.productName}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{relatedProduct.productName}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">${relatedProduct.price}</span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/shop/product/${relatedProduct.productId}`}>View</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
