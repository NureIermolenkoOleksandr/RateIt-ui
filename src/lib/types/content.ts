export interface FilmAdditionalDetails {
  director: string;
  writers: string;
  mainCast: string;
  budget: number;
  boxOffice: number;
  runtimeInMinutes: number;
  countryOfOrigin: string;
  awards: string | null;
  genres: string[];
}

export interface TVShowAdditionalDetails {
  creators: string;
  director: string;
  mainCast: string;
  totalSeasons: number;
  totalEpisodes: number;
  networks: string;
  endDate: string | null;
  genres: string[];
}

export interface MusicAdditionalDetails {
  artist: string;
  album: string;
  durationInSeconds: number;
  label: string;
  language: string;
  genres: string[];
}

export interface GameAdditionalDetails {
  developer: string;
  publisher: string;
  platforms: string[];
  genres: string[];
}

export interface BookAdditionalDetails {
  author: string;
  publisher: string;
  originalLanguage: string;
  pages: number;
  genres: string[];
}

export interface EpisodeAdditionalDetails {
  tvShowId: number;
  seasonNumber: number;
  episodeNumber: number;
  totalNumber: number;
  runtimeInMinutes: number;
}

export interface Review {
  id: number;
  rating: number;
  title: string;
  description: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
  currentUserVote: "Like" | "Dislike" | null;
}

export interface BaseContent {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  releaseYear: number;
  averageRating: number;
  numberOfRatings: number;
  imageUrl: string;
  createdAt: string;
  reviews: Review[];
}

export interface Film extends BaseContent {
  additionalDetails: FilmAdditionalDetails;
}

export interface TVShow extends BaseContent {
  additionalDetails: TVShowAdditionalDetails;
}

export interface Music extends BaseContent {
  additionalDetails: MusicAdditionalDetails;
}

export interface Game extends BaseContent {
  additionalDetails: GameAdditionalDetails;
}

export interface Book extends BaseContent {
  additionalDetails: BookAdditionalDetails;
}

export interface Episode extends BaseContent {
  additionalDetails: EpisodeAdditionalDetails;
}

export type Content = Film | TVShow | Music | Game | Book | Episode;

export type ContentType = "Film" | "TVShow" | "Music" | "Episode" | "Game" | "Book";

export type SortBy = "ReleaseYear" | "AverageRating";
export type SortType = "Ascending" | "Descending";

export type FilmGenre =
  | "Drama" | "Comedy" | "ScienceFiction" | "Action" | "Music"
  | "TVMovie" | "War" | "Horror" | "Fantasy" | "Romance"
  | "Detective" | "Adventure" | "Historical" | "Thriller" | "Musical"
  | "Animation" | "Documentary" | "Family" | "Western" | "Crime"
  | "Mystery" | "History" | "Other";

export type GameGenre =
  | "RPG" | "Action" | "Strategy" | "Sandbox" | "Horror"
  | "Simulation" | "Sports" | "Racing" | "Puzzle" | "Adventure"
  | "Fighting" | "Platformer" | "Shooter" | "MMO";

export type MusicGenre =
  | "Rap" | "Rock" | "Pop" | "Jazz" | "Classical"
  | "Country" | "Electronic" | "HipHop" | "RnB" | "Reggae"
  | "Blues" | "Metal" | "Folk" | "Other";

export type BookGenre =
  | "Romance" | "Fantasy" | "ScienceFiction" | "Detective" | "Biography"
  | "Historical" | "Thriller" | "Horror" | "Adventure" | "GloBalClassic" | "Other";

export interface SearchFilters {
  contentTypes: ContentType[];
  contentName: string;
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  sortBy?: SortBy;
  sortType?: SortType;
  filmGenres: FilmGenre[];
  gameGenres: GameGenre[];
  musicGenres: MusicGenre[];
  bookGenres: BookGenre[];
}
