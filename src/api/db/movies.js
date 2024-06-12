const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");
const axios = require("axios");

const API_KEY = "ed11f55499efea6bd41f9233072f1d96";
const BASE_URL = "https://api.themoviedb.org/3";

// db.run("DELETE FROM movie_actors WHERE movie_id > 0");

const populateGenresTable = () => {
  axios
    .get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
    .then((res) => {
      const genres = res.data.genres;

      genres.forEach((genre) => {
        const { id, name } = genre;

        db.run(
          "INSERT INTO genres (id, name) VALUES (?, ?)",
          [id, name],
          (err) => {
            if (err) {
              console.error("Error inserting genre.", err);
            }
          }
        );
      });
    })
    .catch((error) => {
      console.error("Error fetching genres!", error);
    });
};

const populateMovieGenresTable = () => {
  db.all("SELECT id FROM movies", (err, rows) => {
    if (err) {
      console.error("Error retrieving the movie IDs.", err);
    }

    rows.forEach((row) => {
      const movieID = row.id;

      axios
        .get(`${BASE_URL}/movie/${movieID}?api_key=${API_KEY}`)
        .then((res) => {
          const genres = res.data.genres;

          genres.forEach((genre) => {
            const genreID = genre.id;

            db.run(
              "INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)",
              [movieID, genreID],
              (err) => {
                if (err) {
                  console.error("Error inserting movie genre.", err);
                }
              }
            );
          });
        });
    });
  });
};

const populateActorsTable = async () => {
  try {
    const movieIDs = await new Promise((resolve, reject) => {
      db.all("SELECT id FROM movies", (err, rows) => {
        if (err) {
          console.error("Error retrieving the movie IDs.", err);
          reject(err);
        }
        resolve(rows.map((row) => row.id));
      });
    });

    for (const movieID of movieIDs) {
      const res = await axios.get(
        `${BASE_URL}/movie/${movieID}/credits?api_key=${API_KEY}`
      );
      const cast = res.data.cast;

      for (const actor of cast) {
        const { id, name, profile_path, gender } = actor;
        const actorHasNoNullValues = Object.values(actor).every(
          (value) => value !== null
        );

        if (!actorHasNoNullValues) {
          continue;
        }

        const existingActor = await new Promise((resolve, reject) => {
          db.get("SELECT id FROM actors WHERE id = ?", [id], (err, row) => {
            if (err) {
              console.error("Error checking actor existence.", err);
              reject(err);
            }
            resolve(row);
          });
        });

        if (!existingActor) {
          await new Promise((resolve, reject) => {
            db.run(
              "INSERT INTO actors (id, name, profile_path, gender) VALUES (?, ?, ?, ?)",
              [id, name, profile_path, gender],
              (err) => {
                if (err) {
                  console.error("Error inserting actor.", err);
                  reject(err);
                }
                resolve();
              }
            );
          });
        }
      }
    }
  } catch (error) {
    console.error("Error populating actors table.", error);
  }
};

const populateMovieActorsTable = async () => {
  db.all("SELECT id FROM movies", (err, rows) => {
    if (err) {
      console.error("Error retrieving the movie IDs.", err);
      return;
    }

    rows.forEach((row) => {
      const movieID = row.id;

      axios
        .get(`${BASE_URL}/movie/${movieID}/credits?api_key=${API_KEY}`)
        .then((res) => {
          const actors = res.data.cast;

          actors.forEach((actorInfo) => {
            const { id, character, order } = actorInfo;

            db.get(
              "SELECT * FROM movie_actors WHERE movie_id = ? AND actor_id = ?",
              [movieID, id],
              (err, existingRow) => {
                if (err) {
                  console.error("Error checking existing record.", err);
                  return;
                }

                console.log(
                  "Inserting movie actor:",
                  movieID,
                  id,
                  character,
                  order
                );

                if (!existingRow) {
                  db.run(
                    "INSERT INTO movie_actors (movie_id, actor_id, character, order_no) VALUES (?, ?, ?, ?)",
                    [movieID, id, character, order],
                    (err) => {
                      if (err) {
                        console.error("Error inserting movie actor.", err);
                      } else {
                        console.log(
                          "Successfully inserted movie actor:",
                          movieID,
                          id,
                          character,
                          order
                        );
                      }
                    }
                  );
                } else {
                  console.log(
                    "Skipping duplicate movie actor:",
                    movieID,
                    id,
                    character,
                    order
                  );
                }
              }
            );
          });
        });
    });
  });
};

// populateGenresTable();
// populateMovieGenresTable();
// populateActorsTable();
// populateMovieActorsTable();
