import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { adminService } from "../../lib/admin-service";
import { Loader2, Shield } from "lucide-react";
import { AddContentPanel } from "../components/AddContentPanel";
import { StatisticsPanel } from "../components/StatisticsPanel";
import { CreateFilmForm } from "../components/CreateFilmForm";
import { CreateMusicForm } from "../components/CreateMusicForm";
import { CreateGameForm } from "../components/CreateGameForm";
import { CreateBookForm } from "../components/CreateBookForm";
import { CreateTVShowForm } from "../components/CreateTVShowForm";

export function ModeratorPanelPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreateFilmOpen, setIsCreateFilmOpen] = useState(false);
  const [isCreateMusicOpen, setIsCreateMusicOpen] = useState(false);
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [isCreateBookOpen, setIsCreateBookOpen] = useState(false);
  const [isCreateTVShowOpen, setIsCreateTVShowOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAccess() {
      try {
        const hasAccess = await adminService.isAdmin();
        setIsAdmin(hasAccess);

        if (!hasAccess) {
          // Якщо немає доступу, перенаправляємо на головну
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (error) {
        console.error("Помилка перевірки доступу:", error);
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="size-12 text-zinc-600 animate-spin mb-4" />
        <p className="text-zinc-400 text-lg font-light">Перевірка прав доступу...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-400 text-lg font-light mb-2">У вас немає прав доступу до цієї сторінки</p>
        <p className="text-zinc-500 text-sm font-light">Перенаправлення на головну...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield className="size-8 text-blue-500" />
        <h1 className="text-4xl text-white font-light tracking-tight">
          Панель модератора
        </h1>
      </div>

      {/* Panels */}
      <div className="space-y-6">
        {/* Add Content Panel */}
        <AddContentPanel
          onAddFilm={() => setIsCreateFilmOpen(true)}
          onAddTVShow={() => setIsCreateTVShowOpen(true)}
          onAddMusic={() => setIsCreateMusicOpen(true)}
          onAddGame={() => setIsCreateGameOpen(true)}
          onAddBook={() => setIsCreateBookOpen(true)}
        />

        {/* Statistics Panel */}
        <StatisticsPanel />
      </div>

      {/* Create Forms */}
      <CreateFilmForm
        isOpen={isCreateFilmOpen}
        onClose={() => setIsCreateFilmOpen(false)}
      />
      <CreateMusicForm
        isOpen={isCreateMusicOpen}
        onClose={() => setIsCreateMusicOpen(false)}
      />
      <CreateGameForm
        isOpen={isCreateGameOpen}
        onClose={() => setIsCreateGameOpen(false)}
      />
      <CreateBookForm
        isOpen={isCreateBookOpen}
        onClose={() => setIsCreateBookOpen(false)}
      />
      <CreateTVShowForm
        isOpen={isCreateTVShowOpen}
        onClose={() => setIsCreateTVShowOpen(false)}
      />
    </div>
  );
}