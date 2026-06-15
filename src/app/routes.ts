import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/root-layout";
import { HomePage } from "./pages/home-page";
import { MoviesPage } from "./pages/movies-page";
import { MusicPage } from "./pages/music-page";
import { GamesPage } from "./pages/games-page";
import { BooksPage } from "./pages/books-page";
import { TVShowsPage } from "./pages/tvshows-page";
import { SearchPage } from "./pages/search-page";
import { AboutPage } from "./pages/about-page";
import { MovieDetailPage } from "./pages/movie-detail-page";
import { MusicDetailPage } from "./pages/music-detail-page";
import { GameDetailPage } from "./pages/game-detail-page";
import { BookDetailPage } from "./pages/book-detail-page";
import { TVShowDetailPage } from "./pages/tvshow-detail-page";
import { EpisodeDetailPage } from "./pages/episode-detail-page";
import { MyReviewsPage } from "./pages/my-reviews-page";
import { ModeratorPanelPage } from "./pages/moderator-panel-page";
import { AchievementsPage } from "./pages/achievements-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "search", Component: SearchPage },
      { path: "movies", Component: MoviesPage },
      { path: "movies/:id", Component: MovieDetailPage },
      { path: "tvshows", Component: TVShowsPage },
      { path: "tvshows/:id", Component: TVShowDetailPage },
      { path: "episodes/:id", Component: EpisodeDetailPage },
      { path: "music", Component: MusicPage },
      { path: "music/:id", Component: MusicDetailPage },
      { path: "games", Component: GamesPage },
      { path: "games/:id", Component: GameDetailPage },
      { path: "books", Component: BooksPage },
      { path: "books/:id", Component: BookDetailPage },
      { path: "about", Component: AboutPage },
      { path: "my-reviews", Component: MyReviewsPage },
      { path: "achievements", Component: AchievementsPage },
      { path: "moderator", Component: ModeratorPanelPage },
    ],
  },
]);
