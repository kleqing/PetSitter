export interface User {
  id: string
  name: string
  email: string
  role: "user" | "shop"
  dateOfBirth?: string
  address?: string
  avatar?: string
  createdAt: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: "user" | "shop"
  dateOfBirth?: string
  address?: string
}
