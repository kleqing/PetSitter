"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import * as api from "@/components/api/auth"
import type { User } from "@/types/user"
import { UserRole } from "@/enum/UserRole"

interface AuthContextType {
  user: User | null
  register: (data: any) => Promise<any>
  login: (email: string, password: string) => Promise<any>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  loading: boolean
}

const mapRole = (r: number|string): UserRole => {
  if (r === 2 || r === "2") return UserRole.Shop;
  return UserRole.User;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Load user từ localStorage khi app khởi chạy
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const register = async (data: any) => {
    setLoading(true)
    try {
      const res = await api.register(data)
      if (res.success && res.data) {
        setUser(res.data)
        localStorage.setItem("user", JSON.stringify(res.data))
      }
      return res
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await api.login(email, password)
      if (res.success && res.data) {
        const userData = { ...res.data, role: mapRole(res.data.role) };
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
      }
      return res
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    try {
      // TODO: call Google login API
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        loginWithGoogle,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
