"use client";

import { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ProductFilters, Product } from "@/types/product";
import { listProducts } from "@/components/api/product";
import ProductFiltersComponent from "@/components/product-filters";

export default function ShopPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    categories: [],
    brands: [],
    tags: [],
    priceRange: [0, 0],
    sortBy: "latest",
  })
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // fetched products from backend
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setLoading(true);
    setError(null);
    listProducts()
      .then((data) => {
        setProducts(data);
        setCurrentPage(1);
      })
      .catch((err) => {
        setError(err.message || "Failed to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const maxPrice = Math.max(...products.map(p => p.price));
      setFilters((prev) => {
        if (prev.priceRange[0] === 0 && prev.priceRange[1] === 0) {
          return { ...prev, priceRange: [0, maxPrice] };
        }
        return prev;
      });
    }
  }, [products]);

  // reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = products
        .filter((product) => {
            if (q && !product.productName.toLowerCase().includes(q)) return false;
            if (filters.categories.length > 0 && !filters.categories.includes(product.categoryId ?? "")) return false;
            if (filters.brands.length > 0 && !filters.brands.includes(product.brandId ?? "")) return false;
            if (filters.tags.length > 0 && !filters.tags.some((tag) => product.tags.includes(tag))) return false;
            if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
            return true;
        })
        .sort((a, b) => {
            switch (filters.sortBy) {
                case "price-low": return a.price - b.price;
                case "price-high": return b.price - a.price;
                case "rating": return b.rating - a.rating;
                default: return 0;
            }
        });
    return filtered;
}, [products, filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-orange-100 to-orange-200 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium inline-block">Pet Shop</div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">Pet Essentials - Everything Your Pet Needs</h1>
              <p className="text-lg text-gray-700 leading-relaxed">From nutritious food to fun toys and everyday care items — curated selection.</p>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <Button onClick={() => setCurrentPage(1)} className="bg-blue-600 hover:bg-blue-700">Search</Button>
              </div>
            </div>
            <div className="relative">
              <img src="/happy-pets.png" alt="Happy pets" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProductFiltersComponent filters={filters} onFiltersChange={setFilters} products={products} />
            </div>

            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length === 0 ? 0 : Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)}-
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                </p>

                <Select value={filters.sortBy} onValueChange={(value: any) => setFilters({ ...filters, sortBy: value })}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Sort by latest" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Sort by latest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="text-center py-20">Loading products...</div>
              ) : error ? (
                <div className="text-center text-red-600 py-8">{error}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.productId} product={product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                      <Button variant="outline" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        return <Button key={page} variant={currentPage === page ? "default" : "outline"} onClick={() => setCurrentPage(page)} className={currentPage === page ? "bg-orange-500 hover:bg-orange-600" : ""}>{page}</Button>;
                      })}
                      <Button variant="outline" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
