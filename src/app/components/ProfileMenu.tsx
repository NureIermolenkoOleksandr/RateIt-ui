import { useState, useRef, useEffect } from "react";
import { User, Edit, MessageSquare, LogOut, Shield, Award } from "lucide-react";
import { Button } from "./ui/button";
import { adminService } from "../../lib/admin-service";

interface ProfileMenuProps {
  onEditProfile: () => void;
  onMyReviews: () => void;
  onAchievements: () => void;
  onModeratorPanel: () => void;
  onLogout: () => void;
}

export function ProfileMenu({ onEditProfile, onMyReviews, onAchievements, onModeratorPanel, onLogout }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkAdmin() {
      const adminStatus = await adminService.isAdmin();
      setIsAdmin(adminStatus);
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-light hidden md:inline-flex"
      >
        <User className="size-4 mr-2" />
        Профіль
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="py-1">
            <button
              onClick={() => handleItemClick(onEditProfile)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors font-light"
            >
              <Edit className="size-4" />
              Редагувати профіль
            </button>
            <button
              onClick={() => handleItemClick(onMyReviews)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors font-light"
            >
              <MessageSquare className="size-4" />
              Мої відгуки
            </button>
            <button
              onClick={() => handleItemClick(onAchievements)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors font-light"
            >
              <Award className="size-4" />
              Досягнення
            </button>
            {isAdmin && (
              <>
                <div className="h-px bg-zinc-800 my-1" />
                <button
                  onClick={() => handleItemClick(onModeratorPanel)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-zinc-900 transition-colors font-light"
                >
                  <Shield className="size-4" />
                  Панель модератора
                </button>
              </>
            )}
            <div className="h-px bg-zinc-800 my-1" />
            <button
              onClick={() => handleItemClick(onLogout)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-900 transition-colors font-light"
            >
              <LogOut className="size-4" />
              Вийти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
