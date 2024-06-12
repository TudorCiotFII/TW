import { GenreRepository } from "../data/GenreRepository";
import { Genre, Movie, MovieDetail } from "../types/types";

export default class GenreService {
  genreRepository: GenreRepository;

  constructor() {
    this.genreRepository = new GenreRepository();
  }

  async getGenres(): Promise<Genre[]> {
    return await this.genreRepository.list();
  }

  async getGenre(id: number): Promise<Genre> {
    const genre = await this.genreRepository.read(id);
    if (!genre) {
      throw new Error("Genre not found");
      return null;
    }

    return genre;
  }
}
