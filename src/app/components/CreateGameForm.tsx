import { useState } from "react";
import { X, Gamepad2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { contentService, CreateGameRequest } from "../../lib/content-service";

interface CreateGameFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGameForm({ isOpen, onClose }: CreateGameFormProps) {
  const [formData, setFormData] = useState<CreateGameRequest>({
    Title: "",
    Description: "",
    ReleaseDate: "",
    ReleaseYear: new Date().getFullYear(),
    ImageUrl: "",
    ExternalId: "",
    GameDeveloper: "",
    GamePublisher: "",
    GamePlatforms: "",
    GameGenres: "",
    AverageRating: 0,
    NumberOfRatings: 0,
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const gameGenres = [
    "Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Racing",
    "Fighting", "Puzzle", "Platformer", "Shooter", "Horror", "Survival", "Stealth",
    "MMORPG", "MOBA", "BattleRoyale", "Casual", "Educational", "Music", "Other"
  ];

  const gamePlatforms = [
    "PC", "PlayStation", "Xbox", "NintendoSwitch", "Mobile", "Linux", "Mac",
    "VR", "Cloud", "Other"
  ];

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateGameRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => {
      const newGenres = prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre];
      setFormData((prevData) => ({ ...prevData, GameGenres: newGenres.join(",") }));
      return newGenres;
    });
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) => {
      const newPlatforms = prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform];
      setFormData((prevData) => ({ ...prevData, GamePlatforms: newPlatforms.join(",") }));
      return newPlatforms;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGenres.length === 0) {
      setError("Оберіть хоча б один жанр");
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError("Оберіть хоча б одну платформу");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await contentService.createGame(formData);
      setSuccess(true);

      setTimeout(() => {
        setFormData({
          Title: "",
          Description: "",
          ReleaseDate: "",
          ReleaseYear: new Date().getFullYear(),
          ImageUrl: "",
          ExternalId: "",
          GameDeveloper: "",
          GamePublisher: "",
          GamePlatforms: "",
          GameGenres: "",
          AverageRating: 0,
          NumberOfRatings: 0,
        });
        setSelectedGenres([]);
        setSelectedPlatforms([]);
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Помилка створення гри:", err);
      setError(err.message || "Помилка створення гри");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl p-8 my-8">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Gamepad2 className="size-8 text-orange-500" />
          <h2 className="text-3xl font-light text-white tracking-tight">Додати гру</h2>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
            <CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-400 font-light">Гру успішно створено!</p>
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
              <Input type="text" value={formData.Title} onChange={(e) => handleChange("Title", e.target.value)} placeholder="Назва гри" required className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Опис *</label>
              <textarea value={formData.Description} onChange={(e) => handleChange("Description", e.target.value)} placeholder="Опис" required rows={4} className="w-full px-3 py-2 bg-zinc-950/50 border border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Розробник *</label>
              <Input type="text" value={formData.GameDeveloper} onChange={(e) => handleChange("GameDeveloper", e.target.value)} placeholder="Розробник" required className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Видавець</label>
              <Input type="text" value={formData.GamePublisher} onChange={(e) => handleChange("GamePublisher", e.target.value)} placeholder="Видавець" className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Платформи *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg max-h-60 overflow-y-auto">
                {gamePlatforms.map((platform) => (
                  <label key={platform} className="flex items-center gap-2 cursor-pointer hover:text-white text-zinc-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform)}
                      onChange={() => handlePlatformToggle(platform)}
                      className="size-4 rounded border-zinc-700 bg-zinc-900 text-orange-600 focus:ring-orange-600 focus:ring-offset-0"
                    />
                    <span className="text-sm font-light">{platform}</span>
                  </label>
                ))}
              </div>
              {selectedPlatforms.length === 0 && (
                <p className="text-xs text-red-400 font-light">Оберіть хоча б одну платформу</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Жанри *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg max-h-60 overflow-y-auto">
                {gameGenres.map((genre) => (
                  <label key={genre} className="flex items-center gap-2 cursor-pointer hover:text-white text-zinc-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreToggle(genre)}
                      className="size-4 rounded border-zinc-700 bg-zinc-900 text-orange-600 focus:ring-orange-600 focus:ring-offset-0"
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
              <label className="text-sm text-zinc-400 font-light">Дата виходу *</label>
              <Input type="date" value={formData.ReleaseDate} onChange={(e) => handleChange("ReleaseDate", e.target.value)} required className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 font-light">Рік випуску *</label>
              <Input type="number" value={formData.ReleaseYear} onChange={(e) => handleChange("ReleaseYear", parseInt(e.target.value))} required min="1900" max="2100" className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">URL зображення *</label>
              <Input type="text" value={formData.ImageUrl} onChange={(e) => handleChange("ImageUrl", e.target.value)} placeholder="https://..." required className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900 font-light rounded-lg">Скасувати</Button>
            <Button type="submit" disabled={isLoading} className="bg-orange-600 text-white hover:bg-orange-700 font-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Створення..." : "Створити гру"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
