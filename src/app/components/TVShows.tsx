import { useState, useEffect } from "react";
import { ContentCard } from "./ContentCard";
import { Tv, Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { contentService } from "../../lib/content-service";
import type { TVShow } from "../../lib/types/content";

export function TVShows() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTVShows();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchTVShows(searchQuery);
      } else {
        loadTVShows();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadTVShows = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const shows = await contentService.getTVShows();
      setTVShows(shows);
    } catch (err) {
      console.error("Помилка завантаження серіалів:", err);
      setError("Не вдалося завантажити серіали");
    } finally {
      setIsLoading(false);
    }
  };

  const searchTVShows = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const shows = await contentService.getTVShows(query);
      setTVShows(shows);
    } catch (err) {
      console.error("Помилка пошуку серіалів:", err);
      setError("Не вдалося знайти серіали");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center">
          <Tv className="size-10 text-white opacity-60" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-extralight text-white mb-3 tracking-tight">Серіали</h1>
          <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto">
            Оцінюйте улюблені серіали та кожен епізод окремо
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-600" />
          <Input
            type="text"
            placeholder="Пошук серіалів..."
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
          <p className="text-zinc-500 text-lg font-light">Завантаження серіалів...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg font-light mb-4">{error}</p>
          <button
            onClick={loadTVShows}
            className="text-zinc-400 hover:text-white transition-colors font-light"
          >
            Спробувати знову
          </button>
        </div>
      )}

      {/* TV Shows Grid */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {tvShows.map((show) => (
              <ContentCard
                key={show.id}
                id={show.id.toString()}
                title={show.title}
                description={show.description}
                image={show.imageUrl}
                rating={show.averageRating}
                detailPath={`/tvshows/${show.id}`}
              />
            ))}
          </div>

          {tvShows.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg font-light">
                {searchQuery ? "Серіалів за вашим запитом не знайдено" : "Серіалів не знайдено"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
