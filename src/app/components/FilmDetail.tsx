import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Users, Tag, Shield, Loader2 } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { ModeratorActions } from "./ModeratorActions";
import { EditFilmForm } from "./EditFilmForm";
import { contentService } from "../../lib/content-service";
import type { Film } from "../../lib/types/content";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./ImageWithFallback";

export function FilmDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [film, setFilm] = useState<Film | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadFilm(parseInt(id));
    }
  }, [id]);

  const loadFilm = async (filmId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const filmData = await contentService.getFilmById(filmId);
      setFilm(filmData);
    } catch (err) {
      console.error("Помилка завантаження фільму:", err);
      setError("Не вдалося завантажити фільм");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-10 text-zinc-600 animate-spin mb-4" />
        <p className="text-zinc-500 text-lg font-light">Завантаження фільму...</p>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 text-lg mb-6 font-light">{error || "Фільм не знайдено"}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900">
          Повернутися назад
        </Button>
      </div>
    );
  }

  const details = film.additionalDetails;

  return (
    <div className="space-y-12">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-light"
      >
        <ArrowLeft className="size-4 mr-2" />
        Назад до фільмів
      </Button>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl overflow-hidden border border-zinc-800/50 sticky top-24 bg-zinc-900">
            <ImageWithFallback
              src={film.imageUrl}
              alt={film.title}
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-extralight text-white tracking-tight">
              {film.title}
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed font-light">
              {film.description}
            </p>
          </div>

          {/* Rating Section */}
          <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800/50">
            <div>
              <p className="text-sm text-zinc-600 mb-3 font-light">Середня оцінка</p>
              <span className="text-5xl font-extralight text-white">
                {film.averageRating > 0 ? film.averageRating.toFixed(1) : "—"}
              </span>
              <p className="text-sm text-zinc-600 mt-2 font-light">
                {film.numberOfRatings} оцінок
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Режисер</span>
              </div>
              <p className="text-white font-light">{details.director}</p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Дата виходу</span>
              </div>
              <p className="text-white font-light">
                {new Date(film.releaseDate).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Тривалість</span>
              </div>
              <p className="text-white font-light">{details.runtimeInMinutes} хв</p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Країна</span>
              </div>
              <p className="text-white font-light">{details.countryOfOrigin}</p>
            </div>
          </div>

          {/* Genres */}
          {details.genres && details.genres.length > 0 && (
            <div>
              <p className="text-sm text-zinc-600 mb-3 font-light">Жанри</p>
              <div className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50 font-light px-4 py-1.5"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {details.mainCast && (
            <div>
              <p className="text-sm text-zinc-600 mb-2 font-light">Актори</p>
              <p className="text-white font-light">{details.mainCast}</p>
            </div>
          )}

          {details.writers && (
            <div>
              <p className="text-sm text-zinc-600 mb-2 font-light">Сценаристи</p>
              <p className="text-white font-light">{details.writers}</p>
            </div>
          )}

          {(details.budget > 0 || details.boxOffice > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.budget > 0 && (
                <div>
                  <p className="text-sm text-zinc-600 mb-2 font-light">Бюджет</p>
                  <p className="text-white font-light">
                    ${details.budget.toLocaleString()}
                  </p>
                </div>
              )}
              {details.boxOffice > 0 && (
                <div>
                  <p className="text-sm text-zinc-600 mb-2 font-light">Касові збори</p>
                  <p className="text-white font-light">
                    ${details.boxOffice.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Moderator Actions */}
          <ModeratorActions
            contentId={film.id}
            contentTitle={film.title}
            onEdit={() => setIsEditOpen(true)}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-white tracking-tight">
            Відгуки ({film.reviews.length})
          </h2>
        </div>

        <ReviewList reviews={film.reviews} onReviewsChanged={() => loadFilm(film.id)} />

        <ReviewForm contentId={film.id} onReviewCreated={() => loadFilm(film.id)} />
      </div>

      {/* Edit Film Form */}
      {isEditOpen && (
        <EditFilmForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          film={film}
          onFilmUpdated={() => loadFilm(film.id)}
        />
      )}
    </div>
  );
}
