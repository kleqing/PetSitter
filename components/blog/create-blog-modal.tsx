"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createBlog } from "@/components/api/blog";
import { BlogTag } from "@/types/blog";

interface Category {
    categoryId: string;
    categoryName: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    tags: BlogTag[];
    categories: Category[];
    onCreated: () => void;
}

export function CreateBlogModal({
    open,
    onClose,
    tags,
    categories,
    onCreated,
}: Props) {
    const [authorId, setAuthorId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [readTimeMinutes, setReadTimeMinutes] = useState(5);
    const [blogTagId, setBlogTagId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [featureImage, setFeatureImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const parsed = JSON.parse(user);
            setAuthorId(parsed.userId);
        }
    }, []);

    const handleSubmit = async () => {
        if (!authorId) return alert("Bạn cần đăng nhập trước khi tạo blog!");
        if (!title || !content || !blogTagId || !categoryId)
            return alert("Please fill all fields");

        const formData = new FormData();
        formData.append("Title", title);
        formData.append("Content", content);
        formData.append("ReadTimeMinutes", readTimeMinutes.toString());
        formData.append("BlogTagId", blogTagId);
        formData.append("CategoryId", categoryId);
        if (featureImage) formData.append("FeatureImage", featureImage);

        try {
            setLoading(true);
            await createBlog(authorId, formData);

            onCreated();
            onClose();
            router.push("/blog"); // ✅ redirect về trang /blog
        } catch (err) {
            console.error(err);
            alert("Failed to create blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create New Blog</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Title */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Title</span>
                        <Input
                            placeholder="Enter blog title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="resize-y break-words break-all whitespace-pre-wrap"
                        />
                    </label>

                    {/* Content */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Content</span>
                        <Textarea
                            placeholder="Write your blog content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            className="resize-y break-words break-all whitespace-pre-wrap"
                        />
                    </label>

                    {/* Read time */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">
                            Read time (minutes)
                        </span>
                        <Input
                            type="number"
                            placeholder="5"
                            value={readTimeMinutes}
                            onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                            className="resize-y break-words break-all whitespace-pre-wrap"
                        />
                    </label>

                    {/* Blog Tag */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Blog Tag</span>
                        <select
                            className="w-full border rounded p-2 mt-1"
                            value={blogTagId}
                            onChange={(e) => setBlogTagId(e.target.value)}
                        >
                            <option value="">-- Select Tag --</option>
                            {tags.map((tag) => (
                                <option key={tag.blogTagId} value={tag.blogTagId}>
                                    {tag.blogTagName}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Category */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Category</span>
                        <select
                            className="w-full border rounded p-2 mt-1"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">-- Select Category --</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Feature Image */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">
                            Feature Image
                        </span>
                        <Input
                            type="file"
                            onChange={(e) => setFeatureImage(e.target.files?.[0] || null)}
                        />
                    </label>

                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading ? "Creating..." : "Create Blog"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
