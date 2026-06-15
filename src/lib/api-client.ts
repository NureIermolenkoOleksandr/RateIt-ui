const API_BASE_URL = "";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {};
  }

  async post<T>(endpoint: string, data: unknown, requiresAuth = false): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return (await response.text()) as T;
  }

  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    const headers: HeadersInit = {
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data: unknown, requiresAuth = false): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return (await response.text()) as T;
  }

  async delete<T>(endpoint: string, requiresAuth = true): Promise<T> {
    const headers: HeadersInit = {
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
