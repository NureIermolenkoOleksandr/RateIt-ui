import { useState, useEffect } from "react";
import { X, Music, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { contentService, CreateMusicRequest } from "../../lib/content-service";
import type { Music as MusicType } from "../../lib/types/content";

interface EditMusicFormProps {
  isOpen: boolean;
  onClose: () => void;
  music: MusicType;
  onMusicUpdated: () => void;
}

export function EditMusicForm({ isOpen, onClose, music, onMusicUpdated }: EditMusicFormProps) {
  const [formData, setFormData] = useState<CreateMusicRequest>({
    Title: "",
    Description: "",
    ReleaseDate: "",
    ReleaseYear: new Date().getFullYear(),
    ImageUrl: "",
    ExternalId: "",
    MusicArtist: "",
    MusicAlbum: "",
    MusicLabel: "",
    MusicLanquage: "",
    MusicDurationInSeconds: 0,
    MusciGenres: "",
    AverageRating: 0,
    NumberOfRatings: 0,
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const musicGenres = [
    "Rock", "Pop", "HipHop", "Jazz", "Classical", "Electronic", "Country",
    "RnB", "Blues", "Reggae", "Metal", "Folk", "Latin", "Indie", "Soul",
    "Funk", "Punk", "Disco", "Alternative", "Gospel", "Other"
  ];

  useEffect(() => {
    if (music && isOpen) {
      const details = music.additionalDetails;
      const genres = details.genres || [];
      setSelectedGenres(genres);
      setFormData({
        Title: music.title,
        Description: music.description,
        ReleaseDate: music.releaseDate.split('T')[0],
        ReleaseYear: music.releaseYear,
        ImageUrl: music.imageUrl,
        ExternalId: "",
        MusicArtist: details.artist,
        MusicAlbum: details.album || "",
        MusicLabel: details.label || "",
        MusicLanquage: details.language || "",
        MusicDurationInSeconds: details.durationInSeconds || 0,
        MusciGenres: genres.join(","),
        AverageRating: music.averageRating,
        NumberOfRatings: music.numberOfRatings,
      });
    }
  }, [music, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateMusicRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => {
      const newGenres = prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre];
      setFormData((prevData) => ({ ...prevData, MusciGenres: newGenres.join(",") }));
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
      await contentService.updateMusic(music.id, formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onMusicUpdated();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Помилка оновлення музики");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl p-8 my-8">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"><X className="size-5" /></button>
        <div className="flex items-center gap-3 mb-8">
          <Music className="size-8 text-green-500" />
          <h2 className="text-3xl font-light text-white tracking-tight">Редагувати музику</h2>
        </div>
        {success && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3"><CheckCircle className="size-5 text-green-500 flex-shrink-0 mt-0.5" /><p className="text-sm text-green-400 font-light">Музику успішно оновлено!</p></div>}
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"><AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" /><p className="text-sm text-red-400 font-light">{error}</p></div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2"><label className="text-sm text-zinc-400 font-light">Назва *</label><Input type="text" value={formData.Title} onChange={(e) => handleChange("Title", e.target.value)} placeholder="Назва треку/альбому" required className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" /></div>
            <div className="space-y-2 md:col-span-2"><label className="text-sm text-zinc-400 font-light">Опис *</label><textarea value={formData.Description} onChange={(e) => handleChange("Description", e.target.value)} placeholder="Опис" required rows={4} className="w-full px-3 py-2 bg-zinc-950/50 border border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg resize-none" /></div>
            <div className="space-y-2"><label className="text-sm text-zinc-400 font-light">Виконавець *</label><Input type="text" value={formData.MusicArtist} onChange={(e) => handleChange("MusicArtist", e.target.value)} placeholder="Виконавець" required className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" /></div>
            <div className="space-y-2"><label className="text-sm text-zinc-400 font-light">Альбом</label><Input type="text" value={formData.MusicAlbum} onChange={(e) => handleChange("MusicAlbum", e.target.value)} placeholder="Альбом" className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" /></div>
            <div className="space-y-2"><label className="text-sm text-zinc-400 font-light">Лейбл</label><Input type="text" value={formData.MusicLabel} onChange={(e) => handleChange("MusicLabel", e.target.value)} placeholder="Лейбл" className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" /></div>
            <div className="space-y-2"><label className="text-sm text-zinc-400 font-light">Мова</label><Input type="text" value={formData.MusicLanquage} onChange={(e) => handleChange("MusicLanquage", e.target.value)} placeholder="Мова" className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" /></div>
            <div className="space-y-2"><label className="text-sm text-zinc-400 font-light">Тривалість (секунди)</label><Input type="number" value={formData.MusicDurationInSeconds} onChange={(e) => handleChange("MusicDurationInSeconds", parseInt(e.target.value) || 0)} min="0" className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" /></div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400 font-light">Жанри *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg max-h-60 overflow-y-auto">
                {musicGenres.map((genre) => (
                  <label key={genre} className="flex items-center gap-2 cursor-pointer hover:text-white text-zinc-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreToggle(genre)}
                      className="size-4 rounded border-zinc-700 bg-zinc-900 text-green-600 focus:ring-green-600 focus:ring-offset-0"
                    />
                    <span className="text-sm font-light">{genre}</span>
                  </label>
                ))}
              </div>
              {selectedGenres.length === 0 && (
                <p className="text-xs text-red-400 font-light">Оберіть хоча б один жанр</p>
              )}
            </div>
            <div className="space-y-2"><label className="text-sm text-zinc-400 font-light">Дата виходу *</label><Input type="date" value={formData.ReleaseDate} onChange={(e) => handleChange("ReleaseDate", e.target.value)} required className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" /></div>
            <div className="space-y-2"><label className="text-sm text-zinc-400 font-light">Рік випуску *</label><Input type="number" value={formData.ReleaseYear} onChange={(e) => handleChange("ReleaseYear", parseInt(e.target.value))} required min="1900" max="2100" className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" /></div>
            <div className="space-y-2 md:col-span-2"><label className="text-sm text-zinc-400 font-light">URL зображення *</label><Input type="text" value={formData.ImageUrl} onChange={(e) => handleChange("ImageUrl", e.target.value)} placeholder="https://..." required className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900 font-light rounded-lg">Скасувати</Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 text-white hover:bg-green-700 font-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Оновлення..." : "Зберегти зміни"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
