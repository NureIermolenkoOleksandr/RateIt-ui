import { useState, useEffect } from "react";
import { X, Tv, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { contentService, CreateEpisodeRequest } from "../../lib/content-service";
import type { Episode } from "../../lib/types/content";

interface EditEpisodeFormProps {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode;
  onEpisodeUpdated: () => void;
}

export function EditEpisodeForm({ isOpen, onClose, episode, onEpisodeUpdated }: EditEpisodeFormProps) {
  const [formData, setFormData] = useState<CreateEpisodeRequest>({
    Title: "",
    Description: "",
    ReleaseDate: "",
    ReleaseYear: new Date().getFullYear(),
    ImageUrl: "",
    ExternalId: "",
    EpisodeTVShowId: 0,
    EpisodeSeasonNumber: 1,
    EpisodeNumber: 1,
    EpisodeRuntimeInMinutes: 0,
    EpisodesTotalNumber: 0,
    AverageRating: 0,
    NumberOfRatings: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (episode && isOpen) {
      const details = episode.additionalDetails;
      setFormData({
        Title: episode.title,
        Description: episode.description,
        ReleaseDate: episode.releaseDate.split('T')[0],
        ReleaseYear: episode.releaseYear,
        ImageUrl: episode.imageUrl,
        ExternalId: "",
        EpisodeTVShowId: details.tvShowId,
        EpisodeSeasonNumber: details.seasonNumber,
        EpisodeNumber: details.episodeNumber,
        EpisodeRuntimeInMinutes: details.runtimeInMinutes,
        EpisodesTotalNumber: details.totalNumber || 0,
        AverageRating: episode.averageRating,
        NumberOfRatings: episode.numberOfRatings,
      });
    }
  }, [episode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateEpisodeRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await contentService.updateEpisode(episode.id, formData);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onEpisodeUpdated();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Помилка оновлення епізоду:", err);
      setError(err.message || "Помилка оновлення епізоду");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl p-8 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Tv className="size-8 text-blue-500" />
          <h2 className="text-3xl font-light text-white tracking-tight">
            Редагувати епізод
          </h2>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
            <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-400 font-light">Епізод успішно оновлено!</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400 font-light">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Назва *</label>
              <Input
                type="text"
                value={formData.Title}
                onChange={(e) => handleChange("Title", e.target.value)}
                placeholder="Назва епізоду"
                required
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Опис *</label>
              <textarea
                value={formData.Description}
                onChange={(e) => handleChange("Description", e.target.value)}
                placeholder="Опис епізоду"
                required
                rows={4}
                className="w-full px-3 py-2 bg-zinc-950/50 border border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Номер сезону *</label>
              <Input
                type="number"
                value={formData.EpisodeSeasonNumber}
                onChange={(e) => handleChange("EpisodeSeasonNumber", parseInt(e.target.value))}
                required
                min="1"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Номер епізоду *</label>
              <Input
                type="number"
                value={formData.EpisodeNumber}
                onChange={(e) => handleChange("EpisodeNumber", parseInt(e.target.value))}
                required
                min="1"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Дата виходу *</label>
              <Input
                type="date"
                value={formData.ReleaseDate}
                onChange={(e) => handleChange("ReleaseDate", e.target.value)}
                required
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Рік випуску *</label>
              <Input
                type="number"
                value={formData.ReleaseYear}
                onChange={(e) => handleChange("ReleaseYear", parseInt(e.target.value))}
                required
                min="1900"
                max="2100"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Тривалість (хв) *</label>
              <Input
                type="number"
                value={formData.EpisodeRuntimeInMinutes}
                onChange={(e) => handleChange("EpisodeRuntimeInMinutes", parseInt(e.target.value))}
                required
                min="1"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">URL зображення *</label>
              <Input
                type="text"
                value={formData.ImageUrl}
                onChange={(e) => handleChange("ImageUrl", e.target.value)}
                placeholder="https://..."
                required
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-zinc-800 text-white hover:bg-zinc-900 font-light rounded-lg"
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700 font-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Оновлення..." : "Зберегти зміни"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
