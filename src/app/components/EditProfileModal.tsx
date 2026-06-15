import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { userService } from "../../lib/user-service";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFirstName("");
      setLastName("");
      setAge("");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("Ім'я та прізвище обов'язкові");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await userService.updateProfile({
        name: firstName.trim(),
        lastName: lastName.trim(),
        age: age ? parseInt(age) : undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error("Помилка оновлення профілю:", err);
      setError(err.message || "Не вдалося оновити профіль");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-white">Редагувати профіль</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-zinc-400 font-light">
              Ім'я *
            </Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Введіть ім'я"
              disabled={isSubmitting}
              className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-zinc-400 font-light">
              Прізвище *
            </Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Введіть прізвище"
              disabled={isSubmitting}
              className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-zinc-400 font-light">
              Вік (необов'язково)
            </Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Введіть вік"
              disabled={isSubmitting}
              min="1"
              max="150"
              className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-light">{error}</p>
          )}

          {success && (
            <p className="text-green-400 text-sm font-light">Профіль успішно оновлено!</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant="outline"
              className="flex-1 border-zinc-800 text-white hover:bg-zinc-900 font-light h-11"
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-white text-black hover:bg-zinc-200 font-light h-11"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Збереження...
                </>
              ) : (
                "Зберегти"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
