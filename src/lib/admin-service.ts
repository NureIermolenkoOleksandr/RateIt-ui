import { apiClient } from "./api-client";

class AdminService {
  async checkAdminAccess(): Promise<boolean> {
    try {
      const response = await apiClient.get<{ message: string }>("/admin-test", true);
      return response.message === "Admin-Authorize";
    } catch (error: any) {
      // Якщо 403, то користувач не адмін
      if (error.message?.includes("403")) {
        return false;
      }
      console.error("Помилка перевірки прав адміністратора:", error);
      return false;
    }
  }

  // Кешуємо результат перевірки в localStorage з TTL
  getCachedAdminStatus(): boolean | null {
    const cached = localStorage.getItem("is_admin");
    const timestamp = localStorage.getItem("is_admin_timestamp");

    if (!cached || !timestamp) return null;

    // Кеш дійсний 5 хвилин
    const isExpired = Date.now() - parseInt(timestamp) > 5 * 60 * 1000;
    if (isExpired) {
      localStorage.removeItem("is_admin");
      localStorage.removeItem("is_admin_timestamp");
      return null;
    }

    return cached === "true";
  }

  setCachedAdminStatus(isAdmin: boolean): void {
    localStorage.setItem("is_admin", isAdmin.toString());
    localStorage.setItem("is_admin_timestamp", Date.now().toString());
  }

  clearAdminCache(): void {
    localStorage.removeItem("is_admin");
    localStorage.removeItem("is_admin_timestamp");
  }

  async isAdmin(): Promise<boolean> {
    // Спочатку перевіряємо кеш
    const cached = this.getCachedAdminStatus();
    if (cached !== null) {
      return cached;
    }

    // Якщо кешу немає, робимо запит
    const isAdmin = await this.checkAdminAccess();
    this.setCachedAdminStatus(isAdmin);
    return isAdmin;
  }
}

export const adminService = new AdminService();
