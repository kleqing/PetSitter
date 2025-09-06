"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, MapPinIcon, MailIcon, UserIcon, EditIcon, SaveIcon, XIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dateOfBirth: user?.dateOfBirth || "",
    address: user?.address || "",
  })

  // Redirect if not logged in
  if (!user) {
    router.push("/login")
    return null
  }

  const handleSave = () => {
    // In a real app, this would update the user data via API
    console.log("[v0] Saving profile data:", formData)
    setIsEditing(false)
    // Here you would typically update the user context with new data
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth || "",
      address: user?.address || "",
    })
    setIsEditing(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-orange-100 text-orange-600">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="text-lg">{user.email}</CardDescription>
                  <Badge variant={user.role === "shop" ? "default" : "secondary"} className="mt-2">
                    {user.role === "shop" ? "Shop Owner" : "Regular User"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <EditIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} size="sm">
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <XIcon className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <span>{user.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <MailIcon className="w-4 h-4 text-gray-500" />
                          <span>{user.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span>{user.dateOfBirth || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <MapPinIcon className="w-4 h-4 text-gray-500" />
                          <span>{user.address || "Not provided"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      <Badge variant={user.role === "shop" ? "default" : "secondary"}>
                        {user.role === "shop" ? "Shop Owner" : "Regular User"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="p-2 bg-gray-50 rounded">{new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Notification Settings
                  </Button>
                  <Separator />
                  <Button onClick={logout} variant="destructive" className="w-full">
                    Sign Out
                  </Button>
                </CardContent>
              </Card>

              {user.role === "shop" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shop Owner Tools</CardTitle>
                    <CardDescription>Manage your shop and products</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={() => router.push("/dashboard")} className="w-full justify-start">
                      Shop Dashboard
                    </Button>
                    <Button
                      onClick={() => router.push("/shop/upload")}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      Upload Product
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
