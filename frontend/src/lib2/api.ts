// // frontend/src/lib/api.ts
// import { getAuthToken } from './auth';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ruby2210-todo-manager.hf.space/api';

// class ApiClient {

//   async request(endpoint: string, options: RequestInit = {}) {
//     const url = `${API_BASE_URL}${endpoint}`;
//     const headers: Record<string, string> = {
//       'Content-Type': 'application/json',
//     };

//     if (options.headers) {
//       if (options.headers instanceof Headers) {
//         options.headers.forEach((value, key) => {
//           headers[key] = value;
//         });
//       } else if (Array.isArray(options.headers)) {
//         options.headers.forEach(([key, value]) => {
//           headers[key] = value;
//         });
//       } else {
//         Object.assign(headers, options.headers);
//       }
//     }
//     const token = await getAuthToken();
//     if (token) {
//       headers.Authorization = `Bearer ${token}`;
//     }

//     const config: RequestInit = {
//       headers,
//       ...options,
//     };

//     const response = await fetch(url, config);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return response.json();
//   }

//   async get<T>(endpoint: string): Promise<T> {
//     return this.request(endpoint, { method: 'GET' });
//   }

//   async post<T>(endpoint: string, data?: any): Promise<T> {
//     return this.request(endpoint, {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   async put<T>(endpoint: string, data?: any): Promise<T> {
//     return this.request(endpoint, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   }

//   async delete<T>(endpoint: string): Promise<T> {
//     return this.request(endpoint, { method: 'DELETE' });
//   }
// }

// export const apiClient = new ApiClient();



// frontend/src/lib/api.ts
import { getAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ruby2210-todo-manager.hf.space/api';

class ApiClient {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }
    const token = await getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
