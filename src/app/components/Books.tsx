import { useState, useEffect } from "react";
import { ContentCard } from "./ContentCard";
import { BookOpen, Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { contentService } from "../../lib/content-service";
import type { Book } from "../../lib/types/content";

export function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchBooks(searchQuery);
      } else {
        loadBooks();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const items = await contentService.getBooks();
      setBooks(items);
    } catch (err) {
      console.error("Помилка завантаження книг:", err);
      setError("Не вдалося завантажити книги");
    } finally {
      setIsLoading(false);
    }
  };

  const searchBooks = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const items = await contentService.getBooks(query);
      setBooks(items);
    } catch (err) {
      console.error("Помилка пошуку книг:", err);
      setError("Не вдалося знайти книги");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center">
          <BookOpen className="size-10 text-white opacity-60" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-extralight text-white mb-3 tracking-tight">Книги</h1>
          <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto">
            Діліться враженнями від прочитаних книг
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-600" />
          <Input
            type="text"
            placeholder="Пошук книг..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-zinc-900/50 border-zinc-800/50 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-xl"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-10 text-zinc-600 animate-spin mb-4" />
          <p className="text-zinc-500 text-lg font-light">Завантаження книг...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg font-light mb-4">{error}</p>
          <button
            onClick={loadBooks}
            className="text-zinc-400 hover:text-white transition-colors font-light"
          >
            Спробувати знову
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <ContentCard
                key={book.id}
                id={book.id.toString()}
                title={book.title}
                description={book.description}
                image={book.imageUrl}
                rating={book.averageRating}
                detailPath={`/books/${book.id}`}
              />
            ))}
          </div>

          {books.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg font-light">
                {searchQuery ? "Книг за вашим запитом не знайдено" : "Книг не знайдено"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
