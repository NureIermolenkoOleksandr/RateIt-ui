import { useState, useEffect } from "react";
import { MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { userService, type UserReview } from "../../lib/user-service";
import { useNavigate } from "react-router";

export function MyReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userService.getMyReviews();
      setReviews(data);
    } catch (err: any) {
      console.error("Помилка завантаження відгуків:", err);
      setError(err.message || "Не вдалося завантажити відгуки");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-10 text-zinc-600 animate-spin mb-4" />
        <p className="text-zinc-500 text-lg font-light">Завантаження відгуків...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-lg font-light mb-6">{error}</p>
        <Button
          onClick={loadReviews}
          variant="outline"
          className="border-zinc-800 text-white hover:bg-zinc-900"
        >
          Спробувати знову
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-light"
        >
          <ArrowLeft className="size-4 mr-2" />
          Назад
        </Button>
      </div>

      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center">
          <MessageSquare className="size-10 text-white opacity-60" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-extralight text-white mb-3 tracking-tight">
            Мої відгуки
          </h1>
          <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto">
            Всі ваші відгуки в одному місці
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-zinc-800/20">
          <MessageSquare className="size-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 font-light text-lg">
            Ви ще не залишили жодного відгуку
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800/30 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-light text-lg">
                      {review.content.title}
                    </h3>
                    <span className="text-yellow-500 font-light text-lg">
                      {review.rating}/10
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 font-light">
                    {new Date(review.createdAt).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {review.title && (
                <div>
                  <h4 className="text-white font-light text-xl mb-2">
                    {review.title}
                  </h4>
                </div>
              )}

              {review.description && (
                <p className="text-zinc-400 font-light leading-relaxed">
                  {review.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
