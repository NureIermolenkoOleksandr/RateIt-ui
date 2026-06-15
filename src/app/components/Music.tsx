import { useState, useEffect } from "react";
import { ContentCard } from "./ContentCard";
import { Music as MusicIcon, Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { contentService } from "../../lib/content-service";
import type { Music as MusicType } from "../../lib/types/content";

export function Music() {
  const [music, setMusic] = useState<MusicType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMusic();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchMusic(searchQuery);
      } else {
        loadMusic();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadMusic = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const items = await contentService.getMusic();
      setMusic(items);
    } catch (err) {
      console.error("Помилка завантаження музики:", err);
      setError("Не вдалося завантажити музику");
    } finally {
      setIsLoading(false);
    }
  };

  const searchMusic = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const items = await contentService.getMusic(query);
      setMusic(items);
    } catch (err) {
      console.error("Помилка пошуку музики:", err);
      setError("Не вдалося знайти музику");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center">
          <MusicIcon className="size-10 text-white opacity-60" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-extralight text-white mb-3 tracking-tight">Музика</h1>
          <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto">
            Відкривайте нові альбоми та діліться враженнями про улюблену музику
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-600" />
          <Input
            type="text"
            placeholder="Пошук музики..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-zinc-900/50 border-zinc-800/50 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-xl"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-10 text-zinc-600 animate-spin mb-4" />
          <p className="text-zinc-500 text-lg font-light">Завантаження музики...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg font-light mb-4">{error}</p>
          <button
            onClick={loadMusic}
            className="text-zinc-400 hover:text-white transition-colors font-light"
          >
            Спробувати знову
          </button>
        </div>
      )}

      {/* Music Grid */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {music.map((item) => (
              <ContentCard
                key={item.id}
                id={item.id.toString()}
                title={item.title}
                description={item.description}
                image={item.imageUrl}
                rating={item.averageRating}
                detailPath={`/music/${item.id}`}
              />
            ))}
          </div>

          {music.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg font-light">
                {searchQuery ? "Музики за вашим запитом не знайдено" : "Музики не знайдено"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
