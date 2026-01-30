// Authentication wrapper for API calls with Better Auth token

export class AuthWrapper {
  private static instance: AuthWrapper;
  private token: string | null = null;

  private constructor() {}

  public static getInstance(): AuthWrapper {
    if (!AuthWrapper.instance) {
      AuthWrapper.instance = new AuthWrapper();
    }
    return AuthWrapper.instance;
  }

  async getToken(): Promise<string | null> {
    // Check if we already have a token cached
    if (this.token) {
      return this.token;
    }

    // Try to get token from Better Auth
    try {
      // In a real implementation, this would call Better Auth's get session/token API
      // For now, we'll simulate getting the token from localStorage or cookies
      const token = localStorage.getItem('better-auth-token');
      if (token) {
        this.token = token;
        return token;
      }

      // If not in localStorage, try to fetch from Better Auth session
      // This is a simulated approach - actual implementation would depend on Better Auth setup
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include' // Include cookies for session-based auth
      });

      if (response.ok) {
        const sessionData = await response.json();
        if (sessionData?.token) {
          this.token = sessionData.token;
          // Store in localStorage for subsequent requests
          localStorage.setItem('better-auth-token', sessionData.token);
          return sessionData.token;
        }
      }
    } catch (error) {
      console.warn('Could not retrieve auth token:', error);
    }

    return null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async addAuthHeader(headers: Headers): Promise<void> {
    const token = await this.getToken();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('better-auth-token');
  }

  // Method to make authenticated API calls
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getToken();

    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Set up headers with auth token
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);

    // Ensure content type is set if not already
    if (!headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include' // Include cookies for session-based auth
    });

    // If response is 401, clear the cached token as it may be expired
    if (response.status === 401) {
      this.clearToken();
    }

    return response;
  }
}