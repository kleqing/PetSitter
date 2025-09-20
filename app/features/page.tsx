"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { Service, ServiceTag } from "@/types/feature";
import { getListServices } from "@/components/api/feature";

const priceRanges = ["all", "below10", "below20", "below50"] as const;
type PriceRange = typeof priceRanges[number];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [tags, setTags] = useState<ServiceTag[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState<{
    tagId: string;
    location: string;
    priceRange: PriceRange;
  }>({
    tagId: "",
    location: "all",
    priceRange: "all",
  });

  // Danh sách locations động
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { services, tags } = await getListServices();
        console.log("Fetched services:", services.map(s => ({ serviceId: s.serviceId, serviceImageUrl: s.serviceImageUrl }))); // Debug
        setServices(services);
        setTags(tags);

        // Tính toán danh sách locations duy nhất từ service.shop.location
        const uniqueLocations = [...new Set(services.map((s) => s.shop?.location).filter((loc): loc is string => loc !== undefined))];
        setLocations(uniqueLocations);
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredServices = services.filter((s) => {
    let match = true;
    if (filters.tagId && s.tagId !== filters.tagId) match = false;
    if (filters.location && filters.location !== "all" && s.shop?.location !== filters.location) match = false;
    if (filters.priceRange !== "all") {
      switch (filters.priceRange) {
        case "below10":
          match = s.pricePerPerson < 10;
          break;
        case "below20":
          match = s.pricePerPerson < 20;
          break;
        case "below50":
          match = s.pricePerPerson < 50;
          break;
        default:
          match = true;
      }
    }
    return match;
  });

  if (loading) return <p className="p-6 text-center">Loading services...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-orange-400 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              If animals could talk,
              <br /> they'd talk about us!
            </h1>
            <p className="text-lg mb-8 max-w-md">
              Whether you're grooming, walking, sitting, or scheduling a ride — our pet service partners are here to
              help. We've built a trusted network of certified providers to make your life easier and your pet's life
              happier.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Book Now
            </Button>
          </div>
          <div className="hidden md:block">
            <Image
              src="/happy-person-dog.png?height=400&width=500"
              alt="Happy dog"
              width={500}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Pick a Service</h2>

          {/* Service Tags */}
          <div className="mb-8 text-center">
            <p className="text-gray-600 mb-4 text-lg font-medium">I am looking for</p>
            <div className="flex justify-center flex-wrap gap-3">
              {tags.map((tag) => (
                <Button
                  key={tag.serviceTagId}
                  variant={filters.tagId === tag.serviceTagId ? "default" : "outline"}
                  onClick={() => setFilters((prev) => ({ ...prev, tagId: tag.serviceTagId }))}
                  className="rounded-full px-4 py-2 text-sm"
                >
                  {tag.tagName}
                </Button>
              ))}
            </div>
          </div>

          {/* Location & Price Range */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col space-y-2 text-center">
              <p className="text-gray-600 font-medium text-lg">Near me in</p>
              <Select
                value={filters.location}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
              >
                <SelectTrigger className="h-12 w-full mx-auto rounded-full border-gray-300 focus:ring-2 focus:ring-orange-500">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2 text-center">
              <p className="text-gray-600 font-medium text-lg">Price Range</p>
              <Select
                value={filters.priceRange}
                onValueChange={(value: PriceRange) => setFilters((prev) => ({ ...prev, priceRange: value }))}
              >
                <SelectTrigger className="h-12 w-full mx-auto rounded-full border-gray-300 focus:ring-2 focus:ring-orange-500">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {priceRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range === "all" ? "All Price" : `${range.replace("below", "Below $")}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Service List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8">
            Browse {filteredServices.length} Services near you in {filters.location === "all" ? "Any Location" : filters.location}
          </h3>

          <div className="grid gap-6">
            {filteredServices.map((service) => {
              const reviewCount = service.serviceReviews.length;
              const avgRating =
                reviewCount > 0
                  ? service.serviceReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
                  : 0;

              return (
                <Card key={service.serviceId} className="overflow-hidden">
                  <CardContent className="p-6 flex gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {service.serviceImageUrl && Array.isArray(service.serviceImageUrl) && service.serviceImageUrl.length > 0 && typeof service.serviceImageUrl[0] === "string" && service.serviceImageUrl[0].trim() !== "" ? (
                        <Image
                          src={service.serviceImageUrl[0]} // Lấy phần tử đầu tiên từ mảng
                          alt={service.serviceName}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <Image
                          src="/placeholder.svg"
                          alt={service.serviceName}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-xl font-semibold">{service.serviceName}</h4>
                          <p className="text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {service.shop?.location || "Unknown Location"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">From</p>
                          <p className="text-lg font-bold text-orange-500">${service.pricePerPerson}</p>
                          <p className="text-sm text-gray-500">per person</p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">{service.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < avgRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            {avgRating.toFixed(1)} ★ ({reviewCount})
                          </span>
                        </div>

                        <Link href={`/features/booking/${service.serviceId}`}>
                          <Button className="bg-orange-500 hover:bg-orange-600">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredServices.length === 0 && !loading && (
            <p className="text-center py-8 text-gray-500">No services match your filters.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}