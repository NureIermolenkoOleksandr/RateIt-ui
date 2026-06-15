import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Users, Tag, Loader2 } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { ModeratorActions } from "./ModeratorActions";
import { EditMusicForm } from "./EditMusicForm";
import { contentService } from "../../lib/content-service";
import type { Music } from "../../lib/types/content";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./ImageWithFallback";

export function MusicDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [music, setMusic] = useState<Music | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadMusic(parseInt(id));
    }
  }, [id]);

  const loadMusic = async (musicId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const musicData = await contentService.getMusicById(musicId);
      setMusic(musicData);
    } catch (err) {
      console.error("Помилка завантаження музики:", err);
      setError("Не вдалося завантажити музику");
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

  if (error || !music) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 text-lg mb-6 font-light">{error || "Музику не знайдено"}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900">
          Повернутися назад
        </Button>
      </div>
    );
  }

  const details = music.additionalDetails;

  return (
    <div className="space-y-12">
      <Button onClick={() => navigate(-1)} variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-light">
        <ArrowLeft className="size-4 mr-2" />
        Назад до музики
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="rounded-2xl overflow-hidden border border-zinc-800/50 sticky top-24 bg-zinc-900">
            <ImageWithFallback src={music.imageUrl} alt={music.title} className="w-full aspect-square object-cover" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-extralight text-white tracking-tight">{music.title}</h1>
            <p className="text-xl text-zinc-400 leading-relaxed font-light">{music.description}</p>
          </div>

          <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800/50">
            <div>
              <p className="text-sm text-zinc-600 mb-3 font-light">Середня оцінка</p>
              <span className="text-5xl font-extralight text-white">
                {music.averageRating > 0 ? music.averageRating.toFixed(1) : "—"}
              </span>
              <p className="text-sm text-zinc-600 mt-2 font-light">
                {music.numberOfRatings} оцінок
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Виконавець</span>
              </div>
              <p className="text-white font-light">{details.artist}</p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Альбом</span>
              </div>
              <p className="text-white font-light">{details.album}</p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Дата виходу</span>
              </div>
              <p className="text-white font-light">
                {new Date(music.releaseDate).toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Тривалість</span>
              </div>
              <p className="text-white font-light">
                {Math.floor(details.durationInSeconds / 60)}:{(details.durationInSeconds % 60).toString().padStart(2, '0')}
              </p>
            </div>
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
            contentId={music.id}
            contentTitle={music.title}
            onEdit={() => setIsEditOpen(true)}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-white tracking-tight">
            Відгуки ({music.reviews.length})
          </h2>
        </div>

        <ReviewList reviews={music.reviews} onReviewsChanged={() => loadMusic(music.id)} />

        <ReviewForm contentId={music.id} onReviewCreated={() => loadMusic(music.id)} />
      </div>

      {/* Edit Music Form */}
      {isEditOpen && (
        <EditMusicForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          music={music}
          onMusicUpdated={() => loadMusic(music.id)}
        />
      )}
    </div>
  );
}
