
const TOKEN_KEY = 'auth_token';

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem(TOKEN_KEY);
}

export async function setAuthToken(token: string): Promise<void> {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.setItem(TOKEN_KEY, token);
}


export async function removeAuthToken(): Promise<void> {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.removeItem(TOKEN_KEY);
}

function decodeJWT(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
}

function isTokenExpired(token: string): boolean {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
        return true;
    }

    const expirationTime = decoded.exp * 1000;
    return Date.now() >= expirationTime;
}

export async function validateToken(): Promise<boolean> {
    const token = getAuthToken();

    if (!token) {
        return false;
    }

    if (isTokenExpired(token)) {
        await removeAuthToken();
        return false;
    }

    return true;
}
