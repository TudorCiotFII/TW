class MovieRepository {
  constructor(db) {
    this.db = db;
  }

  async getMovieById(id) {
    const query = "SELECT * FROM movies WHERE id = ?";
    return new Promise((resolve, reject) => {
      this.db.get(query, [id], (err, movie) => {
        if (err) {
          console.error("Error getting movie by id: ", err);
          reject(err);
        }
        resolve(movie);
      });
    });
  }

  async getAllMovies() {
    const query = "SELECT * FROM movies";
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, movies) => {
        if (err) {
          console.error("Error getting all movies: ", err);
          reject(err);
        }
        resolve(movies);
      });
    });
  }

  async createMovie(movie) {
    const query =
      "INSERT INTO movies (id, title, director, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, runtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const {
      id,
      title,
      director,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      vote_average,
      vote_count,
      runtime,
    } = movie;
    return new Promise((resolve, reject) => {
      this.db.run(
        query,
        [
          id,
          title,
          director,
          overview,
          poster_path,
          backdrop_path,
          release_date,
          vote_average,
          vote_count,
          runtime,
        ],
        function (err) {
          if (err) {
            console.error("Error creating movie: ", err);
            reject(err);
          }
          resolve(this.lastID);
        }
      );
    });
  }

  async updateMovie(id, movie) {
    const query =
      "UPDATE movies SET title = ?, director = ?, overview = ?, poster_path = ?, backdrop_path = ?, release_date = ?, vote_average = ?, vote_count = ?, runtime = ? WHERE id = ?";
    const {
      title,
      director,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      vote_average,
      vote_count,
      runtime,
    } = movie;
    return new Promise((resolve, reject) => {
      this.db.run(
        query,
        [
          title,
          director,
          overview,
          poster_path,
          backdrop_path,
          release_date,
          vote_average,
          vote_count,
          runtime,
          id,
        ],
        function (err) {
          if (err) {
            console.error("Error updating movie: ", err);
            reject(err);
          }
          resolve(this.changes);
        }
      );
    });
  }

  async deleteMovie(id) {
    const query = "DELETE FROM movies WHERE id = ?";
    return new Promise((resolve, reject) => {
      this.db.run(query, [id], function (err) {
        if (err) {
          console.error("Error deleting movie: ", err);
          reject(err);
        }
        resolve(this.changes);
      });
    });
  }
}

module.exports = MovieRepository;
