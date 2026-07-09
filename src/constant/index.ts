import { CustomGenre } from "src/types/Genre";

export const API_ENDPOINT_URL = import.meta.env.VITE_APP_API_ENDPOINT_URL;
export const TMDB_V3_API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

export const MAIN_PATH = {
  root: "",
  browse: "browse",
  movies: "movies",
  tvShows: "tvshows",
  genreExplore: "genre",
  watch: "watch",
  search: "search",
  login: "login",
  profiles: "profiles",
  myList: "my-list",
};

export const ARROW_MAX_WIDTH = 60;
export const MOVIE_COMMON_TITLES: CustomGenre[] = [
  { name: "Popular", apiString: "popular" },
  { name: "Top Rated", apiString: "top_rated" },
  { name: "Now Playing", apiString: "now_playing" },
  { name: "Upcoming", apiString: "upcoming" },
];

export const TV_COMMON_TITLES: CustomGenre[] = [
  { name: "Popular", apiString: "popular" },
  { name: "Top Rated", apiString: "top_rated" },
  { name: "Airing Today", apiString: "airing_today" },
  { name: "On The Air", apiString: "on_the_air" },
];

export const YOUTUBE_URL = "https://www.youtube.com/watch?v=";
export const APP_BAR_HEIGHT = 70;

export const INITIAL_DETAIL_STATE = {
  id: undefined,
  mediaType: undefined,
  mediaDetail: undefined,
};
