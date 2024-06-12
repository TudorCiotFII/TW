import { AuthStrategy } from "../auth";

export interface UserAuth {
  username: string;
  password: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  director: string;
  release_date: Date;
  runtime: number;
  vote_count: number;
  budget: number;
  revenue: number;
  popularity: number;
}

export interface Actor {
  id: number;
  name: string;
  profile_path: string;
  gender: number;
  character: string;
  order: number;
}

export interface MovieDetail {
  movie: Movie;
  genres: Genre[];
  actors: Actor[];
}

export interface MoviesPaginated {
  movies: Movie[];
  total: number;
}

export enum ChartType {
  PIE = "pie",
  BAR = "bar",
  LINE = "line",
}

export interface PieChartData {
  popularity: number;
  movie_count: number;
  genre_id: number;
  genre_name: string;
}
