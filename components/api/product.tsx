// components/api/product.ts
import type { Product } from "@/types/product";

function safeImage(url: any) {
    if (!url) return "/placeholder.png";
    if (typeof url === "string" && url.toLowerCase() === "null") return "/placeholder.png";
    return url;
}

export async function listProducts(): Promise<Product[]> {
    const res = await fetch("https://localhost:7277/api/product/list-products", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        throw new Error("Listing products failed");
    }

    const result = await res.json();
    const items = result?.data ?? [];
    return items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        productImageUrl: safeImage(item.productImageUrl),
        categoryId: item.categoryId,
        brandId: item.brandId, 
        categoryName: item.category?.categoryName ?? "",
        brandName: item.brand?.brandName ?? "",
        tags: item.tags ? [item.tags.productTagName] : [],
        description: item.description,
        availabilityStatus: item.availabilityStatus,
        rating: item.rating ?? 0,
        reviews: item.reviews?.length ?? 0,
    }));
}

export async function getProductById(id: string): Promise<Product> {
    const res = await fetch(`https://localhost:7277/api/product/product/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Getting product failed");

    const result = await res.json();
    const item = result.data;

    return {
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        productImageUrl: item.productImageUrl,
        categoryName: item.category?.categoryName ?? "",
        brandName: item.brand?.brandName ?? "",
        tags: Array.isArray(item.tags)
        ? item.tags.map((t: any) => t.productTagName)
        : item.tags
            ? [item.tags.productTagName]
            : [],
        description: item.description,
        availabilityStatus: item.availabilityStatus,
        rating: item.rating,
        reviews: item.reviews ?? [],
    };
}

export async function getRelatedProduct(id: string): Promise<Product[]> {
    const res = await fetch(`https://localhost:7277/api/product/related/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) throw new Error("No related products found");

    const result = await res.json();
    const items = result.data ?? [];

    return items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        productImageUrl: item.productImageUrl,
        categoryName: item.category?.categoryName ?? "",
        brandName: item.brand?.brandName ?? "",
        tags: Array.isArray(item.tags)
        ? item.tags.map((t: any) => t.productTagName)
        : item.tags
            ? [item.tags.productTagName]
            : [],
        description: item.description,
        availabilityStatus: item.availabilityStatus,
        rating: item.rating,
        reviews: item.reviews ?? [],
    }));
}

