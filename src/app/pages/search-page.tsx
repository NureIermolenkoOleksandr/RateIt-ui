import { useState, useEffect } from "react";
import { Search as SearchIcon, SlidersHorizontal, Loader2, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { ContentCard } from "../components/ContentCard";
import { contentService } from "../../lib/content-service";
import type { Content, ContentType, SearchFilters, FilmGenre, GameGenre, MusicGenre, BookGenre, SortBy, SortType } from "../../lib/types/content";

function getContentPath(content: Content): string {
  const details = content.additionalDetails;

  if ('director' in details && 'budget' in details) {
    return `/movies/${content.id}`;
  } else if ('director' in details && 'totalSeasons' in details) {
    return `/tvshows/${content.id}`;
  } else if ('artist' in details) {
    return `/music/${content.id}`;
  } else if ('developer' in details) {
    return `/games/${content.id}`;
  } else if ('author' in details) {
    return `/books/${content.id}`;
  }

  return `/movies/${content.id}`;
}

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "Film", label: "Фільм" },
  { value: "TVShow", label: "Серіал" },
  { value: "Music", label: "Музика" },
  { value: "Game", label: "Гра" },
  { value: "Book", label: "Книга" },
  { value: "Episode", label: "Серія" },
];

const FILM_GENRES: { value: FilmGenre; label: string }[] = [
  { value: "Drama", label: "Драма" },
  { value: "Comedy", label: "Комедія" },
  { value: "ScienceFiction", label: "Наукова фантастика" },
  { value: "Action", label: "Бойовик" },
  { value: "Horror", label: "Жахи" },
  { value: "Fantasy", label: "Фентезі" },
  { value: "Romance", label: "Романтика" },
  { value: "Detective", label: "Детектив" },
  { value: "Adventure", label: "Пригоди" },
  { value: "Historical", label: "Історичний" },
  { value: "Thriller", label: "Трилер" },
  { value: "Animation", label: "Анімація" },
  { value: "Documentary", label: "Документальний" },
  { value: "Musical", label: "Мюзикл" },
  { value: "Crime", label: "Кримінал" },
  { value: "Mystery", label: "Містика" },
  { value: "Other", label: "Інше" },
];

const GAME_GENRES: { value: GameGenre; label: string }[] = [
  { value: "RPG", label: "RPG" },
  { value: "Action", label: "Екшн" },
  { value: "Strategy", label: "Стратегія" },
  { value: "Sandbox", label: "Пісочниця" },
  { value: "Horror", label: "Жахи" },
  { value: "Simulation", label: "Симулятор" },
  { value: "Sports", label: "Спорт" },
  { value: "Racing", label: "Гонки" },
  { value: "Puzzle", label: "Головоломка" },
  { value: "Adventure", label: "Пригоди" },
  { value: "Fighting", label: "Файтинг" },
  { value: "Platformer", label: "Платформер" },
  { value: "Shooter", label: "Шутер" },
  { value: "MMO", label: "MMO" },
];

const MUSIC_GENRES: { value: MusicGenre; label: string }[] = [
  { value: "Rap", label: "Реп" },
  { value: "Rock", label: "Рок" },
  { value: "Pop", label: "Поп" },
  { value: "Jazz", label: "Джаз" },
  { value: "Classical", label: "Класична" },
  { value: "Country", label: "Кантрі" },
  { value: "Electronic", label: "Електронна" },
  { value: "HipHop", label: "Хіп-хоп" },
  { value: "RnB", label: "R&B" },
  { value: "Reggae", label: "Реґі" },
  { value: "Blues", label: "Блюз" },
  { value: "Metal", label: "Метал" },
  { value: "Folk", label: "Фолк" },
  { value: "Other", label: "Інше" },
];

const BOOK_GENRES: { value: BookGenre; label: string }[] = [
  { value: "Romance", label: "Романтика" },
  { value: "Fantasy", label: "Фентезі" },
  { value: "ScienceFiction", label: "Наукова фантастика" },
  { value: "Detective", label: "Детектив" },
  { value: "Biography", label: "Біографія" },
  { value: "Historical", label: "Історичний" },
  { value: "Thriller", label: "Трилер" },
  { value: "Horror", label: "Жахи" },
  { value: "Adventure", label: "Пригоди" },
  { value: "GloBalClassic", label: "Класика" },
  { value: "Other", label: "Інше" },
];

const SORT_BY_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "ReleaseYear", label: "За роком виходу" },
  { value: "AverageRating", label: "За оцінкою" },
];

const SORT_TYPE_OPTIONS: { value: SortType; label: string }[] = [
  { value: "Ascending", label: "Від найменшого" },
  { value: "Descending", label: "Від найбільшого" },
];

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Partial<SearchFilters>>({
    contentTypes: [],
    contentName: "",
    filmGenres: [],
    gameGenres: [],
    musicGenres: [],
    bookGenres: [],
  });
  const [results, setResults] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchFilters: Partial<SearchFilters> = {
        ...filters,
        contentName: searchQuery,
      };

      const content = await contentService.searchContent(searchFilters);
      setResults(content);
    } catch (error) {
      console.error("Помилка пошуку:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleContentType = (type: ContentType) => {
    setFilters((prev) => {
      const types = prev.contentTypes || [];
      const newTypes = types.includes(type)
        ? types.filter((t) => t !== type)
        : [...types, type];
      return { ...prev, contentTypes: newTypes };
    });
  };

  const toggleGenre = (genre: FilmGenre | GameGenre | MusicGenre | BookGenre, type: "film" | "game" | "music" | "book") => {
    setFilters((prev) => {
      const key = `${type}Genres` as keyof SearchFilters;
      const genres = (prev[key] || []) as any[];
      const newGenres = genres.includes(genre)
        ? genres.filter((g) => g !== genre)
        : [...genres, genre];
      return { ...prev, [key]: newGenres };
    });
  };

  const resetFilters = () => {
    setFilters({
      contentTypes: [],
      contentName: "",
      filmGenres: [],
      gameGenres: [],
      musicGenres: [],
      bookGenres: [],
    });
    setSearchQuery("");
  };

  const showFilmGenres = filters.contentTypes?.includes("Film") || filters.contentTypes?.includes("TVShow");
  const showGameGenres = filters.contentTypes?.includes("Game");
  const showMusicGenres = filters.contentTypes?.includes("Music");
  const showBookGenres = filters.contentTypes?.includes("Book");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center">
          <SearchIcon className="size-10 text-white opacity-60" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-extralight text-white mb-3 tracking-tight">Пошук</h1>
          <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto">
            Знайдіть фільми, серіали, музику, ігри та книги
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-600" />
            <Input
              type="text"
              placeholder="Пошук контенту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-12 h-14 bg-zinc-900/50 border-zinc-800/50 text-white placeholder:text-zinc-600 font-light focus:border-zinc-700 rounded-xl text-lg"
            />
          </div>
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                className="h-14 px-8 bg-white text-black hover:bg-zinc-200 font-light rounded-xl text-lg"
              >
                <SlidersHorizontal className="size-5 mr-2" />
                Фільтри
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-zinc-950 border-zinc-800 p-6">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-white font-light text-2xl">Фільтри пошуку</SheetTitle>
              </SheetHeader>
              <div className="space-y-6">
                {/* Content Types */}
                <div className="space-y-3">
                  <Label className="text-zinc-400 font-light">Тип контенту</Label>
                  <div className="flex flex-wrap gap-2">
                    {CONTENT_TYPES.map((type) => (
                      <Badge
                        key={type.value}
                        onClick={() => toggleContentType(type.value)}
                        className={`cursor-pointer px-4 py-2 ${
                          filters.contentTypes?.includes(type.value)
                            ? "bg-white text-black hover:bg-zinc-200"
                            : "bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50"
                        }`}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Year Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 font-light">Від року</Label>
                    <Input
                      type="number"
                      placeholder="1900"
                      value={filters.yearFrom || ""}
                      onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 font-light">До року</Label>
                    <Input
                      type="number"
                      placeholder="2026"
                      value={filters.yearTo || ""}
                      onChange={(e) => setFilters({ ...filters, yearTo: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light"
                    />
                  </div>
                </div>

                {/* Min Rating */}
                <div className="space-y-2">
                  <Label className="text-zinc-400 font-light">Мінімальний рейтинг</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.minRating || ""}
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="h-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 font-light"
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label className="text-zinc-400 font-light">Сортувати за</Label>
                  <div className="flex flex-wrap gap-2">
                    {SORT_BY_OPTIONS.map((option) => (
                      <Badge
                        key={option.value}
                        onClick={() => setFilters({ ...filters, sortBy: option.value })}
                        className={`cursor-pointer px-4 py-2 ${
                          filters.sortBy === option.value
                            ? "bg-white text-black hover:bg-zinc-200"
                            : "bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50"
                        }`}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sort Type */}
                <div className="space-y-2">
                  <Label className="text-zinc-400 font-light">Тип сортування</Label>
                  <div className="flex flex-wrap gap-2">
                    {SORT_TYPE_OPTIONS.map((option) => (
                      <Badge
                        key={option.value}
                        onClick={() => setFilters({ ...filters, sortType: option.value })}
                        className={`cursor-pointer px-4 py-2 ${
                          filters.sortType === option.value
                            ? "bg-white text-black hover:bg-zinc-200"
                            : "bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50"
                        }`}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Film/TVShow Genres */}
                {showFilmGenres && (
                  <div className="space-y-3">
                    <Label className="text-zinc-400 font-light">Жанри фільмів/серіалів</Label>
                    <div className="flex flex-wrap gap-2">
                      {FILM_GENRES.map((genre) => (
                        <Badge
                          key={genre.value}
                          onClick={() => toggleGenre(genre.value, "film")}
                          className={`cursor-pointer px-3 py-1.5 text-sm ${
                            filters.filmGenres?.includes(genre.value)
                              ? "bg-white text-black hover:bg-zinc-200"
                              : "bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50"
                          }`}
                        >
                          {genre.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Game Genres */}
                {showGameGenres && (
                  <div className="space-y-3">
                    <Label className="text-zinc-400 font-light">Жанри ігор</Label>
                    <div className="flex flex-wrap gap-2">
                      {GAME_GENRES.map((genre) => (
                        <Badge
                          key={genre.value}
                          onClick={() => toggleGenre(genre.value, "game")}
                          className={`cursor-pointer px-3 py-1.5 text-sm ${
                            filters.gameGenres?.includes(genre.value)
                              ? "bg-white text-black hover:bg-zinc-200"
                              : "bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50"
                          }`}
                        >
                          {genre.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Music Genres */}
                {showMusicGenres && (
                  <div className="space-y-3">
                    <Label className="text-zinc-400 font-light">Жанри музики</Label>
                    <div className="flex flex-wrap gap-2">
                      {MUSIC_GENRES.map((genre) => (
                        <Badge
                          key={genre.value}
                          onClick={() => toggleGenre(genre.value, "music")}
                          className={`cursor-pointer px-3 py-1.5 text-sm ${
                            filters.musicGenres?.includes(genre.value)
                              ? "bg-white text-black hover:bg-zinc-200"
                              : "bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50"
                          }`}
                        >
                          {genre.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Genres */}
                {showBookGenres && (
                  <div className="space-y-3">
                    <Label className="text-zinc-400 font-light">Жанри книг</Label>
                    <div className="flex flex-wrap gap-2">
                      {BOOK_GENRES.map((genre) => (
                        <Badge
                          key={genre.value}
                          onClick={() => toggleGenre(genre.value, "book")}
                          className={`cursor-pointer px-3 py-1.5 text-sm ${
                            filters.bookGenres?.includes(genre.value)
                              ? "bg-white text-black hover:bg-zinc-200"
                              : "bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50"
                          }`}
                        >
                          {genre.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-zinc-800/50 mt-8">
                  <Button
                    onClick={resetFilters}
                    className="flex-1 h-11 bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 font-light"
                  >
                    Скинути
                  </Button>
                  <Button
                    onClick={() => {
                      setIsFiltersOpen(false);
                      handleSearch();
                    }}
                    className="flex-1 h-11 bg-white text-black hover:bg-zinc-200 font-light"
                  >
                    Застосувати
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button
            onClick={handleSearch}
            className="h-14 px-8 bg-white text-black hover:bg-zinc-200 font-light rounded-xl text-lg"
          >
            Пошук
          </Button>
        </div>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-10 text-zinc-600 animate-spin mb-4" />
          <p className="text-zinc-500 text-lg font-light">Пошук...</p>
        </div>
      )}

      {!isLoading && hasSearched && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-400 text-xl font-light mb-2">
            По такому запиту нічого не знайдено.
          </p>
          <p className="text-zinc-500 font-light">Спробуйте пошукати ще!</p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-zinc-400 font-light">
              Знайдено результатів: <span className="text-white">{results.length}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map((item) => (
              <ContentCard
                key={item.id}
                id={item.id.toString()}
                title={item.title}
                description={item.description}
                image={item.imageUrl}
                rating={item.averageRating}
                detailPath={getContentPath(item)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
