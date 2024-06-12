import GenreService from "../services/GenreService";
import { Movie, PieChartData } from "../types/types";
import Logger from "../utils/Logger";
import { Repository } from "./Repository";

export class MovieRepository extends Repository<Movie> {
  constructor() {
    super("movies");
  }

  async search(query: string): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM movies
        WHERE title LIKE ?
      `;

      this.db.all(sql, `%${query}%`, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows as Movie[]);
      });
    });
  }

  async listFilteredPaginated(
    genreId: number | null,
    minRating: number | null,
    year: number | null,
    page: number | null,
    pageSize: number | null,
    queryString: string | null
  ): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT DISTINCT movies.* FROM movies
        JOIN movie_genres ON movie_genres.movie_id = movies.id
        WHERE 1=1
      `;

      const params: any[] = [];

      if (genreId && genreId > 0) {
        sql += ` AND movie_genres.genre_id = ?`;
        params.push(genreId);
      }

      if (minRating) {
        sql += ` AND movies.vote_average >= ?`;
        params.push(minRating);
      }

      if (year) {
        sql += ` AND strftime('%Y', movies.release_date) = ?`;
        params.push(year.toString());
      }

      if (queryString) {
        sql += ` AND movies.title LIKE ?`;
        params.push(`%${queryString}%`);
      }
      if (pageSize && page) {
        sql += ` LIMIT ? OFFSET ?`;
        params.push(pageSize, (page - 1) * pageSize);
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows as Movie[]);
      });
    });
  }

  async getMoviesByGenreID(genreId: number): Promise<Movie[]> {
    return new Promise<Movie[]>((resolve, reject) => {
      const currentDate = new Date();
      const fiveYearsAgo = new Date(
        currentDate.getFullYear() - 4,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      const fiveYearsAgoFormatted = fiveYearsAgo.toISOString().split("T")[0];

      const sql = `
        SELECT * FROM movies
        JOIN movie_genres ON movie_genres.movie_id = movies.id
        WHERE movie_genres.genre_id = ?
        AND movies.release_date >= ?
      `;

      this.db.all(sql, [genreId, fiveYearsAgoFormatted], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows as Movie[]);
      });
    });
  }

  async getMoviesByGenreAndYear(
    genreId: number,
    year1: number,
    year2: number,
    genreName: string
  ): Promise<PieChartData> {
    return new Promise<PieChartData>((resolve, reject) => {
      const sql = `
        SELECT SUM(popularity) AS popularity, COUNT(*) AS movie_count FROM movies
        JOIN movie_genres ON movie_genres.movie_id = movies.id
        WHERE movie_genres.genre_id = ?
        AND strftime('%Y', movies.release_date) >= ? AND strftime('%Y', movies.release_date) <= ?
      `;

      this.db.all(
        sql,
        [genreId, year1.toString(), year2.toString()],
        (err, rows: { popularity: number; movie_count: number }[]) => {
          if (err) {
            reject(err);
          }

          const pieChartData: PieChartData = {
            popularity: rows[0].popularity,
            movie_count: rows[0].movie_count,
            genre_id: genreId,
            genre_name: genreName,
          };

          resolve(pieChartData);
        }
      );
    });
  }

  async getCount(
    genreId: number | null,
    minRating: number | null,
    year: number | null,
    queryString: string | null
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      let sql = `
      SELECT COUNT(*) AS count
      FROM (
        SELECT id
        FROM movies
        JOIN movie_genres ON movie_genres.movie_id = movies.id
        WHERE 1=1
      `;

      const params: any[] = [];

      if (genreId && genreId > 0) {
        sql += ` AND movie_genres.genre_id = ?`;
        params.push(genreId);
      }

      if (minRating) {
        sql += ` AND movies.vote_average >= ?`;
        params.push(minRating);
      }

      if (year) {
        sql += ` AND strftime('%Y', movies.release_date) = ?`;
        params.push(year.toString());
      }

      if (queryString) {
        sql += ` AND movies.title LIKE ?`;
        params.push(`%${queryString}%`);
      }
      sql += ` GROUP BY movies.id
      ) AS subquery`;

      this.db.get(sql, params, (err, row: { count: number }) => {
        if (err) {
          reject(err);
        }
        resolve(row.count);
      });
    });
  }
}
