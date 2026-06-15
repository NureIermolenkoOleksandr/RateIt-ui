import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userService, Achievement } from "../../lib/user-service";
import { authService } from "../../lib/auth-service";
import { Loader2, Award, Trophy } from "lucide-react";

export function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAchievements() {
      if (!authService.isAuthenticated()) {
        navigate("/");
        return;
      }

      try {
        const data = await userService.getAchievements();
        setAchievements(data);
      } catch (err: any) {
        console.error("Помилка завантаження досягнень:", err);
        setError("Не вдалося завантажити досягнення");
      } finally {
        setIsLoading(false);
      }
    }

    loadAchievements();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="size-12 text-zinc-600 animate-spin mb-4" />
        <p className="text-zinc-400 text-lg font-light">Завантаження досягнень...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-400 text-lg font-light">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="size-8 text-yellow-500" />
        <h1 className="text-4xl text-white font-light tracking-tight">
          Мої досягнення
        </h1>
      </div>

      {/* Achievements Grid */}
      {achievements.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <Award className="size-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 text-lg font-light">
            У вас поки що немає досягнень
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-yellow-500/10"
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-4">
                {achievement.imageUrl ? (
                  <img
                    src={achievement.imageUrl}
                    alt={achievement.name}
                    className="size-20 object-contain"
                  />
                ) : (
                  <div className="size-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <Award className="size-10 text-white" />
                  </div>
                )}
              </div>

              {/* Badge Title */}
              {achievement.badgeTitle && (
                <div className="text-center mb-2">
                  <span className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs text-yellow-500 font-light">
                    {achievement.badgeTitle}
                  </span>
                </div>
              )}

              {/* Name */}
              <h3 className="text-xl text-white font-light text-center mb-2">
                {achievement.name}
              </h3>

              {/* Description */}
              <p className="text-zinc-400 text-sm font-light text-center">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
