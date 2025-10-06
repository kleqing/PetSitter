"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import {
  getShopByUserId,
  getProductCategories,
  getProductBrands,
  getProductTags,
  addProduct,
} from "@/components/api/shop";
import { Product } from "@/types/product"; // Assuming this is defined in product.ts
import { UserRole } from "@/enum/UserRole";

export default function UploadProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [shopId, setShopId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    shopId: "",
    productName: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    brandId: "",
    tagId: "",
    imageUrl: null as File | null,
    images: [] as string[], // For preview only
  });
  const [categories, setCategories] = useState<{ categoryId: string; categoryName: string }[]>([]);
  const [brands, setBrands] = useState<{ brandId: string; brandName: string }[]>([]);
  const [tags, setTags] = useState<{ productTagId: string; productTagName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not shop owner
  if (!user || user.role !== UserRole.Shop) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You need to be a shop owner to access this page.</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Load shop and dropdown options
  useEffect(() => {
    const fetchData = async () => {
      const shopRes = await getShopByUserId(user.userId);
      if (shopRes.success && shopRes.data) {
        setShopId(shopRes.data.shopId);
        setFormData((prev) => ({ ...prev, shopId: shopRes.data.shopId }));
      }

      const [categoriesRes, brandsRes, tagsRes] = await Promise.all([
        getProductCategories(),
        getProductBrands(),
        getProductTags(),
      ]);
      if (categoriesRes.success) setCategories(categoriesRes.data || []);
      if (brandsRes.success) setBrands(brandsRes.data || []);
      if (tagsRes.success) setTags(tagsRes.data || []);
    };
    fetchData();
  }, [user.userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!shopId) {
      setError("Shop ID is missing");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("ShopId", shopId);
    formDataToSend.append("ProductName", formData.productName);
    formDataToSend.append("Description", formData.description);
    formDataToSend.append("Price", formData.price);
    formDataToSend.append("StockQuantity", formData.stockQuantity);
    formDataToSend.append("CategoryId", formData.categoryId);
    formDataToSend.append("BrandId", formData.brandId);
    formDataToSend.append("TagId", formData.tagId);
    if (formData.imageUrl) {
      formDataToSend.append("ImageUrl", formData.imageUrl);
    }

    try {
      const res = await addProduct(shopId, formDataToSend);
      if (res.success && res.data) {
        router.push("/dashboard");
      } else {
        setError(res.message || "Failed to upload product");
      }
    } catch (err) {
      setError("Failed to upload product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Use only the first file for ImageUrl
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: file,
        images: [newImageUrl], // Preview only the first image
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: null,
      images: [],
    }));
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/shop" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Shop
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Upload New Product</h1>
            <p className="text-gray-600 mt-2">Add a new product to your shop</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="productName" className="mb-2">
                    Product Name *
                  </Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, productName: e.target.value }))
                    }
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe your product..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price" className="mb-2">
                      Price (USD) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, price: e.target.value }))
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stockQuantity" className="mb-2">
                      Stock Quantity *
                    </Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, stockQuantity: e.target.value }))
                      }
                      placeholder="Enter stock quantity"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="categoryId" className="mb-2">
                      Category *
                    </Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, categoryId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brandId" className="mb-2">
                      Brand *
                    </Label>
                    <Select
                      value={formData.brandId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, brandId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.brandId} value={brand.brandId}>
                            {brand.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tagId" className="mb-2">
                    Tag *
                  </Label>
                  <Select
                    value={formData.tagId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, tagId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag.productTagId} value={tag.productTagId}>
                          {tag.productTagName}
                        </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <p className="text-sm text-gray-600">Upload up to 1 image of your product</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors flex items-center justify-center flex-col min-h-[200px]">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex flex-col items-center">
                      <Label htmlFor="imageUrl" className="cursor-pointer text-center">
                        <span className="text-blue-600 hover:text-blue-500">Upload image</span>
                        <span className="text-gray-600"> or drag and drop</span>
                      </Label>
                      <Input
                        id="imageUrl"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>

                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative group">
                        <img
                          src={formData.images[0] || "/placeholder.svg"}
                          alt="Product"
                          className="w-full h-full object-contain rounded-lg border"
                        />
                        <Button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}