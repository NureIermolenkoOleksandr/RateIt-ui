import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Trash2, Edit, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { adminService } from "../../lib/admin-service";
import { contentService } from "../../lib/content-service";

interface ModeratorActionsProps {
  contentId: number;
  contentTitle: string;
  onEdit?: () => void;
}

export function ModeratorActions({ contentId, contentTitle, onEdit }: ModeratorActionsProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      const adminStatus = await adminService.isAdmin();
      setIsAdmin(adminStatus);
    }
    checkAdmin();
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await contentService.deleteContent(contentId);
      // Перенаправляємо на головну після успішного видалення
      navigate("/");
    } catch (error: any) {
      console.error("Помилка видалення:", error);
      alert(error.message || "Помилка видалення контенту");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <div className="flex gap-3 mt-8 pt-8 border-t border-zinc-800">
        <Button
          onClick={() => setShowDeleteConfirm(true)}
          variant="outline"
          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 font-light rounded-lg"
        >
          <Trash2 className="size-4 mr-2" />
          Видалити контент
        </Button>
        <Button
          onClick={onEdit}
          variant="outline"
          className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white font-light rounded-lg"
          disabled={!onEdit}
        >
          <Edit className="size-4 mr-2" />
          {onEdit ? "Редагувати" : "Редагувати (скоро)"}
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          />
          <div className="relative bg-zinc-900 border border-red-500/20 rounded-2xl w-full max-w-md p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="size-12 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="size-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl text-white font-light mb-2">
                  Підтвердження видалення
                </h3>
                <p className="text-zinc-400 text-sm font-light">
                  Ви впевнені, що хочете видалити контент{" "}
                  <span className="text-white">"{contentTitle}"</span>?
                </p>
                <p className="text-red-400 text-sm font-light mt-2">
                  Цю дію не можна буде скасувати.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                disabled={isDeleting}
                className="border-zinc-800 text-white hover:bg-zinc-900 font-light rounded-lg"
              >
                Скасувати
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 text-white hover:bg-red-700 font-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Видалення..." : "Видалити"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
