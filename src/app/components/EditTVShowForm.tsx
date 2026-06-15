import { useState, useEffect } from "react";
import { X, Tv, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { contentService, CreateTVShowRequest } from "../../lib/content-service";
import type { TVShow } from "../../lib/types/content";

interface EditTVShowFormProps {
  isOpen: boolean;
  onClose: () => void;
  tvShow: TVShow;
  onTVShowUpdated: () => void;
}

export function EditTVShowForm({ isOpen, onClose, tvShow, onTVShowUpdated }: EditTVShowFormProps) {
  const [formData, setFormData] = useState<CreateTVShowRequest>({
    Title: "",
    Description: "",
    ReleaseDate: "",
    ReleaseYear: new Date().getFullYear(),
    ImageUrl: "",
    ExternalId: "",
    TVShowDirector: "",
    TVShowCreators: "",
    TVShowMainCast: "",
    TVShowTotalSeasons: 0,
    TVShowTotalEpisodes: 0,
    TVShowNetworks: "",
    TVShowEndDate: "",
    TVShowGenres: "",
    AverageRating: 0,
    NumberOfRatings: 0,
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const tvShowGenres = [
    "Drama", "Comedy", "ScienceFiction", "Action", "Music", "TVMovie", "War",
    "Horror", "Fantasy", "Romance", "Detective", "Adventure", "Historical",
    "Thriller", "Musical", "Animation", "Documentary", "Family", "Western",
    "Crime", "Mystery", "History", "Other"
  ];

  useEffect(() => {
    if (tvShow && isOpen) {
      const details = tvShow.additionalDetails;
      const genres = details.genres || [];
      setSelectedGenres(genres);
      setFormData({
        Title: tvShow.title,
        Description: tvShow.description,
        ReleaseDate: tvShow.releaseDate.split('T')[0],
        ReleaseYear: tvShow.releaseYear,
        ImageUrl: tvShow.imageUrl,
        ExternalId: "",
        TVShowDirector: details.director || "",
        TVShowCreators: details.creators || "",
        TVShowMainCast: details.mainCast || "",
        TVShowTotalSeasons: details.totalSeasons || 0,
        TVShowTotalEpisodes: details.totalEpisodes || 0,
        TVShowNetworks: details.networks || "",
        TVShowEndDate: details.endDate ? details.endDate.split('T')[0] : "",
        TVShowGenres: genres.join(","),
        AverageRating: tvShow.averageRating,
        NumberOfRatings: tvShow.numberOfRatings,
      });
    }
  }, [tvShow, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateTVShowRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => {
      const newGenres = prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre];
      setFormData((prevData) => ({ ...prevData, TVShowGenres: newGenres.join(",") }));
      return newGenres;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGenres.length === 0) {
      setError("Оберіть хоча б один жанр");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await contentService.updateTVShow(tvShow.id, formData);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onTVShowUpdated();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Помилка оновлення серіалу:", err);
      setError(err.message || "Помилка оновлення серіалу");
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
            Редагувати серіал
          </h2>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
            <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-400 font-light">Серіал успішно оновлено!</p>
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
                placeholder="Назва серіалу"
                required
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Опис *</label>
              <textarea
                value={formData.Description}
                onChange={(e) => handleChange("Description", e.target.value)}
                placeholder="Опис серіалу"
                required
                rows={4}
                className="w-full px-3 py-2 bg-zinc-950/50 border border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Режисер *</label>
              <Input
                type="text"
                value={formData.TVShowDirector}
                onChange={(e) => handleChange("TVShowDirector", e.target.value)}
                placeholder="Ім'я режисера"
                required
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Автори</label>
              <Input
                type="text"
                value={formData.TVShowCreators}
                onChange={(e) => handleChange("TVShowCreators", e.target.value)}
                placeholder="Автори"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Головні актори</label>
              <Input
                type="text"
                value={formData.TVShowMainCast}
                onChange={(e) => handleChange("TVShowMainCast", e.target.value)}
                placeholder="Актори (через кому)"
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
              <label className="text-sm text-zinc-400 font-light">Дата завершення</label>
              <Input
                type="date"
                value={formData.TVShowEndDate}
                onChange={(e) => handleChange("TVShowEndDate", e.target.value)}
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Мережі</label>
              <Input
                type="text"
                value={formData.TVShowNetworks}
                onChange={(e) => handleChange("TVShowNetworks", e.target.value)}
                placeholder="Мережі"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Кількість сезонів</label>
              <Input
                type="number"
                value={formData.TVShowTotalSeasons}
                onChange={(e) => handleChange("TVShowTotalSeasons", parseInt(e.target.value))}
                min="0"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Кількість епізодів</label>
              <Input
                type="number"
                value={formData.TVShowTotalEpisodes}
                onChange={(e) => handleChange("TVShowTotalEpisodes", parseInt(e.target.value))}
                min="0"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Жанри *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg max-h-60 overflow-y-auto">
                {tvShowGenres.map((genre) => (
                  <label key={genre} className="flex items-center gap-2 cursor-pointer hover:text-white text-zinc-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreToggle(genre)}
                      className="size-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-600 focus:ring-offset-0"
                    />
                    <span className="text-sm font-light">{genre}</span>
                  </label>
                ))}
              </div>
              {selectedGenres.length === 0 && (
                <p className="text-xs text-red-400 font-light">Оберіть хоча б один жанр</p>
              )}
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
