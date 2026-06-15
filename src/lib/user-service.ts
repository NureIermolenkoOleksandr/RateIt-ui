import { apiClient } from "./api-client";

export interface UpdateProfileRequest {
  name: string;
  lastName: string;
  age?: number;
}

export interface UserReview {
  id: number;
  rating: number;
  title: string;
  description: string;
  createdAt: string;
  content: {
    id: number;
    title: string;
  };
}

export interface Achievement {
  id: number;
  name: string;
  imageUrl: string | null;
  description: string;
  badgeTitle: string | null;
}

class UserService {
  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    await apiClient.put("/update-user-profile", data, true);
  }

  async getMyReviews(): Promise<UserReview[]> {
    const reviews = await apiClient.get<UserReview[]>("/api/Review/my-reviews", true);
    return reviews;
  }

  async getAchievements(): Promise<Achievement[]> {
    const achievements = await apiClient.get<Achievement[]>("/get-user-achievements", true);
    return achievements;
  }

  getUserInfoFromToken(): { firstName: string; lastName: string } | null {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const firstName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const lastName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"];
      return { firstName, lastName };
    } catch {
      return null;
    }
  }
}

export const userService = new UserService();
