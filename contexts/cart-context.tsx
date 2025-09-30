"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { Product } from "@/types/product" 

export interface CartItem extends Product {
  quantity: number
}

// Định nghĩa kiểu dữ liệu cho Context
interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: number | string) => void
  clearCart: () => void
  // Bạn có thể thêm các hàm khác ở đây sau này: removeFromCart, updateQuantity,...
}

// Tạo Context với giá trị mặc định
const CartContext = createContext<CartContextType | undefined>(undefined)

// Tạo Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load giỏ hàng từ localStorage khi component được mount lần đầu
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  // Lưu giỏ hàng vào localStorage mỗi khi nó thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart((prevCart) => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingProductIndex = prevCart.findIndex((item) => item.productId === product.productId)

      if (existingProductIndex !== -1) {
        // Nếu đã có, cập nhật số lượng
        const updatedCart = [...prevCart]
        updatedCart[existingProductIndex].quantity += quantity
        return updatedCart
      } else {
        // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
        return [...prevCart, { ...product, quantity }]
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: number | string) => {
    setCart((prevCart) => {
      return prevCart.filter((item) => item.productId !== productId)
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]); 
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// Tạo một custom hook để sử dụng Cart Context dễ dàng hơn
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}