import { ActorRepository } from "../data/ActorRepository";
import { GenreRepository } from "../data/GenreRepository";
import { MovieRepository } from "../data/MovieRepository";
import { ChartType, Movie, MovieDetail, MoviesPaginated } from "../types/types";
import Logger from "../utils/Logger";
const API_KEY = "ed11f55499efea6bd41f9233072f1d96";
const BASE_URL = "https://api.themoviedb.org/3";

export default class MovieService {
  movieRepository: MovieRepository;
  actorRepository: ActorRepository;
  genreRepository: GenreRepository;

  constructor() {
    this.movieRepository = new MovieRepository();
    this.actorRepository = new ActorRepository();
    this.genreRepository = new GenreRepository();
  }

  async getMovies(): Promise<Movie[]> {
    return await this.movieRepository.list();
  }

  async getMovie(id: number): Promise<MovieDetail> {
    const movie = await this.movieRepository.read(id);
    const actors = await this.actorRepository.listByMovieId(id);
    const genres = await this.genreRepository.listGenresOfMovie(id);

    return {
      movie,
      actors,
      genres,
    };
  }

  async searchMovies(query: string): Promise<Movie[]> {
    return await this.movieRepository.search(query);
  }

  async getMoviesFilteredPaginated(
    genreId: number | null,
    minRating: number | null,
    year: number | null,
    page: number | null,
    pageSize: number | null,
    queryString: string | null
  ): Promise<MoviesPaginated> {
    const total = await this.movieRepository.getCount(
      genreId,
      minRating,
      year,
      queryString
    );
    const movies = await this.movieRepository.listFilteredPaginated(
      genreId,
      minRating,
      year,
      page,
      pageSize,
      queryString
    );
    return {
      movies,
      total,
    };
  }

  async getNameForGenre(genreId: number): Promise<any> {
    const genre = await this.genreRepository.read(genreId);
    return genre.name;
  }

  async getMovieById(id: number): Promise<MovieDetail> {
    const movie = await this.movieRepository.read(id);
    const actors = await this.actorRepository.listByMovieId(id);
    const genres = await this.genreRepository.listGenresOfMovie(id);

    return {
      movie,
      actors,
      genres,
    };
  }

  async getMovieByIdFromApi(id: number): Promise<Movie | null> {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;
    const response = await fetch(url);
    const movie: any = await response.json();
    // get the director
    const creditsUrl = `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`;
    const creditsResponse = await fetch(creditsUrl);
    const credits: any = await creditsResponse.json();
    const director = credits.crew.find(
      (crewMember: any) => crewMember.job === "Director"
    );
    if (director) {
      movie.director = director.name;
    }
    if (movie) {
      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        // get only the first decimal
        vote_average: Math.round(movie.vote_average * 10) / 10,
        director: movie.director,
        release_date: movie.release_date,
        runtime: movie.runtime,
        vote_count: movie.vote_count,
        budget: movie.budget,
        revenue: movie.revenue,
        popularity: movie.popularity,
      };
    }
    console.log(movie, "movie");
    return null;
  }

  async saveMovie(movie: Movie): Promise<void> {
    await this.movieRepository.create(movie);
    await this.genreRepository.createGenresOfMovie(movie.id);
    await this.actorRepository.createActorsOfMovie(movie.id);
  }

  async getProfitForGenre(genreId: number): Promise<any> {
    let profit = [];
    const genre = await this.genreRepository.read(genreId);
    const movies = await this.movieRepository.getMoviesByGenreID(genreId);

    const movieYears = new Set();

    movies.forEach((movie) => {
      const releaseYear = new Date(movie.release_date).getFullYear();
      movieYears.add(releaseYear);
    });

    movieYears.forEach((year) => {
      const periodStart = new Date(year as number, 0, 1);
      const periodEnd = new Date((year as number) + 1, 0, 1);

      let totalRevenue = 0;
      let totalBudget = 0;

      movies.forEach((movie) => {
        const releaseDate = new Date(movie.release_date);
        if (releaseDate >= periodStart && releaseDate < periodEnd) {
          totalRevenue += movie.revenue;
          totalBudget += movie.budget;
        }
      });

      const profitObj = {
        year: `${year as number}`,
        profit: totalRevenue - totalBudget,
      };

      profit.push(profitObj);
    });

    profit = profit.sort((a, b) => {
      return b.year - a.year;
    });

    return {
      genre,
      profit,
    };
  }

  async getPopularityForYears(year1: number, year2: number): Promise<any> {
    let popularitySum = 0;
    let countSum = 0;
    const returnArray = [];
    const popularitiesPerGenre = [];
    const genres = await this.genreRepository.list();
    for (const genre of genres) {
      const genreName = await this.getNameForGenre(genre.id);
      const row = await this.movieRepository.getMoviesByGenreAndYear(
        genre.id,
        year1,
        year2,
        genreName
      );
      if (row.popularity != null) {
        popularitiesPerGenre.push(row);
      }
    }

    popularitiesPerGenre.sort((a, b) => {
      return b.popularity - a.popularity;
    });

    const top5 = popularitiesPerGenre.slice(0, 5);
    for (const object of top5) {
      returnArray.push({
        popularityAverage: parseFloat(
          (object.popularity / object.movie_count).toFixed(2)
        ),
        genre_id: object.genre_id,
        genre_name: object.genre_name,
      });
    }
    const others = popularitiesPerGenre.slice(5);
    for (const object of others) {
      popularitySum += object.popularity;
      countSum += object.movie_count;
    }

    returnArray.sort((a, b) => {
      return b.popularityAverage - a.popularityAverage;
    });

    returnArray.push({
      popularityAverage: parseFloat((popularitySum / countSum).toFixed(2)),
      genre_id: 1,
      genre_name: "Other",
    });

    return returnArray;
  }

  async getVoteAveragePerMonthForGenre(genreId: number, year: number) {
    const genre = await this.genreRepository.read(genreId);
    const movies = await this.movieRepository.getMoviesByGenreID(genreId);
    const movieMonths = new Set();

    for (let i = 1; i <= 12; i++) {
      movieMonths.add(i);
    }

    movies.forEach((movie) => {
      const releaseMonth = new Date(movie.release_date).getMonth();
      const releaseYear = new Date(movie.release_date).getFullYear();
    });

    const voteAveragePerMonth = [];

    movieMonths.forEach((month) => {
      const periodStart = new Date(year, month as number, 1);
      const periodEnd = new Date(year, (month as number) + 1, 1);

      let totalVoteAverage = 0;
      let count = 0;

      movies.forEach((movie) => {
        const releaseDate = new Date(movie.release_date);
        if (releaseDate >= periodStart && releaseDate < periodEnd) {
          totalVoteAverage += movie.vote_average;
          count++;
        }
      });

      const voteAverageObj = {
        month: `${month as number}`,
        voteAverage: parseFloat((totalVoteAverage / count).toFixed(2))
          ? parseFloat((totalVoteAverage / count).toFixed(2))
          : 0,
      };

      voteAveragePerMonth.push(voteAverageObj);
    });

    return {
      genre,
      voteAveragePerMonth,
    };
  }
}
