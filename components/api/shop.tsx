import { Product } from "@/types/product";
import { ApiResponse } from "./response";

export const getShopByUserId = async (
    userId: string
): Promise<ApiResponse<any>> => {
    try {
        const response = await fetch(
            `https://petsitter.runasp.net/api/shop/${userId}/shop`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch shop data");
        }
        return await response.json();
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch shop data",
            data: null,
        };
    }
};

export const getProductsByShopId = async (shopId: string): Promise<ApiResponse<Product[]>> => {
    try {
        const response = await fetch(`https://petsitter.runasp.net/api/shop/${shopId}/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        const result = await response.json();
        if (result.success && result.data?.products) {
            return {
                success: true,
                message: result.message,
                data: result.data.products.map((p: any) => ({
                    productId: p.productId,
                    productName: p.productName,
                    price: p.price,
                    productImageUrl: p.productImageUrl,
                    categoryName: p.category?.categoryName,
                    brandName: p.brand?.brandName,
                    tags: p.tags ? [p.tags.productTagName] : [],
                    description: p.description || "",
                    availabilityStatus: p.stockQuantity > 0,
                    rating: 0,
                    reviews: [],
                    categoryId: p.categoryId,
                    brandId: p.brandId,
                    stockQuantity: p.stockQuantity,
                    shopId: p.shopId,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                })),
            };
        }
        return result;
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch products",
            data: null,
        };
    }
};


export const getProductCountByShopId = async (
    shopId: string
): Promise<ApiResponse<number>> => {
    try {
        const response = await fetch(
            `https://petsitter.runasp.net/api/shop/${shopId}/products/count`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch product count");
        }
        return await response.json();
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch product count",
            data: 0,
        };
    }
};

export const getOrderCountByShopId = async (
    shopId: string
): Promise<ApiResponse<number>> => {
    try {
        const response = await fetch(
            `https://petsitter.runasp.net/api/shop/${shopId}/orders/count`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch order count");
        }
        return await response.json();
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch order count",
            data: 0,
        };
    }
};

export const addProduct = async (
    shopId: string,
    product: FormData
): Promise<ApiResponse<Product>> => {
    try {
        const response = await fetch(
            `https://petsitter.runasp.net/api/shop/${shopId}/products`,
            {
                method: "POST",
                body: product,
            }
        );
        if (!response.ok) {
            throw new Error("Failed to add product");
        }
        const result = await response.json();
        if (result.success && result.data) {
            return {
                success: true,
                message: result.message,
                data: {
                    productId: result.data.productId,
                    productName: result.data.productName,
                    price: result.data.price,
                    productImageUrl: result.data.productImageUrl,
                    categoryName: result.data.category?.categoryName || "N/A",
                    brandName: result.data.brand?.brandName || "N/A",
                    tags: result.data.tags || [],
                    description: result.data.description || "",
                    availabilityStatus: result.data.stockQuantity > 0,
                    rating: 0,
                    reviews: [],
                    categoryId: result.data.categoryId,
                    brandId: result.data.brandId,
                    stockQuantity: result.data.stockQuantity,
                    shopId: result.data.shopId,
                    createdAt: result.data.createdAt,
                    updatedAt: result.data.updatedAt,
                },
            };
        }
        return result;
    } catch (error) {
        return {
            success: false,
            message: "Failed to add product",
            data: null,
        };
    }
};

export const updateProduct = async (
    shopId: string,
    productId: string,
    product: FormData
): Promise<ApiResponse<Product>> => {
    try {
        const response = await fetch(
            `https://petsitter.runasp.net/api/shop/${shopId}/products/${productId}`,
            {
                method: "PUT",
                body: product,
            }
        );
        if (!response.ok) {
            throw new Error("Failed to update product");
        }
        const result = await response.json();
        if (result.success && result.data) {
            return {
                success: true,
                message: result.message,
                data: {
                    productId: result.data.productId,
                    productName: result.data.productName,
                    price: result.data.price,
                    productImageUrl: result.data.productImageUrl,
                    categoryName: result.data.category?.categoryName || "N/A",
                    brandName: result.data.brand?.brandName || "N/A",
                    tags: result.data.tags || [],
                    description: result.data.description || "",
                    availabilityStatus: result.data.stockQuantity > 0,
                    rating: 0,
                    reviews: [],
                    categoryId: result.data.categoryId,
                    brandId: result.data.brandId,
                    stockQuantity: result.data.stockQuantity,
                    shopId: result.data.shopId,
                    createdAt: result.data.createdAt,
                    updatedAt: result.data.updatedAt,
                },
            };
        }
        return result;
    } catch (error) {
        return {
            success: false,
            message: "Failed to update product",
            data: null,
        };
    }
};

// Fetch product tags
export const getProductTags = async (): Promise<ApiResponse<any[]>> => {
    try {
        const response = await fetch(
            `https://petsitter.runasp.net/api/filter/product-tags`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch product tags");
        }
        const result = await response.json();
        return {
            success: result.success,
            message: result.message,
            data: result.data || [],
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch product tags",
            data: [],
        };
    }
};

// Fetch product brands
export const getProductBrands = async (): Promise<ApiResponse<any[]>> => {
    try {
        const response = await fetch(
            `https://petsitter.runasp.net/api/filter/product-brands`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch product brands");
        }
        const result = await response.json();
        return {
            success: result.success,
            message: result.message,
            data: result.data || [],
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch product brands",
            data: [],
        };
    }
};

// Fetch product categories
export const getProductCategories = async (): Promise<ApiResponse<any[]>> => {
    try {
        const response = await fetch(
            `https://petsitter.runasp.net/api/filter/product-categories`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch product categories");
        }
        const result = await response.json();
        return {
            success: result.success,
            message: result.message,
            data: result.data || [],
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch product categories",
            data: [],
        };
    }
};