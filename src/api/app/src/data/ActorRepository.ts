import { Repository } from "./Repository";
import { Actor } from "../types/types";
const API_KEY = "ed11f55499efea6bd41f9233072f1d96";
const BASE_URL = "https://api.themoviedb.org/3";

export class ActorRepository extends Repository<Actor> {
  constructor() {
    super("actors");
  }

  async listByMovieId(movieId: number): Promise<Actor[]> {
    return new Promise((resolve, reject) => {
      // select the actors for a given movie from the movie_actors table
      const sql = `
        SELECT actors.*, movie_actors.character, movie_actors.order_no FROM actors
        JOIN movie_actors ON movie_actors.actor_id = actors.id
        WHERE movie_actors.movie_id = ?
        ORDER BY movie_actors.order_no ASC
      `;

      this.db.all(sql, movieId, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows as Actor[]);
      });
    });
  }

  async createActorsOfMovie(movieId: number): Promise<void> {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    const response = await fetch(url);
    const movie = await response.json();

    const creditsUrl = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
    const creditsResponse = await fetch(creditsUrl);
    const credits: any = await creditsResponse.json();

    const actors = credits.cast;

    const sql = `
      INSERT INTO movie_actors (movie_id, actor_id, character, order_no)
      VALUES (?, ?, ?, ?)
    `;

    actors.forEach(async (actor: any, index: number) => {
      await this.db.run(sql, movieId, actor.id, actor.character, index);
    });
  }
}
