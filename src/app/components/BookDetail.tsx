import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Users, Tag, Loader2, BookOpen as BookIcon } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { ModeratorActions } from "./ModeratorActions";
import { EditBookForm } from "./EditBookForm";
import { contentService } from "../../lib/content-service";
import type { Book } from "../../lib/types/content";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./ImageWithFallback";

export function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadBook(parseInt(id));
    }
  }, [id]);

  const loadBook = async (bookId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const bookData = await contentService.getBookById(bookId);
      setBook(bookData);
    } catch (err) {
      console.error("Помилка завантаження книги:", err);
      setError("Не вдалося завантажити книгу");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-10 text-zinc-600 animate-spin mb-4" />
        <p className="text-zinc-500 text-lg font-light">Завантаження...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 text-lg mb-6 font-light">{error || "Книгу не знайдено"}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900">
          Повернутися назад
        </Button>
      </div>
    );
  }

  const details = book.additionalDetails;

  return (
    <div className="space-y-12">
      <Button onClick={() => navigate(-1)} variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-light">
        <ArrowLeft className="size-4 mr-2" />
        Назад до книг
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="rounded-2xl overflow-hidden border border-zinc-800/50 sticky top-24 bg-zinc-900">
            <ImageWithFallback src={book.imageUrl} alt={book.title} className="w-full aspect-[3/4] object-cover" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-extralight text-white tracking-tight">{book.title}</h1>
            <p className="text-xl text-zinc-400 leading-relaxed font-light">{book.description}</p>
          </div>

          <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800/50">
            <div>
              <p className="text-sm text-zinc-600 mb-3 font-light">Середня оцінка</p>
              <span className="text-5xl font-extralight text-white">
                {book.averageRating > 0 ? book.averageRating.toFixed(1) : "—"}
              </span>
              <p className="text-sm text-zinc-600 mt-2 font-light">
                {book.numberOfRatings} оцінок
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Автор</span>
              </div>
              <p className="text-white font-light">{details.author}</p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Видавець</span>
              </div>
              <p className="text-white font-light">{details.publisher}</p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Дата виходу</span>
              </div>
              <p className="text-white font-light">
                {new Date(book.releaseDate).toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="bg-zinc-900/30 rounded-xl p-5 border border-zinc-800/30">
              <div className="flex items-center gap-2 mb-2">
                <BookIcon className="size-4 text-zinc-600" />
                <span className="text-sm text-zinc-600 font-light">Сторінок</span>
              </div>
              <p className="text-white font-light">{details.pages}</p>
            </div>
          </div>

          {details.genres && details.genres.length > 0 && (
            <div>
              <p className="text-sm text-zinc-600 mb-3 font-light">Жанри</p>
              <div className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50 font-light px-4 py-1.5">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-zinc-600 mb-2 font-light">Мова оригіналу</p>
            <p className="text-white font-light">{details.originalLanguage}</p>
          </div>

          {/* Moderator Actions */}
          <ModeratorActions
            contentId={book.id}
            contentTitle={book.title}
            onEdit={() => setIsEditOpen(true)}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-white tracking-tight">
            Відгуки ({book.reviews.length})
          </h2>
        </div>

        <ReviewList reviews={book.reviews} onReviewsChanged={() => loadBook(book.id)} />

        <ReviewForm contentId={book.id} onReviewCreated={() => loadBook(book.id)} />
      </div>

      {/* Edit Book Form */}
      {isEditOpen && (
        <EditBookForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          book={book}
          onBookUpdated={() => loadBook(book.id)}
        />
      )}
    </div>
  );
}
