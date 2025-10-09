// app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context"; 
import { useAuth } from "@/contexts/auth-context"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation"; 
import { Footer } from "@/components/footer"; 

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  
  const [shippingAddress, setShippingAddress] = useState(user?.address || "");
  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please log in to place an order.");
      router.push("/login");
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error("Please enter your shipping address.");
      return;
    }
    if (!token) { // <-- Thêm kiểm tra token
        toast.error("Authentication token not found. Please log in again.");
        router.push("/login");
        return;
    }

    setIsLoading(true);

    const checkoutData = {
      fullName: user.fullName, 
      phoneNumber: user.phoneNumber,
      shippingAddress: shippingAddress,
      cartItems: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    // app/checkout/page.tsx -> trong hàm handlePlaceOrder

try {
  const response = await fetch("https://localhost:7277/api/orders/checkout", { 
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(checkoutData),
  });

  // KIỂM TRA LỖI 401 UNAUTHORIZED
  if (response.status === 401) {
    toast.error("Your session has expired. Please log in again.");
    // Điều hướng người dùng về trang đăng nhập
    router.push('/login'); 
    return; // Dừng hàm tại đây
  }
  
  if (!response.ok) {
    // Thử đọc lỗi dưới dạng text trước
    const errorText = await response.text(); 
    throw new Error(errorText || "Failed to place order.");
  }
  
  // Chỉ parse JSON nếu có nội dung
  const contentLength = response.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 0) {
    const data = await response.json();
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      throw new Error("Payment link not received.");
    }
  } else {
    // Xử lý trường hợp response thành công nhưng không có nội dung
    throw new Error("Received an empty response from the server.");
  }

} catch (error: any) {
  toast.error(error.message);
} finally {
  setIsLoading(false);
}
  };

  // Nếu giỏ hàng trống thì điều hướng về shop
  if (cart.length === 0 && typeof window !== 'undefined') {
    router.replace('/shop');
    return null;
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Cột thông tin giao hàng */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Shipping Address</Label>
                <Input 
                  id="address" 
                  placeholder="123 Main St, An Nhon, Binh Dinh" 
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="mt-1"
                />
              </div>
              {/* Thêm các trường khác nếu cần: Full Name, Phone... */}
            </div>
          </div>

          {/* Cột tóm tắt đơn hàng */}
          <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4">Your Order</h2>
            <div className="space-y-2 mb-4 border-b pb-4">
              {cart.map(item => (
                <div key={item.productId} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <img src={item.productImageUrl} alt={item.productName} className="w-10 h-10 object-cover rounded mr-3"/>
                    <span>{item.productName} <span className="text-gray-500">x {item.quantity}</span></span>
                  </div>
                  <span>{new Intl.NumberFormat("vi-VN").format(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{new Intl.NumberFormat("vi-VN").format(total)}</span>
            </div>
            <Button 
              className="w-full mt-6"
              onClick={handlePlaceOrder}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Place Order & Pay with PayOS"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}