"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Clock, Eye, Heart } from "lucide-react"
import { blogPosts, blogCategories } from "@/data/blog-posts"
import type { BlogFilters, BlogCategory } from "@/types/blog"
import Link from "next/link"
import Image from "next/image"

export default function BlogPage() {
  const [filters, setFilters] = useState<BlogFilters>({
    category: "All",
    searchQuery: "",
  })

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = filters.category === "All" || post.category === filters.category
    const matchesSearch =
      post.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const recentPosts = blogPosts.slice(0, 5)
  const popularTags = ["training", "health", "nutrition", "behavior", "toys", "grooming", "safety"]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-400 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-5xl font-bold mb-6">Blog</h1>
              <p className="text-xl leading-relaxed mb-8">
                Our Blog is your ultimate online destination for everything related to pets. Whether you're a first-time
                pet parent or a seasoned animal lover, we provide engaging, informative, and heartwarming content to
                help you care for and celebrate your furry friends.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Latest Posts
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-500 bg-transparent"
                >
                  Subscribe
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image src="/happy-pets-group.png" alt="Happy pets" width={500} height={400} className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search blog posts..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {blogCategories.map((category) => (
                  <Button
                    key={category.name}
                    variant={filters.category === category.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters({ ...filters, category: category.name as BlogCategory | "All" })}
                    className="rounded-full"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="space-y-8">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div className="aspect-video md:aspect-square relative">
                          <Image
                            src={post.featuredImage || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <CardContent className="md:w-2/3 p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="secondary">{post.category}</Badge>
                          <div className="flex items-center text-sm text-gray-500 gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.readTime} min read
                            </span>
                          </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-3 hover:text-orange-500 transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>

                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Image
                              src={post.author.avatar || "/placeholder.svg"}
                              alt={post.author.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <div>
                              <p className="font-medium text-sm">{post.author.name}</p>
                              <p className="text-xs text-gray-500">{post.author.bio}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {post.views && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.views}
                              </span>
                            )}
                            {post.likes && (
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {post.likes}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <Link href={`/blog/${post.slug}`}>
                            <Button className="bg-orange-500 hover:bg-orange-600">Read More</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Posts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-600">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex gap-3">
                      <Image
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        width={60}
                        height={60}
                        className="rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 hover:text-orange-500 transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{new Date(post.publishedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Blog Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-600">Blog Categories</h3>
                <div className="space-y-2">
                  {blogCategories
                    .filter((cat) => cat.name !== "All")
                    .map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setFilters({ ...filters, category: category.name as BlogCategory })}
                        className="flex justify-between items-center w-full p-2 rounded hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="outline">({category.count})</Badge>
                      </button>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-600">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-orange-100 hover:border-orange-300"
                      onClick={() => setFilters({ ...filters, searchQuery: tag })}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-orange-50 to-blue-50">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
                <p className="text-gray-600 mb-4">Get the latest pet care tips and stories delivered to your inbox.</p>
                <div className="space-y-3">
                  <Input placeholder="Enter your email" type="email" />
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
