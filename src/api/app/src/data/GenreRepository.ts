import { Genre, Movie } from "../types/types";
import { Repository } from "./Repository";
const API_KEY = "ed11f55499efea6bd41f9233072f1d96";
const BASE_URL = "https://api.themoviedb.org/3";

export class GenreRepository extends Repository<Genre> {
  constructor() {
    super("genres");
  }

  async listGenresOfMovie(movieId: number): Promise<Genre[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT genres.* FROM genres
        JOIN movie_genres ON movie_genres.genre_id = genres.id
        WHERE movie_genres.movie_id = ?
      `;

      this.db.all(sql, movieId, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows as Genre[]);
      });
    });
  }

  async createGenresOfMovie(movieId: number): Promise<void> {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    const response = await fetch(url);
    const movie = await response.json();

    const genres = movie.genres;

    const sql = `
      INSERT INTO movie_genres (movie_id, genre_id)
      VALUES (?, ?)
    `;

    genres.forEach(async (genre: any) => {
      await this.db.run(sql, movieId, genre.id);
    });
  }
}
