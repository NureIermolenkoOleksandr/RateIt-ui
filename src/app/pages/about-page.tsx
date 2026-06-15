import { Info, Star, Users, TrendingUp } from "lucide-react";

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Hero */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center">
          <div className="relative">
            <Info className="size-12 text-white opacity-60" />
          </div>
        </div>
        <h1 className="text-4xl lg:text-6xl font-extralight text-white tracking-tight">
          Про нас
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-zinc-900/30 rounded-2xl p-8 lg:p-12 border border-zinc-800/30">
        <div className="space-y-6 text-zinc-400 font-light text-lg leading-relaxed">
          <p>
            <span className="text-white font-normal">RateIt</span> — це вебсайт, призначений для оцінювання та рецензування різноманітного цифрового контенту. Платформа надає користувачам можливість оцінювати фільми, книги, ігри та музику, формуючи об'єктивні рейтинги на основі думок спільноти.
          </p>
          <p>
            Користувачі можуть залишати власні відгуки, ділитися враженнями та ознайомлюватися з оцінками інших, що сприяє прийняттю більш обґрунтованих рішень при виборі контенту. Система рейтингу дозволяє швидко визначити популярність і якість певного продукту.
          </p>
          <p>
            RateIt також виконує роль інформаційної платформи, де зібрані думки користувачів допомагають відкривати нові фільми, книги, ігри та музичні твори відповідно до індивідуальних вподобань.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/20 rounded-xl p-8 border border-zinc-800/30 text-center space-y-4">
          <div className="inline-flex items-center justify-center">
            <Star className="size-10 text-white opacity-60" />
          </div>
          <h3 className="text-xl font-light text-white">Система оцінок</h3>
          <p className="text-zinc-500 font-light leading-relaxed">
            Зручна система оцінювання від 1 до 5 зірок
          </p>
        </div>

        <div className="bg-zinc-900/20 rounded-xl p-8 border border-zinc-800/30 text-center space-y-4">
          <div className="inline-flex items-center justify-center">
            <Users className="size-10 text-white opacity-60" />
          </div>
          <h3 className="text-xl font-light text-white">Спільнота</h3>
          <p className="text-zinc-500 font-light leading-relaxed">
            Читайте відгуки та діліться власними думками
          </p>
        </div>

        <div className="bg-zinc-900/20 rounded-xl p-8 border border-zinc-800/30 text-center space-y-4">
          <div className="inline-flex items-center justify-center">
            <TrendingUp className="size-10 text-white opacity-60" />
          </div>
          <h3 className="text-xl font-light text-white">Рейтинги</h3>
          <p className="text-zinc-500 font-light leading-relaxed">
            Об'єктивні рейтинги на основі оцінок користувачів
          </p>
        </div>
      </div>
    </div>
  );
}
