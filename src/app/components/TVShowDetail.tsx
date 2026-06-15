import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Users, Tag, Loader2, Plus } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { ModeratorActions } from "./ModeratorActions";
import { EditTVShowForm } from "./EditTVShowForm";
import { CreateEpisodeForm } from "./CreateEpisodeForm";
import { contentService } from "../../lib/content-service";
import { adminService } from "../../lib/admin-service";
import type { TVShow, Episode } from "../../lib/types/content";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./ImageWithFallback";

export function TVShowDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateEpisodeOpen, setIsCreateEpisodeOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (id) {
      const tvShowId = parseInt(id);
      loadTVShow(tvShowId);
      loadEpisodes(tvShowId);
    }
  }, [id]);

  useEffect(() => {
    async function checkAdmin() {
      const adminStatus = await adminService.isAdmin();
      setIsAdmin(adminStatus);
    }
    checkAdmin();
  }, []);

  const loadTVShow = async (tvShowId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const tvShowData = await contentService.getTVShowById(tvShowId);
      setTVShow(tvShowData);
    } catch (err) {
      console.error("Помилка завантаження серіалу:", err);
      setError("Не вдалося завантажити серіал");
    } finally {
      setIsLoading(false);
    }
  };

  const loadEpisodes = async (tvShowId: number) => {
    try {
      setIsLoadingEpisodes(true);
      const episodesData = await contentService.getEpisodesByTVShowId(tvShowId);
      setEpisodes(episodesData);
    } catch (err) {
      console.error("Помилка завантаження епізодів:", err);
    } finally {
      setIsLoadingEpisodes(false);
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

  if (error || !tvShow) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 text-lg mb-6 font-light">{error || "Серіал не знайдено"}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900">
          Повернутися назад
        </Button>
      </div>
    );
  }

  const details = tvShow.additionalDetails;

  return (
    <div className="space-y-12">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-light"
      >
        <ArrowLeft className="size-4 mr-2" />
        Назад до серіалів
      </Button>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl overflow-hidden border border-zinc-800/50 sticky top-24 bg-zinc-900">
            <ImageWithFallback
              src={tvShow.imageUrl}
              alt={tvShow.title}
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-extralight text-white tracking-tight">
              {tvShow.title}
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed font-light">
              {tvShow.description}
            </p>
          </div>

          {/* Rating Section */}
          <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800/50">
            <div>
              <p className="text-sm text-zinc-600 mb-3 font-light">Середня оцінка</p>
              <span className="text-5xl font-extralight text-white">
                {tvShow.averageRating > 0 ? tvShow.averageRating.toFixed(1) : "—"}
              </span>
              <p className="text-sm text-zinc-600 mt-2 font-light">
                {tvShow.numberOfRatings} оцінок
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Автори</span>
              </div>
              <p className="text-white font-light">{details.creators}</p>
            </div>

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
                {new Date(tvShow.releaseDate).toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Сезонів / Епізодів</span>
              </div>
              <p className="text-white font-light">{details.totalSeasons} / {details.totalEpisodes}</p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Мережі</span>
              </div>
              <p className="text-white font-light">{details.networks}</p>
            </div>

            {details.endDate && (
              <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="size-4 text-zinc-600" />
                  <span className="text-sm text-zinc-600 font-light">Дата завершення</span>
                </div>
                <p className="text-white font-light">
                  {new Date(details.endDate).toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            )}
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

          {/* Main Cast */}
          {details.mainCast && (
            <div>
              <p className="text-sm text-zinc-600 mb-2 font-light">Головні актори</p>
              <p className="text-white font-light">{details.mainCast}</p>
            </div>
          )}

          {/* Moderator Actions */}
          <ModeratorActions
            contentId={tvShow.id}
            contentTitle={tvShow.title}
            onEdit={() => setIsEditOpen(true)}
          />
        </div>
      </div>

      {/* Episodes Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-white tracking-tight">
            Епізоди ({episodes.length})
          </h2>
          {isAdmin && (
            <Button
              onClick={() => setIsCreateEpisodeOpen(true)}
              variant="outline"
              className="border-zinc-800 text-white hover:bg-zinc-900 font-light rounded-lg"
            >
              <Plus className="size-4 mr-2" />
              Додати епізод
            </Button>
          )}
        </div>

        {isLoadingEpisodes ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="size-8 text-zinc-600 animate-spin mb-3" />
            <p className="text-zinc-500 text-sm font-light">Завантаження епізодів...</p>
          </div>
        ) : episodes.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-zinc-800/30">
            <p className="text-zinc-500 font-light">Епізоди не знайдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                onClick={() => navigate(`/episodes/${episode.id}`)}
                className="group bg-zinc-900/30 rounded-xl border border-zinc-800/30 hover:border-zinc-700/50 hover:bg-zinc-900/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden bg-zinc-900">
                    <ImageWithFallback
                      src={episode.imageUrl}
                      alt={episode.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="text-xs text-zinc-600 font-light mb-1">
                          Сезон {episode.additionalDetails.seasonNumber} • Епізод {episode.additionalDetails.episodeNumber}
                        </p>
                        <h3 className="text-lg text-white font-light group-hover:text-blue-400 transition-colors line-clamp-1">
                          {episode.title}
                        </h3>
                      </div>
                      {episode.averageRating > 0 && (
                        <div className="flex items-center gap-1 bg-zinc-900/50 px-3 py-1 rounded-full">
                          <span className="text-sm text-white font-light">
                            {episode.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 font-light line-clamp-2 mb-2">
                      {episode.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-zinc-600">
                      <span>{episode.additionalDetails.runtimeInMinutes} хв</span>
                      <span>{new Date(episode.releaseDate).toLocaleDateString("uk-UA")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-white tracking-tight">
            Відгуки ({tvShow.reviews.length})
          </h2>
        </div>

        <ReviewList reviews={tvShow.reviews} onReviewsChanged={() => loadTVShow(tvShow.id)} />

        <ReviewForm contentId={tvShow.id} onReviewCreated={() => loadTVShow(tvShow.id)} />
      </div>

      {/* Edit TV Show Form */}
      {isEditOpen && (
        <EditTVShowForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          tvShow={tvShow}
          onTVShowUpdated={() => loadTVShow(tvShow.id)}
        />
      )}

      {/* Create Episode Form */}
      {isCreateEpisodeOpen && (
        <CreateEpisodeForm
          isOpen={isCreateEpisodeOpen}
          onClose={() => setIsCreateEpisodeOpen(false)}
          tvShowId={tvShow.id}
          onEpisodeCreated={() => {
            loadEpisodes(tvShow.id);
          }}
        />
      )}
    </div>
  );
}
