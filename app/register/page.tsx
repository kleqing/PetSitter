"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff } from "lucide-react";
import { useCountries, useStates, Country, State } from "@/components/api/location";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "user" as "user" | "shop",
    dateOfBirth: "",
    country: "",
    state: "",
    address: "",
    shopName: "",
    description: "",
    bankName: "",
    bankNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  const banks = [
  "Vietcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "Techcombank",
  "ACB",
  "Sacombank",
  "MB Bank",
  "VPBank",
  "SHB",
  "TPBank",
  "Eximbank",
  "HDBank",
];

  const { countries, error: countryError } = useCountries();
  const { states: availableStates, error: stateError } = useStates(formData.country);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === "state" || field === "country") {
        const stateName = availableStates.find((s) => s.iso2 === newData.state)?.name || "";
        const countryName = countries.find((c) => c.iso2 === newData.country)?.name || "";
        newData.address = [stateName, countryName].filter(Boolean).join(", ");
      }

      return newData;
    });

    if (field === "country") {
      setFormData((prev) => ({ ...prev, state: "", address: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    // Kiểm tra các trường bắt buộc cho ShopOwner
    if (formData.role === "shop" && (!formData.shopName || !formData.description)) {
      setError("Shop Name and Description are required for Shop Owner registration");
      return;
    }

    try {
      await register({ ...formData });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">PS</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an account</h2>
          <p className="mt-2 text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        {/* Registration Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          <div>
            <Label htmlFor="fullName">What should we call you?</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your profile name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">What's your email?</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="role">Choose the type you want to register with our site</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "user" | "shop") => handleInputChange("role", value)}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Regular User</SelectItem>
                <SelectItem value="shop">Shop Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
            <div className="relative mt-1">
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>

          {/* Location Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Choose country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.iso2} value={country.iso2}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Select
                value={formData.state}
                onValueChange={(value) => handleInputChange("state", value)}
                disabled={!formData.country}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder={formData.country ? "Choose state" : "Select country first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableStates.map((state) => (
                    <SelectItem key={state.iso2} value={state.iso2}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="password">Create a password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
          </div>

          {formData.role === "shop" && (
            <>
              <div>
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  type="text"
                  placeholder="Enter your shop name"
                  value={formData.shopName}
                  onChange={(e) => handleInputChange("shopName", e.target.value)}
                  required 
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Shop Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Describe your shop"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required 
                  className="mt-1"
                />
              </div>

              
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Select
                  value={formData.bankName}
                  onValueChange={(value) => handleInputChange("bankName", value)}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bankNumber">Bank Account</Label>
                <Input
                  id="bankNumber"
                  type="text"
                  placeholder="Enter your shop bank account"
                  value={formData.bankNumber}
                  onChange={(e) => handleInputChange("bankNumber", e.target.value)}
                  required 
                  className="mt-1"
                />
              </div>

            </>
          )}

          <div className="flex items-start">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="ml-2 text-sm">
              By creating an account, you agree to our
              <Link href="/privacy" className="text-blue-600">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !acceptTerms}>
            {loading ? "Creating account..." : "Create an account"}
          </Button>
        </form>

      </div>
    </div>
  );
}