import type { Blog, BlogTag } from "@/types/blog";

export async function getAllBlogs(): Promise<Blog[]> {
  const res = await fetch("https://localhost:7277/api/blog/getallblogs", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  const result = await res.json();
  return result.data;
}

export async function getBlogTags(): Promise<BlogTag[]> {
  const res = await fetch("https://localhost:7277/api/filter/blog-tags", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog tags");
  }

  const result = await res.json();
  return result.data;
}

import type { BlogDetailDTO } from "@/types/blog";

export async function getBlogById(blogId: string): Promise<BlogDetailDTO> {
  const res = await fetch(`https://localhost:7277/api/blog/getblogbyid/${blogId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog details");
  }

  const result = await res.json();
  return result.data;
}

export async function increaseView(blogId: string): Promise<void> {
  const res = await fetch(`https://localhost:7277/api/blog/increaseview/${blogId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to increase view count");
  }

  const result = await res.json();
}

export async function toggleLike(blogId: string, userId: string): Promise<{ likeCount: number; hasLiked: boolean }> {
  const res = await fetch(`https://localhost:7277/api/blog/togglelike/${blogId}?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to toggle like");
  }

  const result = await res.json();
  return result.data;
}

export async function hasUserLiked(blogId: string, userId: string): Promise<boolean> {
  const res = await fetch(`https://localhost:7277/api/blog/hasuserliked/${blogId}?userId=${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to check if user liked");
  }

  const result = await res.json();
  return result.data;
}