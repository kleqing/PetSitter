export async function register(userData: any) {
    const res = await fetch('https://localhost:7277/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })

    if (!res.ok) {
        throw new Error('Registration failed')
    }
    return res.json()
}

export async function login(email: string, password: string) {
    const res = await fetch('https://localhost:7277/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
        throw new Error('Login failed')
    }
    return res.json()
}