import { useState, useEffect } from "react";
import { X, Film, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { contentService, CreateFilmRequest } from "../../lib/content-service";
import type { Film as FilmType } from "../../lib/types/content";

interface EditFilmFormProps {
  isOpen: boolean;
  onClose: () => void;
  film: FilmType;
  onFilmUpdated: () => void;
}

export function EditFilmForm({ isOpen, onClose, film, onFilmUpdated }: EditFilmFormProps) {
  const [formData, setFormData] = useState<CreateFilmRequest>({
    Title: "",
    Description: "",
    ReleaseDate: "",
    ReleaseYear: new Date().getFullYear(),
    ImageUrl: "",
    ExternalId: "",
    FilmDirector: "",
    FilmWriters: "",
    FilmMainCast: "",
    FilmBudget: 0,
    FilmBoxOffice: 0,
    FilmRuntimeInMinutes: 0,
    FilmCountryOfOrigin: "",
    FilmAwards: "",
    FilmGenres: "",
    AverageRating: 0,
    NumberOfRatings: 0,
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const filmGenres = [
    "Drama", "Comedy", "ScienceFiction", "Action", "Music", "TVMovie", "War",
    "Horror", "Fantasy", "Romance", "Detective", "Adventure", "Historical",
    "Thriller", "Musical", "Animation", "Documentary", "Family", "Western",
    "Crime", "Mystery", "History", "Other"
  ];

  useEffect(() => {
    if (film && isOpen) {
      const details = film.additionalDetails;
      const genres = details.genres || [];
      setSelectedGenres(genres);
      setFormData({
        Title: film.title,
        Description: film.description,
        ReleaseDate: film.releaseDate.split('T')[0],
        ReleaseYear: film.releaseYear,
        ImageUrl: film.imageUrl,
        ExternalId: "",
        FilmDirector: details.director,
        FilmWriters: details.writers || "",
        FilmMainCast: details.mainCast || "",
        FilmBudget: details.budget || 0,
        FilmBoxOffice: details.boxOffice || 0,
        FilmRuntimeInMinutes: details.runtimeInMinutes || 0,
        FilmCountryOfOrigin: details.countryOfOrigin || "",
        FilmAwards: details.awards || "",
        FilmGenres: genres.join(","),
        AverageRating: film.averageRating,
        NumberOfRatings: film.numberOfRatings,
      });
    }
  }, [film, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateFilmRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => {
      const newGenres = prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre];
      setFormData((prevData) => ({ ...prevData, FilmGenres: newGenres.join(",") }));
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
      await contentService.updateFilm(film.id, formData);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onFilmUpdated();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Помилка оновлення фільму:", err);
      setError(err.message || "Помилка оновлення фільму");
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
          <Film className="size-8 text-blue-500" />
          <h2 className="text-3xl font-light text-white tracking-tight">
            Редагувати фільм
          </h2>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
            <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-400 font-light">Фільм успішно оновлено!</p>
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
                placeholder="Назва фільму"
                required
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Опис *</label>
              <textarea
                value={formData.Description}
                onChange={(e) => handleChange("Description", e.target.value)}
                placeholder="Опис фільму"
                required
                rows={4}
                className="w-full px-3 py-2 bg-zinc-950/50 border border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Режисер *</label>
              <Input
                type="text"
                value={formData.FilmDirector}
                onChange={(e) => handleChange("FilmDirector", e.target.value)}
                placeholder="Ім'я режисера"
                required
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Сценаристи</label>
              <Input
                type="text"
                value={formData.FilmWriters}
                onChange={(e) => handleChange("FilmWriters", e.target.value)}
                placeholder="Сценаристи"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Головні актори</label>
              <Input
                type="text"
                value={formData.FilmMainCast}
                onChange={(e) => handleChange("FilmMainCast", e.target.value)}
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
              <label className="text-sm text-zinc-400 font-light">Тривалість (хв)</label>
              <Input
                type="number"
                value={formData.FilmRuntimeInMinutes}
                onChange={(e) => handleChange("FilmRuntimeInMinutes", parseInt(e.target.value))}
                min="0"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Країна</label>
              <Input
                type="text"
                value={formData.FilmCountryOfOrigin}
                onChange={(e) => handleChange("FilmCountryOfOrigin", e.target.value)}
                placeholder="Країна"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Бюджет ($)</label>
              <Input
                type="number"
                value={formData.FilmBudget}
                onChange={(e) => handleChange("FilmBudget", parseInt(e.target.value))}
                min="0"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Касові збори ($)</label>
              <Input
                type="number"
                value={formData.FilmBoxOffice}
                onChange={(e) => handleChange("FilmBoxOffice", parseInt(e.target.value))}
                min="0"
                className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Жанри *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg max-h-60 overflow-y-auto">
                {filmGenres.map((genre) => (
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

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Нагороди</label>
              <Input
                type="text"
                value={formData.FilmAwards}
                onChange={(e) => handleChange("FilmAwards", e.target.value)}
                placeholder="Нагороди"
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
