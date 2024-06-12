const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("main.sqlite");
const axios = require("axios");

const API_KEY = "ed11f55499efea6bd41f9233072f1d96";
const BASE_URL = "https://api.themoviedb.org/3";

// store all movie ids in an array
const movieIds = [];

const retryFailedMovies = () => {
  db.each(
    // select all movie ids from movies table
    "SELECT id FROM movies WHERE budget IS NULL",
    (err, row) => {
      if (err) {
        console.error(err.message);
      }

      movieIds.push(row.id);
    },
    () => {
      // for each movie id, fetch the movie data and insert it into the movies table
      movieIds.forEach((id) => {
        axios
          .get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)
          .then((res) => {
            const movieData = res.data;

            const updateQuery =
              "UPDATE movies SET budget = ?, revenue = ?, popularity = ? WHERE id = ?";
            db.run(
              updateQuery,
              [
                movieData.budget,
                movieData.revenue,
                movieData.popularity,
                movieData.id,
              ],
              (err) => {
                if (err) {
                  console.error(err.message);
                }

                console.log(`Movie ${movieData.id} updated!`);
              }
            );
          })
          .catch((error) => {
            console.error("Error fetching movies!");
          });
      });
    }
  );
};

const populateMoviesTable = (left, right) => {
  let movieInserts = [];

  for (let i = left; i <= right; ++i) {
    axios
      .get(`${BASE_URL}/movie/popular?page=${i}&api_key=${API_KEY}`)
      .then((res) => {
        const movies = res.data.results;

        movies.forEach((movie) => {
          const {
            id,
            title,
            overview,
            poster_path,
            backdrop_path,
            release_date,
            vote_average,
            vote_count,
            budget,
            revenue,
            popularity,
          } = movie;

          axios
            .get(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}`)
            .then((res2) => {
              const movieData = res2.data;

              const movieInsert = {
                id,
                title,
                overview,
                poster_path,
                backdrop_path,
                release_date,
                vote_average,
                vote_count,
                runtime: movieData.runtime,
                budget: movieData.budget,
                revenue: movieData.revenue,
                popularity: movieData.popularity,
              };

              axios
                .get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`)
                .then((res3) => {
                  const creditsData = res3.data;

                  const director = creditsData.crew.find(
                    (crewMember) => crewMember.job === "Director"
                  );

                  if (director) {
                    movieInsert.director = director.name;
                  }

                  movieInserts.push(movieInsert);
                })
                .catch((error) => {
                  console.error("Error fetching movies 1!");
                });
            })
            .catch((error) => {
              console.error("Error fetching movies 2!");
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching movies 3");
      });
  }

  setTimeout(async () => {
    const insertQuery =
      "INSERT INTO movies (id, title, director, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, runtime, budget, revenue, popularity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const stmt = await db.prepare(insertQuery);

    movieInserts.forEach(async (movie) => {
      const movieHasNoNullValues = Object.values(movie).every(
        (value) => value !== null
      );

      if (!movieHasNoNullValues) {
        return;
      }

      await stmt.run([
        movie.id,
        movie.title,
        movie.director,
        movie.overview,
        movie.poster_path,
        movie.backdrop_path,
        movie.release_date,
        movie.vote_average,
        movie.vote_count,
        movie.runtime,
        movie.budget,
        movie.revenue,
        movie.popularity,
      ]);
    });

    await stmt.finalize();

    console.log(`Movies inserted from page ${left} to ${right}!`);
  }, 10000);
};

// populateMoviesTable(100, 110);

retryFailedMovies();
