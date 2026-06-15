import { useState, useEffect } from "react";
import { ContentCard } from "./ContentCard";
import { Gamepad2, Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { contentService } from "../../lib/content-service";
import type { Game } from "../../lib/types/content";

export function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchGames(searchQuery);
      } else {
        loadGames();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadGames = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const items = await contentService.getGames();
      setGames(items);
    } catch (err) {
      console.error("Помилка завантаження ігор:", err);
      setError("Не вдалося завантажити ігри");
    } finally {
      setIsLoading(false);
    }
  };

  const searchGames = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const items = await contentService.getGames(query);
      setGames(items);
    } catch (err) {
      console.error("Помилка пошуку ігор:", err);
      setError("Не вдалося знайти ігри");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center">
          <Gamepad2 className="size-10 text-white opacity-60" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-extralight text-white mb-3 tracking-tight">Ігри</h1>
          <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto">
            Оцінюйте улюблені ігри та відкривайте нові
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-600" />
          <Input
            type="text"
            placeholder="Пошук ігор..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-zinc-900/50 border-zinc-800/50 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-xl"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-10 text-zinc-600 animate-spin mb-4" />
          <p className="text-zinc-500 text-lg font-light">Завантаження ігор...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg font-light mb-4">{error}</p>
          <button
            onClick={loadGames}
            className="text-zinc-400 hover:text-white transition-colors font-light"
          >
            Спробувати знову
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {games.map((game) => (
              <ContentCard
                key={game.id}
                id={game.id.toString()}
                title={game.title}
                description={game.description}
                image={game.imageUrl}
                rating={game.averageRating}
                detailPath={`/games/${game.id}`}
              />
            ))}
          </div>

          {games.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg font-light">
                {searchQuery ? "Ігор за вашим запитом не знайдено" : "Ігор не знайдено"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
