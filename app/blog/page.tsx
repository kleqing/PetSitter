"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, Eye, Heart } from "lucide-react";
import { getAllBlogs, getBlogTags } from "@/components/api/blog";
import type { Blog, BlogFilters, BlogTag } from "@/types/blog";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [filters, setFilters] = useState<BlogFilters>({
    category: "All",
    searchQuery: "",
    tagId: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogData, tagData] = await Promise.all([getAllBlogs(), getBlogTags()]);
        setBlogs(blogData);
        setTags(tagData);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      const matchesCategory = filters.category === "All" || post.categoryId === filters.category;
      const matchesSearch =
        post.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        post.blogTag.blogTagName.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesTag = !filters.tagId || post.tagId === filters.tagId;
      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [blogs, filters]);

  const recentPosts = useMemo(() => {
    return [...blogs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // mới nhất lên đầu
      .slice(0, 5);
  }, [blogs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-center">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Blog List */}
          <div className="lg:col-span-3">
            <BlogFilters filters={filters} setFilters={setFilters} tags={tags} blogsCount={blogs.length} />
            <BlogList posts={filteredPosts} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <RecentPosts posts={recentPosts} />
            <SubscribeCard />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* -------------------- Components -------------------- */

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-orange-400 to-orange-500 text-white py-16">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-5xl font-bold mb-6">Blog</h1>
          <p className="text-xl leading-relaxed mb-8">
            Our Blog is your ultimate online destination for everything related to pets. Whether you're a first-time
            pet parent or a seasoned animal lover, we provide engaging, informative, and heartwarming content to help
            you care for and celebrate your furry friends.
          </p>
          <div className="flex gap-4">
            <Link href="/blog/create">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Create Blog
              </Button>
            </Link>
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
          <Image src="/happy-dog-park-run.png" alt="Happy pets" width={500} height={400} className="rounded-lg" />
        </div>
      </div>
    </section>
  );
}

function BlogFilters({
  filters,
  setFilters,
  tags,
  blogsCount,
}: {
  filters: BlogFilters;
  setFilters: (f: BlogFilters) => void;
  tags: BlogTag[];
  blogsCount: number;
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search blog posts (content only)..."
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

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.tagId === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilters({ ...filters, tagId: null })}
          className="rounded-full"
        >
          All ({blogsCount})
        </Button>
        {tags.map((tag) => (
          <Button
            key={tag.blogTagId}
            variant={filters.tagId === tag.blogTagId ? "default" : "outline"}
            size="sm"
            onClick={() => setFilters({ ...filters, tagId: tag.blogTagId })}
            className="rounded-full"
          >
            {tag.blogTagName}
          </Button>
        ))}
      </div>
    </div>
  );
}

function BlogList({ posts }: { posts: Blog[] }) {

    const formatContent = (html: string) => html || "";

    if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <Card
          key={post.blogId}
          className="overflow-hidden hover:shadow-lg transition-shadow relative rounded-xl"
        >
          <div className="md:flex">
            {/* Thumbnail */}
            <div className="md:w-1/3 p-4">
              <div className="relative h-48 md:h-full w-full overflow-hidden rounded-xl shadow-sm">
                <Image
                  src={post.featuredImageUrl || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Content */}
            <CardContent className="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <Badge variant="secondary">{post.blogTag.blogTagName}</Badge>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTimeMinutes} min read
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-3 hover:text-orange-500 transition-colors">
                  <Link href={`/blog/${post.blogId}`}>{post.title}</Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={post.author.profilePictureUrl || "/placeholder.svg"}
                    alt={post.author.fullName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">{post.author.fullName}</p>
                    <p className="text-xs text-gray-500">{post.author.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likeCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="absolute bottom-4 right-4">
            <Link href={`/blog/${post.blogId}`}>
              <Button className="bg-orange-500 hover:bg-orange-600">Read More</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}

function RecentPosts({ posts }: { posts: Blog[] }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-orange-600">Recent Posts</h3>

        <div className="divide-y divide-gray-200">
          {posts.map((post, idx) => (
            <div key={post.blogId} className="flex items-start gap-3 py-3">
              {/* Thumbnail */}
              <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={post.featuredImageUrl || "/placeholder.svg"}
                  alt={post.title}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate hover:text-orange-500 transition-colors">
                  <Link href={`/blog/${post.blogId}`}>{post.title}</Link>
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SubscribeCard() {
  return (
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
  );
}
