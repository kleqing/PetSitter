"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Package, DollarSign, ShoppingBag, ArrowLeft, Search } from "lucide-react";
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
import { useAuth } from "@/contexts/auth-context";
import { Product, ProductFilters } from "@/types/product";
import { UserRole } from "@/enum/UserRole";
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
import ProductForm from "@/components/ProductForm";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [shopId, setShopId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [tags, setTags] = useState<{ productTagId: string; productTagName: string }[]>([]);
  const [brands, setBrands] = useState<{ brandId: string; brandName: string }[]>([]);
  const [categories, setCategories] = useState<{ categoryId: string; categoryName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not shop owner
  if (!user || user.role !== UserRole.Shop) {
    router.push("/");
    return null;
  }

  // Fetch all data
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

  useEffect(() => {
    const filtered = products.filter((p) =>
      p.productName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Shop Dashboard</h1>
          <p className="text-gray-500">Manage your shop and products easily</p>
        </div>
        <Button variant="ghost" onClick={() => router.push("/shop")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Products" value={stats.totalProducts} icon={<Package />} />
        <StatCard
          title="Revenue"
          value={`${stats.totalRevenue.toFixed(3)} vnđ`}
          icon={<DollarSign />}
        />
        <StatCard title="Orders" value={stats.totalOrders} icon={<ShoppingBag />} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Products */}
        <TabsContent value="products">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>
                <ProductForm
                  editing={editing}
                  setEditing={setEditing}
                  shopId={shopId}
                  tags={tags}
                  brands={brands}
                  categories={categories}
                  onSuccess={(p) => {
                    setProducts((prev) =>
                      editing
                        ? prev.map((x) => (x.productId === p.productId ? p : x))
                        : [...prev, p]
                    );
                    setIsDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No products found</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((p) => (
                <Card key={p.productId} className="group hover:shadow-lg transition">
                  <div className="relative h-40">
                    <Image
                      src={p.productImageUrl || "/placeholder.png"}
                      alt={p.productName}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold line-clamp-1">{p.productName}</h3>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditing(p);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-orange-600 font-bold mt-1">
                      {p.price.toLocaleString("vi-VN")} ₫
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge>{p.categoryName}</Badge>
                      <Badge variant="outline">{p.brandName}</Badge>
                      {p.tags.map((t, i) => (
                        <Badge key={i} variant="secondary">{t}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          <div className="text-center text-gray-500 py-10">No orders yet.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: any; icon: React.ReactNode }) {
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}
