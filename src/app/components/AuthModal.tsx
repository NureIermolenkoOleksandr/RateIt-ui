import { X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { authService } from "../../lib/auth-service";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onSwitchMode: () => void;
}

export function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        const token = await authService.login({ email, password });

        window.dispatchEvent(new Event("storage"));

        onClose();
        window.location.reload();

      } else {
        await authService.register({
          email,
          password,
          firstName: name,
          lastName: surname,
          age: age ? parseInt(age) : undefined,
        });
        setError(null);
        setEmail("");
        setPassword("");
        setName("");
        setSurname("");
        setAge("");
        onSwitchMode();
      }
    } catch (err) {
      let errorMessage = mode === "login" ? "Невірний email або пароль" : "Помилка реєстрації";

      if (err instanceof Error) {
        if (err.message.includes("Wrong email or password")) {
          errorMessage = "Невірний email або пароль";
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = "Помилка з'єднання з сервером. Спробуйте пізніше.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-light text-white mb-2 tracking-tight">
            {mode === "login" ? "Вхід" : "Реєстрація"}
          </h2>
          <p className="text-zinc-500 font-light">
            {mode === "login"
              ? "Увійдіть до свого облікового запису"
              : "Створіть новий обліковий запис"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400 font-light">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-light">Ім'я</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше ім'я"
                  required
                  className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-light">Прізвище</label>
                <Input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Ваше прізвище"
                  required
                  className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-light">Вік</label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ваш вік"
                  min="13"
                  max="120"
                  required
                  className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm text-zinc-400 font-light">Email</label>
            <Input
              type={mode === "login" ? "text" : "email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === "login" ? "Email або логін" : "your@email.com"}
              required
              className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400 font-light">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-lg"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-light rounded-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? (mode === "login" ? "Вхід..." : "Реєстрація...")
              : (mode === "login" ? "Увійти" : "Зареєструватися")
            }
          </Button>
        </form>

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-sm text-zinc-500 hover:text-white transition-colors font-light"
          >
            {mode === "login" ? (
              <>
                Немає облікового запису?{" "}
                <span className="text-white">Зареєструватися</span>
              </>
            ) : (
              <>
                Вже є обліковий запис?{" "}
                <span className="text-white">Увійти</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}