import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { reviewService } from "../../lib/review-service";
import { authService } from "../../lib/auth-service";

interface ReviewFormProps {
  contentId: number;
  onReviewCreated: () => void;
}

export function ReviewForm({ contentId, onReviewCreated }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = authService.isAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError("Для написання відгуку потрібно увійти");
      return;
    }

    if (rating === 0 || !title.trim() || !description.trim()) {
      setError("Заповніть всі поля");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await reviewService.createReview(contentId, {
        rating,
        title: title.trim(),
        description: description.trim(),
      });

      setRating(0);
      setTitle("");
      setDescription("");
      onReviewCreated();
    } catch (err: any) {
      console.error("Помилка створення відгуку:", err);
      setError(err.message || "Не вдалося створити відгук");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-zinc-900/30 rounded-2xl p-8 border border-zinc-800/30 text-center">
        <p className="text-zinc-400 font-light">
          Увійдіть в систему, щоб залишити відгук
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/30 rounded-2xl p-8 border border-zinc-800/30">
      <h3 className="text-xl font-light text-white mb-6">Напишіть свій відгук</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="space-y-3">
          <label className="text-sm text-zinc-400 font-light">
            Ваша оцінка *
          </label>
          <div className="flex items-center gap-2">
            {[...Array(10)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`size-6 transition-colors ${
                      starValue <= (hoveredRating || rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-zinc-700"
                    }`}
                  />
                </button>
              );
            })}
            {rating > 0 && (
              <span className="text-white font-light ml-2">{rating}/10</span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <label className="text-sm text-zinc-400 font-light">
            Заголовок відгуку *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Наприклад: Неймовірна гра!"
            maxLength={100}
            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 font-light focus:outline-none focus:border-zinc-700"
          />
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="text-sm text-zinc-400 font-light">
            Ваш відгук *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Поділіться своїми враженнями детальніше..."
            rows={5}
            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 font-light focus:outline-none focus:border-zinc-700 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm font-light">{error}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || rating === 0 || !title.trim() || !description.trim()}
          className="bg-white text-black hover:bg-zinc-200 font-light h-11 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Надсилання...
            </>
          ) : (
            <>
              <Send className="size-4 mr-2" />
              Опублікувати відгук
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
