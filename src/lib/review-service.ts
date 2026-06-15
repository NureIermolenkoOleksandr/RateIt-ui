import { apiClient } from "./api-client";

export interface CreateReviewRequest {
  rating: number;
  title: string;
  description: string;
}

class ReviewService {
  async createReview(contentId: number, review: CreateReviewRequest): Promise<void> {
    await apiClient.post(`/api/Review/leave-review?contentId=${contentId}`, review, true);
  }

  async voteReview(reviewId: number, isLike: boolean): Promise<void> {
    const evaluate = isLike ? 'Like' : 'Dislike';
    await apiClient.post(
      `/api/Review/rate-review?reviewId=${reviewId}&evaluate=${evaluate}`,
      {},
      true
    );
  }
}

export const reviewService = new ReviewService();
