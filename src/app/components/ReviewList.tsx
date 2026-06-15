import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import type { Review } from "../../lib/types/content";
import { reviewService } from "../../lib/review-service";
import { authService } from "../../lib/auth-service";

interface ReviewListProps {
  reviews: Review[];
  onReviewsChanged: () => void;
}

export function ReviewList({ reviews, onReviewsChanged }: ReviewListProps) {
  const [votingReviewId, setVotingReviewId] = useState<number | null>(null);

  async function handleVote(reviewId: number, isLike: boolean) {
    if (!authService.isAuthenticated()) {
      alert("Увійдіть в систему, щоб голосувати");
      return;
    }

    try {
      setVotingReviewId(reviewId);
      await reviewService.voteReview(reviewId, isLike);
      onReviewsChanged();
    } catch (err: any) {
      console.error("Помилка голосування:", err);
      alert(err.message || "Не вдалося проголосувати");
    } finally {
      setVotingReviewId(null);
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 bg-zinc-900/20 rounded-2xl border border-zinc-800/20">
        <MessageSquare className="size-16 text-zinc-700 mx-auto mb-4" />
        <p className="text-zinc-500 font-light text-lg">
          Поки що немає відгуків. Будьте першим!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const isVoting = votingReviewId === review.id;

        return (
          <div
            key={review.id}
            className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800/30"
          >
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              {review.user && (
                <div className="size-12 rounded-full bg-zinc-800 flex items-center justify-center text-white font-light text-sm flex-shrink-0">
                  {getInitials(review.user.firstName, review.user.lastName)}
                </div>
              )}

              {/* User Info & Title */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  {review.user && (
                    <h4 className="text-white font-light">
                      {review.user.firstName} {review.user.lastName}
                    </h4>
                  )}
                  <span className="text-yellow-500 font-light text-lg">
                    {review.rating}/10
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-light">
                  {new Date(review.createdAt).toLocaleDateString("uk-UA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Review Title */}
            <h3 className="text-white font-light text-xl mb-3">{review.title}</h3>

            {/* Review Description */}
            <p className="text-zinc-400 font-light leading-relaxed mb-4">
              {review.description}
            </p>

            {/* Like/Dislike Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleVote(review.id, true)}
                disabled={isVoting}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  review.currentUserVote === "Like"
                    ? "bg-green-500/20 text-green-400"
                    : "text-zinc-500 hover:bg-zinc-800/50 hover:text-green-400"
                } disabled:opacity-50`}
              >
                <ThumbsUp className="size-4" />
                <span className="text-sm font-light">{review.likeCount}</span>
              </button>

              <button
                onClick={() => handleVote(review.id, false)}
                disabled={isVoting}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  review.currentUserVote === "Dislike"
                    ? "bg-red-500/20 text-red-400"
                    : "text-zinc-500 hover:bg-zinc-800/50 hover:text-red-400"
                } disabled:opacity-50`}
              >
                <ThumbsDown className="size-4" />
                <span className="text-sm font-light">{review.dislikeCount}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
