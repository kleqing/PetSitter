import type { Blog, BlogTag, BlogDetailDTO } from "@/types/blog";
import { ApiResponse } from "./response";

/**
 * Helper: lấy user từ localStorage
 */
function getCurrentUser() {
  if (typeof window === "undefined") return null; // tránh lỗi khi SSR
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export async function getAllBlogs(): Promise<Blog[]> {
  const res = await fetch("https://petsitter.runasp.net/api/blog/getallblogs", {
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
  const res = await fetch("https://petsitter.runasp.net/api/filter/blog-tags", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog tags");
  }

  const result = await res.json();
  return result.data;
}

export async function getBlogById(blogId: string): Promise<BlogDetailDTO> {
  const user = getCurrentUser();
  const userId = user?.userId ?? "00000000-0000-0000-0000-000000000000";

  const res = await fetch(
    `https://petsitter.runasp.net/api/blog/getblogbyid/${blogId}?userId=${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blog details");
  }

  const result = await res.json();
  return result.data;
}

export async function increaseView(blogId: string): Promise<Blog> {
  const res = await fetch(`https://petsitter.runasp.net/api/blog/increaseview/${blogId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to increase view count: ${errorText}`);
  }

  const result = await res.json();
  return result.data;
}

export async function toggleLike(blogId: string): Promise<{ likeCount: number; hasLiked: boolean }> {
  const user = getCurrentUser();
  if (!user) throw new Error("User not found in localStorage");

  const res = await fetch(
    `https://petsitter.runasp.net/api/blog/togglelike/${blogId}?userId=${user.userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to toggle like");
  }

  const result = await res.json();
  return result.data;
}

export async function hasUserLiked(blogId: string): Promise<boolean> {
  const user = getCurrentUser();
  if (!user) return false;

  const res = await fetch(
    `https://petsitter.runasp.net/api/blog/hasuserliked/${blogId}?userId=${user.userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to check if user liked");
  }

  const result = await res.json();
  return result.data;
}

export async function createBlog(authorId: string, formData: FormData) {
  const res = await fetch(`https://petsitter.runasp.net/api/blog/${authorId}/create`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Create blog failed");
  return await res.json();
}

export async function getBlogCategories(): Promise<{ categoryId: string; categoryName: string }[]> {
  const res = await fetch("https://petsitter.runasp.net/api/filter/blog-categories", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog categories");
  }

  const result = await res.json();
  return result.data;
}
