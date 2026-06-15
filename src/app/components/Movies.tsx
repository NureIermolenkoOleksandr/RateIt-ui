import { useState, useEffect } from "react";
import { ContentCard } from "./ContentCard";
import { Film, Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { contentService } from "../../lib/content-service";
import type { Film as FilmType } from "../../lib/types/content";

export function Movies() {
  const [movies, setMovies] = useState<FilmType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchMovies(searchQuery);
      } else {
        loadMovies();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const films = await contentService.getFilms();
      setMovies(films);
    } catch (err) {
      console.error("Помилка завантаження фільмів:", err);
      setError("Не вдалося завантажити фільми");
    } finally {
      setIsLoading(false);
    }
  };

  const searchMovies = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const films = await contentService.getFilms(query);
      setMovies(films);
    } catch (err) {
      console.error("Помилка пошуку фільмів:", err);
      setError("Не вдалося знайти фільми");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center">
          <Film className="size-10 text-white opacity-60" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-extralight text-white mb-3 tracking-tight">Фільми</h1>
          <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto">
            Оцінюйте улюблені фільми та відкривайте нові кіношедеври
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-600" />
          <Input
            type="text"
            placeholder="Пошук фільмів..."
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
          <p className="text-zinc-500 text-lg font-light">Завантаження фільмів...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg font-light mb-4">{error}</p>
          <button
            onClick={loadMovies}
            className="text-zinc-400 hover:text-white transition-colors font-light"
          >
            Спробувати знову
          </button>
        </div>
      )}

      {/* Movies Grid */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <ContentCard
                key={movie.id}
                id={movie.id.toString()}
                title={movie.title}
                description={movie.description}
                image={movie.imageUrl}
                rating={movie.averageRating}
                detailPath={`/movies/${movie.id}`}
              />
            ))}
          </div>

          {movies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg font-light">
                {searchQuery ? "Фільмів за вашим запитом не знайдено" : "Фільмів не знайдено"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}