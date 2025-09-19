"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, Heart, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getBlogById, increaseView, toggleLike, hasUserLiked } from "@/components/api/blog";
import { toast } from "@/components/ui/use-toast"; // Giả sử bạn dùng toast cho thông báo
import type { BlogDetailDTO } from "@/types/blog";

export default function BlogPostPage() {
  const params = useParams();
  const blogId = params.id as string;
  const [post, setPost] = useState<BlogDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState<boolean | null>(null);

  // Lấy userId từ localStorage, giả định object được lưu dưới key "user"
  let userId: string | null = null;
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      userId = parsedUser.userId || parsedUser.id;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await increaseView(blogId);
        const data = await getBlogById(blogId);
        setPost(data);
        if (userId) {
          const liked = await hasUserLiked(blogId, userId);
          setHasLiked(liked);
        } else {
          setHasLiked(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [blogId, userId]);

  // Sử dụng useCallback để tối ưu hóa handleToggleLike
  const handleToggleLike = useCallback(async () => {
    if (!post || !userId) {
      console.error("User not logged in or post not loaded");
      toast({ title: "Error", description: "Please log in to like this post", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { likeCount, hasLiked: newHasLiked } = await toggleLike(blogId, userId);
      setPost((prev) => prev ? { ...prev, likeCount } : null);
      setHasLiked(newHasLiked);
      toast({ title: "Success", description: `Liked the post! (${likeCount} likes)` });
    } catch (err) {
      console.error("Error toggling like:", err);
      toast({ title: "Error", description: "Failed to toggle like. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [post, userId, blogId, toast]); // Thêm dependency cần thiết

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center">Loading...</p>
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <Link href="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={post.featuredImageUrl || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              <CardContent className="p-8">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Badge variant="secondary" className="text-sm">
                    {post.tagName}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTimeMinutes} min read
                    </span>
                    {post.viewCount && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.viewCount} views
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="text-4xl font-bold mb-6 leading-tight">{post.title}</h1>

                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                  <Image
                    src={post.authorAvatar || "/placeholder.svg"}
                    alt={post.authorName}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{post.authorName}</h3>
                    <p className="text-gray-600 text-sm">{post.authorExperience}</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className="mb-8">
                  <h3 className="font-semibold mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">#{post.tagName}</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                      onClick={handleToggleLike}
                      disabled={loading || !userId}
                    >
                      <Heart
                        className={`w-4 h-4 ${hasLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                      />
                      Like ({post.likeCount || 0})
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </article>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src={post.authorAvatar || "/placeholder.svg"}
                  alt={post.authorName}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold mb-2">{post.authorName}</h3>
                <p className="text-sm text-gray-600 mb-4">{post.authorExperience}</p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  View Profile
                </Button>
              </CardContent>
            </Card>

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
  );
}