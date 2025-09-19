import { User } from "@/types/user";

export async function updateUser(user: User): Promise<User> {
    const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error("Failed to update user");
    }
    return response.json();
}