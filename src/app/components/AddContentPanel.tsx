import { Film, Music, Gamepad2, Book, Tv } from "lucide-react";

interface AddContentPanelProps {
  onAddFilm: () => void;
  onAddTVShow: () => void;
  onAddMusic: () => void;
  onAddGame: () => void;
  onAddBook: () => void;
}

export function AddContentPanel({
  onAddFilm,
  onAddTVShow,
  onAddMusic,
  onAddGame,
  onAddBook,
}: AddContentPanelProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
      <h2 className="text-2xl text-white font-light tracking-tight mb-6">
        Додавання контенту
      </h2>
      <p className="text-zinc-400 text-sm font-light mb-6">
        Оберіть тип контенту для додавання
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <button
          onClick={onAddFilm}
          className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-6 hover:border-blue-500/50 hover:bg-zinc-950 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Film className="size-6 text-blue-500" />
            </div>
            <span className="text-white font-light">Фільм</span>
          </div>
        </button>

        <button
          onClick={onAddTVShow}
          className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-6 hover:border-purple-500/50 hover:bg-zinc-950 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Tv className="size-6 text-purple-500" />
            </div>
            <span className="text-white font-light">Серіал</span>
          </div>
        </button>

        <button
          onClick={onAddMusic}
          className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-6 hover:border-green-500/50 hover:bg-zinc-950 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <Music className="size-6 text-green-500" />
            </div>
            <span className="text-white font-light">Музика</span>
          </div>
        </button>

        <button
          onClick={onAddGame}
          className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-6 hover:border-orange-500/50 hover:bg-zinc-950 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
              <Gamepad2 className="size-6 text-orange-500" />
            </div>
            <span className="text-white font-light">Гра</span>
          </div>
        </button>

        <button
          onClick={onAddBook}
          className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-6 hover:border-yellow-500/50 hover:bg-zinc-950 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
              <Book className="size-6 text-yellow-500" />
            </div>
            <span className="text-white font-light">Книга</span>
          </div>
        </button>
      </div>
    </div>
  );
}
