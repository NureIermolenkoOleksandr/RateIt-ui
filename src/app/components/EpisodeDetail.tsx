import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Clock, Loader2, Tv } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { ModeratorActions } from "./ModeratorActions";
import { EditEpisodeForm } from "./EditEpisodeForm";
import { contentService } from "../../lib/content-service";
import type { Episode } from "../../lib/types/content";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ImageWithFallback";

export function EpisodeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadEpisode(parseInt(id));
    }
  }, [id]);

  const loadEpisode = async (episodeId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const episodeData = await contentService.getEpisodeById(episodeId);
      setEpisode(episodeData);
    } catch (err) {
      console.error("Помилка завантаження епізоду:", err);
      setError("Не вдалося завантажити епізод");
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

  if (error || !episode) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 text-lg mb-6 font-light">{error || "Епізод не знайдено"}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900">
          Повернутися назад
        </Button>
      </div>
    );
  }

  const details = episode.additionalDetails;

  return (
    <div className="space-y-12">
      {/* Back Button */}
      <Button
        onClick={() => navigate(`/tvshows/${details.tvShowId}`)}
        variant="ghost"
        className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-light"
      >
        <ArrowLeft className="size-4 mr-2" />
        Назад до серіалу
      </Button>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl overflow-hidden border border-zinc-800/50 sticky top-24 bg-zinc-900">
            <ImageWithFallback
              src={episode.imageUrl}
              alt={episode.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-500 text-sm font-light">
              <Tv className="size-4" />
              <span>Сезон {details.seasonNumber} • Епізод {details.episodeNumber}</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extralight text-white tracking-tight">
              {episode.title}
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed font-light">
              {episode.description}
            </p>
          </div>

          {/* Rating Section */}
          <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800/50">
            <div>
              <p className="text-sm text-zinc-600 mb-3 font-light">Середня оцінка</p>
              <span className="text-5xl font-extralight text-white">
                {episode.averageRating > 0 ? episode.averageRating.toFixed(1) : "—"}
              </span>
              <p className="text-sm text-zinc-600 mt-2 font-light">
                {episode.numberOfRatings} оцінок
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Дата виходу</span>
              </div>
              <p className="text-white font-light">
                {new Date(episode.releaseDate).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Тривалість</span>
              </div>
              <p className="text-white font-light">{details.runtimeInMinutes} хв</p>
            </div>
          </div>

          {/* Moderator Actions */}
          <ModeratorActions
            contentId={episode.id}
            contentTitle={episode.title}
            onEdit={() => setIsEditOpen(true)}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-white tracking-tight">
            Відгуки ({episode.reviews.length})
          </h2>
        </div>

        <ReviewList reviews={episode.reviews} onReviewsChanged={() => loadEpisode(episode.id)} />

        <ReviewForm contentId={episode.id} onReviewCreated={() => loadEpisode(episode.id)} />
      </div>

      {/* Edit Episode Form */}
      {isEditOpen && (
        <EditEpisodeForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          episode={episode}
          onEpisodeUpdated={() => loadEpisode(episode.id)}
        />
      )}
    </div>
  );
}
