import { Company, Country, Language } from './Common';
import { Genre } from './Genre';

export type Appended_Video = {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
};

export type Season = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
};

export type Episode = {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
};

export type SeasonDetail = {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
};

export type MovieDetail = {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Company[];
  production_countries: Country[];
  release_date: string;
  first_air_date?: string; // TV Shows
  revenue: number;
  runtime: number;
  episode_run_time?: number[]; // TV Shows
  spoken_languages: Language[];
  status: string;
  tagline: string;
  title: string;
  name?: string; // TV Shows
  video: boolean;
  videos: { results: Appended_Video[] };
  vote_average: number;
  vote_count: number;
  seasons?: Season[]; // TV Shows
};

export type Movie = {
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date?: string; // Optional for TV Shows
  first_air_date?: string; // TV Shows
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title?: string; // Optional for TV Shows
  name?: string; // TV Shows
  backdrop_path: string | null;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
  media_type?: string;
};
