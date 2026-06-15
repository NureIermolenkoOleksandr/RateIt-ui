import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Users, Tag, Loader2, Gamepad2 } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { ModeratorActions } from "./ModeratorActions";
import { EditGameForm } from "./EditGameForm";
import { contentService } from "../../lib/content-service";
import type { Game } from "../../lib/types/content";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./ImageWithFallback";

export function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadGame(parseInt(id));
    }
  }, [id]);

  const loadGame = async (gameId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const gameData = await contentService.getGameById(gameId);
      setGame(gameData);
    } catch (err) {
      console.error("Помилка завантаження гри:", err);
      setError("Не вдалося завантажити гру");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-10 text-zinc-600 animate-spin mb-4" />
        <p className="text-zinc-500 text-lg font-light">Завантаження...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 text-lg mb-6 font-light">{error || "Гру не знайдено"}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900">
          Повернутися назад
        </Button>
      </div>
    );
  }

  const details = game.additionalDetails;

  return (
    <div className="space-y-12">
      <Button onClick={() => navigate(-1)} variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-light">
        <ArrowLeft className="size-4 mr-2" />
        Назад до ігор
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="rounded-2xl overflow-hidden border border-zinc-800/50 sticky top-24 bg-zinc-900">
            <ImageWithFallback src={game.imageUrl} alt={game.title} className="w-full aspect-[3/4] object-cover" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-extralight text-white tracking-tight">{game.title}</h1>
            <p className="text-xl text-zinc-400 leading-relaxed font-light">{game.description}</p>
          </div>

          <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800/50">
            <div>
              <p className="text-sm text-zinc-600 mb-3 font-light">Середня оцінка</p>
              <span className="text-5xl font-extralight text-white">
                {game.averageRating > 0 ? game.averageRating.toFixed(1) : "—"}
              </span>
              <p className="text-sm text-zinc-600 mt-2 font-light">
                {game.numberOfRatings} оцінок
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Розробник</span>
              </div>
              <p className="text-white font-light">{details.developer}</p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Видавець</span>
              </div>
              <p className="text-white font-light">{details.publisher}</p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Дата виходу</span>
              </div>
              <p className="text-white font-light">
                {new Date(game.releaseDate).toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {details.platforms && details.platforms.length > 0 && (
              <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad2 className="size-4 text-zinc-600" />
                  <span className="text-sm text-zinc-600 font-light">Платформи</span>
                </div>
                <p className="text-white font-light">{details.platforms.join(", ")}</p>
              </div>
            )}
          </div>

          {details.genres && details.genres.length > 0 && (
            <div>
              <p className="text-sm text-zinc-600 mb-3 font-light">Жанри</p>
              <div className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50 font-light px-4 py-1.5">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Moderator Actions */}
          <ModeratorActions
            contentId={game.id}
            contentTitle={game.title}
            onEdit={() => setIsEditOpen(true)}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-white tracking-tight">
            Відгуки ({game.reviews.length})
          </h2>
        </div>

        <ReviewList reviews={game.reviews} onReviewsChanged={() => loadGame(game.id)} />

        <ReviewForm contentId={game.id} onReviewCreated={() => loadGame(game.id)} />
      </div>

      {/* Edit Game Form */}
      {isEditOpen && (
        <EditGameForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          game={game}
          onGameUpdated={() => loadGame(game.id)}
        />
      )}
    </div>
  );
}
