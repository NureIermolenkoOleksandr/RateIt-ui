import { apiClient } from "./api-client";
import { Film, TVShow, Music, Game, Book, Content, SearchFilters, Episode } from "./types/content";

export interface CreateFilmRequest {
  Title: string;
  Description: string;
  ReleaseDate: string;
  ReleaseYear: number;
  ImageUrl: string;
  ExternalId: string;
  FilmDirector: string;
  FilmWriters: string;
  FilmMainCast: string;
  FilmBudget: number;
  FilmBoxOffice: number;
  FilmRuntimeInMinutes: number;
  FilmCountryOfOrigin: string;
  FilmAwards: string;
  FilmGenres: string;
  AverageRating: number;
  NumberOfRatings: number;
}

export interface CreateMusicRequest {
  Title: string;
  Description: string;
  ReleaseDate: string;
  ReleaseYear: number;
  ImageUrl: string;
  ExternalId: string;
  MusicArtist: string;
  MusicAlbum: string;
  MusicLabel: string;
  MusicLanquage: string;
  MusicDurationInSeconds: number;
  MusciGenres: string;
  AverageRating: number;
  NumberOfRatings: number;
}

export interface CreateGameRequest {
  Title: string;
  Description: string;
  ReleaseDate: string;
  ReleaseYear: number;
  ImageUrl: string;
  ExternalId: string;
  GameDeveloper: string;
  GamePublisher: string;
  GamePlatforms: string;
  GameGenres: string;
  AverageRating: number;
  NumberOfRatings: number;
}

export interface CreateBookRequest {
  Title: string;
  Description: string;
  ReleaseDate: string;
  ReleaseYear: number;
  ImageUrl: string;
  ExternalId: string;
  BookAuthor: string;
  BookPublisher: string;
  BookPages: number;
  BookOriginalLanguage: string;
  BookGenres: string;
  AverageRating: number;
  NumberOfRatings: number;
}

export interface CreateTVShowRequest {
  Title: string;
  Description: string;
  ReleaseDate: string;
  ReleaseYear: number;
  ImageUrl: string;
  ExternalId: string;
  TVShowDirector: string;
  TVShowCreators: string;
  TVShowMainCast: string;
  TVShowTotalSeasons: number;
  TVShowTotalEpisodes: number;
  TVShowNetworks: string;
  TVShowEndDate: string;
  TVShowGenres: string;
  AverageRating: number;
  NumberOfRatings: number;
}

export interface CreateEpisodeRequest {
  Title: string;
  Description: string;
  ReleaseDate: string;
  ReleaseYear: number;
  ImageUrl: string;
  ExternalId: string;
  EpisodeTVShowId: number;
  EpisodeSeasonNumber: number;
  EpisodeNumber: number;
  EpisodeRuntimeInMinutes: number;
  EpisodesTotalNumber: number;
  AverageRating: number;
  NumberOfRatings: number;
}

class ContentService {
  async searchContent(filters: Partial<SearchFilters> = {}): Promise<Content[]> {
    const searchParams = new URLSearchParams();

    if (filters.contentTypes && filters.contentTypes.length > 0) {
      filters.contentTypes.forEach((type) => {
        searchParams.append("ContentTypes", type);
      });
    }

    if (filters.contentName?.trim()) {
      searchParams.append("ContentName", filters.contentName.trim());
    }

    if (filters.yearFrom) {
      searchParams.append("YearFrom", filters.yearFrom.toString());
    }

    if (filters.yearTo) {
      searchParams.append("YearTo", filters.yearTo.toString());
    }

    if (filters.minRating !== undefined && filters.minRating > 0) {
      searchParams.append("MinRating", filters.minRating.toString());
    }

    if (filters.sortBy) {
      searchParams.append("SortBy", filters.sortBy);
    }

    if (filters.sortType) {
      searchParams.append("SortType", filters.sortType);
    }

    if (filters.filmGenres && filters.filmGenres.length > 0) {
      filters.filmGenres.forEach((genre) => {
        searchParams.append("FilmGenres", genre);
      });
    }

    if (filters.gameGenres && filters.gameGenres.length > 0) {
      filters.gameGenres.forEach((genre) => {
        searchParams.append("GameGenres", genre);
      });
    }

    if (filters.musicGenres && filters.musicGenres.length > 0) {
      filters.musicGenres.forEach((genre) => {
        searchParams.append("MusicGenres", genre);
      });
    }

    if (filters.bookGenres && filters.bookGenres.length > 0) {
      filters.bookGenres.forEach((genre) => {
        searchParams.append("BookGenres", genre);
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/content/search-content${queryString ? `?${queryString}` : ""}`;

    try {
      const content = await apiClient.get<Content[]>(endpoint, false);
      return content;
    } catch (error: any) {
      if (error.message.includes("No content was found")) {
        return [];
      }
      throw error;
    }
  }

  async getFilms(searchQuery?: string): Promise<Film[]> {
    return this.searchContent({
      contentTypes: ["Film"],
      contentName: searchQuery,
    }) as Promise<Film[]>;
  }

  async getTVShows(searchQuery?: string): Promise<TVShow[]> {
    return this.searchContent({
      contentTypes: ["TVShow"],
      contentName: searchQuery,
    }) as Promise<TVShow[]>;
  }

  async getMusic(searchQuery?: string): Promise<Music[]> {
    return this.searchContent({
      contentTypes: ["Music"],
      contentName: searchQuery,
    }) as Promise<Music[]>;
  }

  async getGames(searchQuery?: string): Promise<Game[]> {
    return this.searchContent({
      contentTypes: ["Game"],
      contentName: searchQuery,
    }) as Promise<Game[]>;
  }

  async getBooks(searchQuery?: string): Promise<Book[]> {
    return this.searchContent({
      contentTypes: ["Book"],
      contentName: searchQuery,
    }) as Promise<Book[]>;
  }

  async getContentById(id: number): Promise<Content> {
    const content = await apiClient.get<Content>(`/api/content/${id}`, false);
    return content;
  }

  async getFilmById(id: number): Promise<Film> {
    return this.getContentById(id) as Promise<Film>;
  }

  async getTVShowById(id: number): Promise<TVShow> {
    return this.getContentById(id) as Promise<TVShow>;
  }

  async getMusicById(id: number): Promise<Music> {
    return this.getContentById(id) as Promise<Music>;
  }

  async getGameById(id: number): Promise<Game> {
    return this.getContentById(id) as Promise<Game>;
  }

  async getBookById(id: number): Promise<Book> {
    return this.getContentById(id) as Promise<Book>;
  }

  async getEpisodeById(id: number): Promise<Episode> {
    return this.getContentById(id) as Promise<Episode>;
  }

  async getEpisodesByTVShowId(tvShowId: number): Promise<Episode[]> {
    const allEpisodes = await this.searchContent({
      contentTypes: ["Episode"],
    }) as Episode[];

    const filteredEpisodes = allEpisodes.filter(
      (episode) => episode.additionalDetails.tvShowId === tvShowId
    );

    filteredEpisodes.sort((a, b) => {
      if (a.additionalDetails.seasonNumber !== b.additionalDetails.seasonNumber) {
        return a.additionalDetails.seasonNumber - b.additionalDetails.seasonNumber;
      }
      return a.additionalDetails.episodeNumber - b.additionalDetails.episodeNumber;
    });

    return filteredEpisodes;
  }

  async createFilm(data: CreateFilmRequest): Promise<Film> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch("/api/content/create-film", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка створення фільму: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async createMusic(data: CreateMusicRequest): Promise<Music> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch("/api/content/create-music", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка створення музики: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async createGame(data: CreateGameRequest): Promise<Game> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch("/api/content/create-game", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка створення гри: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async createBook(data: CreateBookRequest): Promise<Book> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch("/api/content/create-book", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка створення книги: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async createTVShow(data: CreateTVShowRequest): Promise<TVShow> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch("/api/content/create-tvshow", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка створення серіалу: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async createEpisode(data: CreateEpisodeRequest): Promise<Episode> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch("/api/content/create-episode", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка створення епізоду: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async deleteContent(contentId: number): Promise<void> {
    const response = await fetch(`/api/content/delete-content?contentId=${contentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка видалення контенту: ${response.status} ${errorText}`);
    }
  }

  async updateFilm(filmId: number, data: CreateFilmRequest): Promise<Film> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch(`/api/content/film/${filmId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка оновлення фільму: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async updateMusic(musicId: number, data: CreateMusicRequest): Promise<Music> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch(`/api/content/music/${musicId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка оновлення музики: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async updateGame(gameId: number, data: CreateGameRequest): Promise<Game> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch(`/api/content/game/${gameId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка оновлення гри: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async updateBook(bookId: number, data: CreateBookRequest): Promise<Book> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch(`/api/content/book/${bookId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка оновлення книги: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async updateTVShow(tvShowId: number, data: CreateTVShowRequest): Promise<TVShow> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch(`/api/content/tvshow/${tvShowId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка оновлення серіалу: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async updateEpisode(episodeId: number, data: CreateEpisodeRequest): Promise<Episode> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch(`/api/content/episode/${episodeId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Помилка оновлення епізоду: ${response.status} ${errorText}`);
    }

    return await response.json();
  }
}

export const contentService = new ContentService();
