"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Product, ProductFilters } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getShopByUserId,
  getProductsByShopId,
  getProductCountByShopId,
  getOrderCountByShopId,
  addProduct,
  updateProduct,
  getProductTags,
  getProductBrands,
  getProductCategories,
} from "@/components/api/shop";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [shopId, setShopId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<{
    shopId: string;
    productName: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryId: string;
    brandId: string;
    tagId: string;
    imageUrl?: File | null;
  }>({
    shopId: "",
    productName: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    categoryId: "",
    brandId: "",
    tagId: "",
    imageUrl: null,
  });
  const [tags, setTags] = useState<{ productTagId: string; productTagName: string }[]>([]);
  const [brands, setBrands] = useState<{ brandId: string; brandName: string }[]>([]);
  const [categories, setCategories] = useState<{ categoryId: string; categoryName: string }[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    categories: [],
    brands: [],
    tags: [],
    priceRange: [0, Infinity],
    sortBy: "latest",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not shop owner
  if (!user || user.role !== "shop") {
    router.push("/");
    return null;
  }

  // Load shop + stats + products + tags + brands + categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const shopRes = await getShopByUserId(user.userId);
      if (!shopRes.success || !shopRes.data) {
        setError("Failed to load shop");
        setLoading(false);
        return;
      }

      const sid = shopRes.data.shopId;
      setShopId(sid);
      setForm((prev) => ({ ...prev, shopId: sid }));

      const [prodRes, countRes, orderRes, tagsRes, brandsRes, categoriesRes] =
        await Promise.all([
          getProductsByShopId(sid),
          getProductCountByShopId(sid),
          getOrderCountByShopId(sid),
          getProductTags(),
          getProductBrands(),
          getProductCategories(),
        ]);

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data);
        setFilteredProducts(prodRes.data);
        setStats((s) => ({
          ...s,
          totalRevenue: (orderRes.data || 0) * 100, // Adjust as needed
        }));
      }
      if (countRes.success)
        setStats((s) => ({ ...s, totalProducts: countRes.data || 0 }));
      if (orderRes.success)
        setStats((s) => ({ ...s, totalOrders: orderRes.data || 0 }));
      if (tagsRes.success) setTags(tagsRes.data || []);
      if (brandsRes.success) setBrands(brandsRes.data || []);
      if (categoriesRes.success) setCategories(categoriesRes.data || []);

      setLoading(false);
    };
    fetchData();
  }, [user.userId]);

  // Filters
  useEffect(() => {
    let result = [...products];
    if (filters.categories.length)
      result = result.filter((p) =>
        filters.categories.includes(p.categoryName)
      );
    if (filters.brands.length)
      result = result.filter((p) => filters.brands.includes(p.brandName));
    if (filters.tags.length)
      result = result.filter((p) =>
        p.tags.some((tag) => filters.tags.includes(tag))
      );
    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
    }

    setFilteredProducts(result);
  }, [products, filters]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stockQuantity" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, imageUrl: file || null }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Initialize form when editing
  useEffect(() => {
    if (editing && shopId) {
      setForm({
        shopId: shopId,
        productName: editing.productName,
        description: editing.description,
        price: editing.price,
        stockQuantity: editing.stockQuantity || 0,
        categoryId: editing.categoryId || "",
        brandId: editing.brandId || "",
        tagId: editing.tagId || "", // Updated to handle optional tagId
        imageUrl: null,
      });
    } else if (shopId) {
      setForm({
        shopId: shopId,
        productName: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        categoryId: "",
        brandId: "",
        tagId: "",
        imageUrl: null,
      });
    }
  }, [editing, shopId]);

  // CRUD handlers
  const handleSubmit = async () => {
    if (!shopId) {
      setError("Shop ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("ShopId", form.shopId);
    formData.append("ProductName", form.productName);
    formData.append("Description", form.description);
    formData.append("Price", form.price.toString());
    formData.append("StockQuantity", form.stockQuantity.toString());
    formData.append("CategoryId", form.categoryId);
    formData.append("BrandId", form.brandId);
    formData.append("TagId", form.tagId);
    if (form.imageUrl) {
      formData.append("ImageUrl", form.imageUrl);
    }

    let res;
    if (editing) {
      res = await updateProduct(shopId, editing.productId, formData);
    } else {
      res = await addProduct(shopId, formData);
    }

    if (res.success && res.data) {
      if (editing) {
        setProducts((prev) =>
          prev.map((p) => (p.productId === editing.productId ? res.data! : p))
        );
      } else {
        setProducts((prev) => [...prev, res.data!]);
      }
      setIsDialogOpen(false);
      setEditing(null);
      setForm({
        shopId: shopId,
        productName: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        categoryId: "",
        brandId: "",
        tagId: "",
        imageUrl: null,
      });
      setError(null);
    } else {
      setError(res.message);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shop Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={<Package />}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<DollarSign />}
        />
        <StatCard
          title="Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag />}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products">

        {/* Products */}
        <TabsContent value="products">
          <div className="flex justify-between mb-4">
            <Button variant="ghost" className="mb-4" onClick={() => router.push("/shop")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit" : "Add"} Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="productName" className="mb-2">Product Name</Label>
                    <Input
                      id="productName"
                      name="productName"
                      value={form.productName}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="mb-2">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="mb-2">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stockQuantity" className="mb-2">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      name="stockQuantity"
                      type="number"
                      value={form.stockQuantity}
                      onChange={handleInputChange}
                      placeholder="Enter stock quantity"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryId" className="mb-2">Category</Label>
                    <Select
                      name="categoryId"
                      value={form.categoryId}
                      onValueChange={(value) =>
                        handleSelectChange("categoryId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.categoryId}
                            value={category.categoryId}
                          >
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="brandId" className="mb-2">Brand</Label>
                    <Select
                      name="brandId"
                      value={form.brandId}
                      onValueChange={(value) =>
                        handleSelectChange("brandId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem
                            key={brand.brandId}
                            value={brand.brandId}
                          >
                            {brand.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tagId" className="mb-2">Tag</Label>
                    <Select
                      name="tagId"
                      value={form.tagId}
                      onValueChange={(value) =>
                        handleSelectChange("tagId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {tags.map((tag) => (
                          <SelectItem
                            key={tag.productTagId}
                            value={tag.productTagId}
                          >
                            {tag.productTagName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="imageUrl" className="mb-2">Product Image</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full mt-4">
                  {editing ? "Update" : "Add"}
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <Card key={p.productId}>
                <div className="relative h-40">
                  <Image
                    src={p.productImageUrl || "/placeholder.png"}
                    alt={p.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent>
                  <h3 className="font-semibold">{p.productName}</h3>
                  <p className="text-orange-600 font-bold">${p.price}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge>{p.categoryName}</Badge>
                    <Badge variant="outline">{p.brandName}</Badge>
                    {p.tags.map((t, i) => (
                      <Badge key={i} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-auto"
                      onClick={() => {
                        setEditing(p);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders">
          <p>No orders yet.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: any;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-gray-500">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}