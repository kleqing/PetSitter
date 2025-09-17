import { UserRole } from "@/enum/UserRole"

export interface User {
    userId: string
    fullName: string
    profilePictureUrl: string
    role: UserRole
    dateOfBirth: string
    address: string
    email: string
    phoneNumber: string
    createdAt: string
    updatedAt: string
}
