import { apiClient } from "./api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age?: number;
}

export interface AuthResponse {
  jwtToken?: string;
  refreshToken?: string;
  token?: string;
  accessToken?: string;
  [key: string]: unknown;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<string> {
    console.log("Відправка запиту на логін...");
    const response = await apiClient.post<AuthResponse>("/login", credentials);
    console.log("Отримана відповідь від сервера:", response);

    let token: string | undefined;

    if (typeof response === "string") {
      console.log("Відповідь - строка");
      token = response;
    } else if (typeof response === "object") {
      console.log("Відповідь - об'єкт");
      token = response.jwtToken || response.token || response.accessToken;
      console.log("Витягнутий токен:", token ? "Токен знайдено" : "Токен НЕ знайдено");

      if (response.refreshToken) {
        localStorage.setItem("refresh_token", response.refreshToken);
        console.log("Refresh токен збережено");
      }
    }

    if (token && typeof token === "string") {
      localStorage.setItem("jwt_token", token);
      console.log("JWT токен ЗБЕРЕЖЕНО в localStorage!");
      console.log("Довжина токена:", token.length);
      return token;
    }

    console.error("Неочікуваний формат відповіді:", response);
    throw new Error("Токен не отримано від сервера");
  }

  async register(data: RegisterRequest): Promise<void> {
    await apiClient.post("/register", data);
  }

  logout(): void {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("refresh_token");
    // Очищаємо кеш адміністратора
    localStorage.removeItem("is_admin");
    localStorage.removeItem("is_admin_timestamp");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("jwt_token");
  }

  getToken(): string | null {
    return localStorage.getItem("jwt_token");
  }
}

export const authService = new AuthService();
