"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, Heart, Share2, ArrowLeft } from "lucide-react"
import { blogPosts } from "@/data/blog-posts"
import Link from "next/link"
import Image from "next/image"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            <Card className="overflow-hidden">
              {/* Featured Image */}
              <div className="aspect-video relative">
                <Image src={post.featuredImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>

              <CardContent className="p-8">
                {/* Post Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Badge variant="secondary" className="text-sm">
                    {post.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime} min read
                    </span>
                    {post.views && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views} views
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-6 leading-tight">{post.title}</h1>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                  <Image
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <p className="text-gray-600 text-sm">{post.author.bio}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Tags */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Social Actions */}
                <div className="flex items-center justify-between border-t pt-6">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <Heart className="w-4 h-4" />
                      Like ({post.likes || 0})
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative">
                        <Image
                          src={relatedPost.featuredImage || "/placeholder.svg"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="font-semibold mb-2 line-clamp-2 hover:text-orange-500 transition-colors">
                          <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{relatedPost.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{new Date(relatedPost.publishedAt).toLocaleDateString()}</span>
                          <span>{relatedPost.readTime} min read</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Table of Contents */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Table of Contents</h3>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">
                    Introduction
                  </a>
                  <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">
                    Main Points
                  </a>
                  <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">
                    Tips & Advice
                  </a>
                  <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">
                    Conclusion
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Author Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold mb-2">{post.author.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{post.author.bio}</p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-orange-50 to-blue-50">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold mb-2">Never Miss a Post</h3>
                <p className="text-sm text-gray-600 mb-4">Subscribe to get our latest pet care content.</p>
                <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
