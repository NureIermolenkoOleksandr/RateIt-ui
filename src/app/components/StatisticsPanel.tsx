import { useEffect, useState } from "react";
import { contentService } from "../../lib/content-service";
import { Film, Music, Gamepad2, Book, Tv, TrendingUp, Loader2 } from "lucide-react";

interface ContentStats {
  films: number;
  tvShows: number;
  music: number;
  games: number;
  books: number;
  total: number;
}

export function StatisticsPanel() {
  const [stats, setStats] = useState<ContentStats>({
    films: 0,
    tvShows: 0,
    music: 0,
    games: 0,
    books: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        
        // Завантажуємо контент кожного типу
        const [films, tvShows, music, games, books] = await Promise.all([
          contentService.getFilms(),
          contentService.getTVShows(),
          contentService.getMusic(),
          contentService.getGames(),
          contentService.getBooks(),
        ]);

        const newStats = {
          films: films.length,
          tvShows: tvShows.length,
          music: music.length,
          games: games.length,
          books: books.length,
          total: films.length + tvShows.length + music.length + games.length + books.length,
        };

        setStats(newStats);
      } catch (error) {
        console.error("Помилка завантаження статистики:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl text-white font-light tracking-tight mb-6">
          Статистика платформи
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 text-zinc-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
      <h2 className="text-2xl text-white font-light tracking-tight mb-6">
        Статистика платформи
      </h2>
      <p className="text-zinc-400 text-sm font-light mb-6">
        Загальна кількість контенту на платформі
      </p>

      {/* Загальна статистика */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <TrendingUp className="size-5 text-blue-400" />
          </div>
          <span className="text-zinc-400 font-light">Всього контенту</span>
        </div>
        <p className="text-4xl text-white font-light tracking-tight">{stats.total}</p>
      </div>

      {/* Детальна статистика по категоріям */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Film className="size-4 text-blue-500" />
            </div>
            <span className="text-zinc-400 text-sm font-light">Фільми</span>
          </div>
          <p className="text-2xl text-white font-light">{stats.films}</p>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Tv className="size-4 text-purple-500" />
            </div>
            <span className="text-zinc-400 text-sm font-light">Серіали</span>
          </div>
          <p className="text-2xl text-white font-light">{stats.tvShows}</p>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Music className="size-4 text-green-500" />
            </div>
            <span className="text-zinc-400 text-sm font-light">Музика</span>
          </div>
          <p className="text-2xl text-white font-light">{stats.music}</p>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Gamepad2 className="size-4 text-orange-500" />
            </div>
            <span className="text-zinc-400 text-sm font-light">Ігри</span>
          </div>
          <p className="text-2xl text-white font-light">{stats.games}</p>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Book className="size-4 text-yellow-500" />
            </div>
            <span className="text-zinc-400 text-sm font-light">Книги</span>
          </div>
          <p className="text-2xl text-white font-light">{stats.books}</p>
        </div>
      </div>
    </div>
  );
}
