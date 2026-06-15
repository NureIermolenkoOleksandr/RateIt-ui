export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  description: string;
  duration: string;
  airDate: string;
  rating: number;
  userRating: number;
  image?: string;
}

export interface TVShow {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  userRating: number;
  authors: string[];
  genres: string[];
  ageRating: string;
  releaseDate: string;
  fullDescription: string;
  screenshots: string[];
  totalSeasons: number;
  status: string;
  episodes: Episode[];
}
