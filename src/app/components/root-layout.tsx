import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Film, Music, Gamepad2, BookOpen, Star, Info, Tv, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "./AuthModal";
import { EditProfileModal } from "./EditProfileModal";
import { ProfileMenu } from "./ProfileMenu";
import { Button } from "./ui/button";
import { authService } from "../../lib/auth-service";

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    window.location.reload();
  };

  const navItems = [
    { path: "/", label: "Головна", icon: Star },
    { path: "/search", label: "Пошук", icon: Search },
    { path: "/movies", label: "Фільми", icon: Film },
    { path: "/tvshows", label: "Серіали", icon: Tv },
    { path: "/music", label: "Музика", icon: Music },
    { path: "/games", label: "Ігри", icon: Gamepad2 },
    { path: "/books", label: "Книги", icon: BookOpen },
    { path: "/about", label: "Про нас", icon: Info },
  ];

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800/50 sticky top-0 z-50 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Star className="size-6 text-white transition-transform group-hover:scale-110" />
                <Star className="size-6 text-white absolute inset-0 blur-sm opacity-50" />
              </div>
              <h1 className="text-xl font-light tracking-wide text-white">RateIt</h1>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === "/" 
                  ? location.pathname === "/" 
                  : location.pathname.startsWith(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-light text-sm ${
                      isActive
                        ? "text-white bg-zinc-800/50"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <ProfileMenu
                  onEditProfile={() => setIsEditProfileOpen(true)}
                  onMyReviews={() => navigate("/my-reviews")}
                  onAchievements={() => navigate("/achievements")}
                  onModeratorPanel={() => navigate("/moderator")}
                  onLogout={handleLogout}
                />
              ) : (
                <>
                  <Button
                    onClick={() => openAuthModal("login")}
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-light hidden md:inline-flex"
                  >
                    Вхід
                  </Button>
                  <Button
                    onClick={() => openAuthModal("register")}
                    className="bg-white text-black hover:bg-zinc-200 font-light h-9 px-4 rounded-lg hidden md:inline-flex"
                  >
                    Реєстрація
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center justify-around pb-4 border-t border-zinc-800/30 mt-4 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === "/" 
                ? location.pathname === "/" 
                : location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1.5 px-2 py-2 transition-all ${
                    isActive
                      ? "text-white"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-xs font-light">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="md:hidden flex items-center gap-2 pb-4">
            <Button
              onClick={() => openAuthModal("login")}
              variant="ghost"
              className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-light h-10 rounded-lg"
            >
              Вхід
            </Button>
            <Button
              onClick={() => openAuthModal("register")}
              className="flex-1 bg-white text-black hover:bg-zinc-200 font-light h-10 rounded-lg"
            >
              Реєстрація
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-24">
        <div className="container mx-auto px-6 lg:px-8 py-8 text-center text-zinc-500 text-sm font-light">
          © 2026 RateIt
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={switchAuthMode}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
}
