const API_KEY = "ed11f55499efea6bd41f9233072f1d96";
const BASE_URL = "https://api.themoviedb.org/3/";
// get a random number between 1 and 5
const randomPage = Math.floor(Math.random() * 5) + 1;
const API_URL =
  BASE_URL + `movie/popular?page=${randomPage}&api_key=` + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let rows = [],
  indexes = [1, 1, 1, 1, 1];
let currentRow;

let bannerIndexes = [];

let currentMovieId;

const showMovieBanner = async () => {
  let index = 0;

  const movieId = bannerIndexes[index];

  await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      currentMovieId = movieId;
      showBanner(data);
    });

  index++;

  setInterval(async () => {
    const movieId = bannerIndexes[index];
    await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        currentMovieId = movieId;
        showBanner(data);
      });

    index++;
    if (index >= bannerIndexes.length) {
      index = 0;
    }
  }, 6000);
};
const showBanner = async (data) => {
  const movieBanner = document.querySelector(".movie__banner");
  const backdropPath = data?.backdrop_path;
  const posterPath = data?.poster_path;
  const title = data?.title;
  const rating = data?.vote_average.toFixed(1);
  movieBanner.style.opacity = 0;

  setTimeout(() => {
    movieBanner.innerHTML = `
     <img src="${IMG_URL + backdropPath}" />
     <div class='movie__banner-poster'>
        <img src="${IMG_URL + posterPath}" />
     </div>
     <div class='movie__banner-info'>
        <h1>${title}</h1>
        <h1>${rating}&#9733;</h1>
     </div>
   `;

    movieBanner.style.opacity = 1;
  }, 500);
};

const loadMovies = async (genreId, page, rowIndex) => {
  const URL = `http://localhost:3000/movies?genreId=${genreId}&page=${page}&pageSize=4`;

  await fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.movies, genreId, rowIndex);
    });
};

const showMovies = async (data, genreId, rowIndex) => {
  const movieCardBigContainer = document.querySelector(
    ".movie__card-container"
  );

  let genreName;

  await fetch(`http://localhost:3000/genres/${genreId}`)
    .then((res) => res.json())
    .then((data) => {
      genreName = data.name;
    });

  const newRow = document.createElement("div");
  newRow.classList.add("movie__card-rows");
  newRow.innerHTML += `<h1>${genreName}</h1>`;

  const movieContainer = document.createElement("div");

  data.forEach((movie) => {
    const rating = movie.vote_average;
    const backdrop_path = movie.backdrop_path;
    const title = movie.title;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie-card");
    movieEl.addEventListener("click", () => {
      window.location.href = `http://localhost:3000/movies/${movie.id}`;
    });
    movieEl.innerHTML = `
      <img src="${IMG_URL + backdrop_path}" />
      <div class="overlay">
        <div class="content">
          <h3>${title}</h3>
          <p>${rating} &#9733;</p>
        </div>
      </div>
    `;

    movieContainer.appendChild(movieEl);
  });

  const loadButton = document.createElement("div");
  loadButton.classList.add("load-more-button");
  loadButton.id = `load-more-button-${rowIndex}`;
  loadButton.textContent;
  if (window.innerWidth < 768) {
    const loadButtonText = document.createElement("span");
    loadButtonText.classList.add("load-more-button-text");
    loadButtonText.id = `load-more-button-text-${rowIndex}`;
    loadButtonText.textContent = "Load More";
    loadButton.appendChild(loadButtonText);
  }

  newRow.appendChild(movieContainer);
  newRow.appendChild(loadButton);

  if (rows[rowIndex]) {
    rows[rowIndex].replaceWith(newRow);
    rows[rowIndex] = newRow;
  } else {
    movieCardBigContainer.appendChild(newRow);
    rows[rowIndex] = newRow;
  }
};

function handleLoadMoreButtonClick() {
  const movieCardBigContainer = document.querySelector(
    ".movie__card-container"
  );

  movieCardBigContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("load-more-button")) {
      const rowIndex = target.id.split("-")[3];
      let index = indexes[rowIndex];
      index++;
      if (index === 4) {
        index = 1;
      }

      indexes[rowIndex] = index;

      switch (rowIndex) {
        case "0":
          loadMovies(28, index, rowIndex);
          break;
        case "1":
          loadMovies(12, index, rowIndex);
          break;
        case "2":
          loadMovies(18, index, rowIndex);
          break;
        case "3":
          loadMovies(27, index, rowIndex);
          break;
        case "4":
          loadMovies(10749, index, rowIndex);
          break;
      }
    } else if (target.classList.contains("load-more-button-text")) {
      const rowIndex = target.id.split("-")[4];
      let index = indexes[rowIndex];
      index++;
      if (index === 4) {
        index = 1;
      }
      indexes[rowIndex] = index;
      switch (rowIndex) {
        case "0":
          loadMovies(28, index, rowIndex);
          break;
        case "1":
          loadMovies(12, index, rowIndex);
          break;
        case "2":
          loadMovies(18, index, rowIndex);
          break;
        case "3":
          loadMovies(27, index, rowIndex);
          break;
        case "4":
          loadMovies(10749, index, rowIndex);
          break;
      }
    }
  });
}
function addClickListeners() {
  let index;
  let rowIndex = 0;

  const movieCardBigContainer = document.querySelector(
    ".movie__card-container"
  );

  movieCardBigContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("fa")) {
      const direction = target.classList.contains("fa-angle-left")
        ? "left"
        : "right";
      if (direction === "left") {
        rowIndex = target.id;
        index = indexes[rowIndex];
        index--;
        if (index === 0) {
          index = 3;
        }
      } else if (direction === "right") {
        rowIndex = target.id;
        index = indexes[rowIndex];
        index++;
        if (index === 4) {
          index = 1;
        }
      }

      indexes[rowIndex] = index;

      switch (rowIndex) {
        case "0":
          loadMovies(28, index, rowIndex);
          break;
        case "1":
          loadMovies(12, index, rowIndex);
          break;
        case "2":
          loadMovies(18, index, rowIndex);
          break;
        case "3":
          loadMovies(27, index, rowIndex);
          break;
        case "4":
          loadMovies(10749, index, rowIndex);
          break;
      }
    }
  });
}

const prepareBanner = () => {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      bannerIndexes = data.results.map((movie) => {
        if (movie.id) {
          return movie.id;
        }
      });
      showMovieBanner();
    });
};

document.addEventListener("DOMContentLoaded", () => {
  prepareBanner();

  loadMovies(28, 1, 0);
  loadMovies(12, 1, 1);
  loadMovies(18, 1, 2);
  loadMovies(27, 1, 3);
  loadMovies(10749, 1, 4);

  addClickListeners();
  handleLoadMoreButtonClick();
});

document.querySelector(".movie__banner").addEventListener("click", () => {
  window.location.href = `http://localhost:3000/movies/${currentMovieId}`;
});
