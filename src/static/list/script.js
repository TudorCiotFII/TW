const IMG_URL = "https://image.tmdb.org/t/p/w500";
let moviesPerPage = 10;
let currentPage = 1;
let totalPages = 0;
let genreId = 0;
let minRating = null;
let year = null;
let queryString = null;

const genreSelect = document.getElementById("genre-select");

genreSelect.addEventListener("change", function () {
  genreId = genreSelect.value;
  createPagination(genreId, minRating, year, currentPage, moviesPerPage, null);
  loadMovies(genreId, minRating, year, currentPage, moviesPerPage, null);
  // Call the loadMovies function here or perform any other actions based on the selected genre
});

const ratingSelect = document.getElementById("rating-select");

ratingSelect.addEventListener("change", function () {
  minRating = ratingSelect.value;
  createPagination(genreId, minRating, year, currentPage, moviesPerPage, null);
  loadMovies(genreId, minRating, year, currentPage, moviesPerPage, null);
  // Call the loadMovies function here or perform any other actions based on the selected minRating
});

const yearSelect = document.getElementById("year-select");

yearSelect.addEventListener("change", function () {
  year = yearSelect.value;
  createPagination(genreId, minRating, year, currentPage, moviesPerPage, null);
  loadMovies(genreId, minRating, year, currentPage, moviesPerPage, null);
  // Call the loadMovies function here or perform any other actions based on the selected year
});

// Function to handle page size
const form = document.querySelector("form");
const quantityInput = document.getElementById("quantity");

quantityInput.addEventListener("input", function () {
  moviesPerPage = quantityInput.value;
  currentPage = 1;
  createPagination(genreId, minRating, year, currentPage, moviesPerPage, null);
  loadMovies(genreId, minRating, year, currentPage, moviesPerPage, null);
});
const movieCardContainer = document.querySelector(".movie__card-container");

const updateActivePage = (currentPage) => {
  const paginationLinks = document.querySelectorAll(".pagination a");

  paginationLinks.forEach((link) => {
    link.classList.remove("active");
    link.id = link.id.replace("pageA-", "page-"); // Reset the id

    const id = link.id;
    if (id === `page-${currentPage}`) {
      link.classList.add("active");
      link.id = `pageA-${currentPage}`;
    }
  });
};

// Function to handle page navigation
const handlePageNavigation = (event) => {
  event.preventDefault();

  const target = event.target;
  if (target.tagName === "A") {
    const id = target.id;

    if (id === "prev-page") {
      if (currentPage > 1) {
        currentPage--;
      }
    } else if (id === "next-page") {
      // Add your logic to determine the total number of pages
      if (currentPage < totalPages) {
        currentPage++;
      }
    } else {
      currentPage = parseInt(id.replace("page-", ""));
    }
    loadMovies(
      genreId,
      minRating,
      year,
      currentPage,
      moviesPerPage,
      queryString
    );
    updateActivePage(currentPage);
  }
};

const createPagination = async (
  genreId,
  minRating,
  year,
  page,
  pagesize,
  queryString
) => {
  let URL = `http://localhost:3000/movies?genreId=${genreId}`;
  if (minRating) URL += `&minRating=${minRating}`;
  if (year) URL += `&year=${year}`;
  if (page) URL += `&page=${page}`;
  if (pagesize) URL += `&pageSize=${pagesize}`;
  if (queryString) URL += `&queryString=${queryString}`;
  await fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      const totalMovies = data.total;
      totalPages = Math.ceil(totalMovies / moviesPerPage);
      const paginationContainer = document.getElementById(
        "pagination-container"
      );
      paginationContainer.innerHTML = "";

      // Previous Page Link
      const prevPageLink = document.createElement("a");
      prevPageLink.id = "prev-page";
      prevPageLink.innerHTML = "&laquo;";
      prevPageLink.addEventListener("click", handlePageNavigation);
      paginationContainer.appendChild(prevPageLink);

      const pageLink = document.createElement("a");
      pageLink.id = `pageA-1`;
      pageLink.textContent = 1;
      pageLink.classList.add("active");
      pageLink.addEventListener("click", handlePageNavigation);

      paginationContainer.appendChild(pageLink);

      // Generate page links
      for (let i = 2; i <= totalPages; i++) {
        const pageLink = document.createElement("a");
        pageLink.id = `page-${i}`;
        pageLink.textContent = i;
        pageLink.addEventListener("click", handlePageNavigation);

        paginationContainer.appendChild(pageLink);
      }

      // Next Page Link
      const nextPageLink = document.createElement("a");
      nextPageLink.id = "next-page";
      nextPageLink.innerHTML = "&raquo;";
      paginationContainer.appendChild(nextPageLink);
      nextPageLink.addEventListener("click", handlePageNavigation);
    });
};
createPagination(
  genreId,
  minRating,
  year,
  currentPage,
  moviesPerPage,
  queryString
);

// Function to load movies
const loadMovies = async (
  genreId,
  minRating,
  year,
  page,
  pagesize,
  queryString
) => {
  let URL = `http://localhost:3000/movies?genreId=${genreId}`;
  if (minRating) URL += `&minRating=${minRating}`;
  if (year) URL += `&year=${year}`;
  if (page) URL += `&page=${page}`;
  if (pagesize) URL += `&pageSize=${pagesize}`;
  if (queryString) URL += `&queryString=${queryString}`;

  await fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.movies);
    });
};

// Function to display movies
const showMovies = async (data) => {
  movieCardContainer.innerHTML = ""; // Clear existing movies

  data.forEach((movie) => {
    const rating = movie.vote_average;
    const poster_path = movie.poster_path;
    const title = movie.title;
    const overview = movie.overview;

    const movieBlock = document.createElement("div");
    movieBlock.classList.add("movies-block__content");
    movieBlock.addEventListener("click", () => {
      window.location.href = `http://localhost:3000/movies/${movie.id}`;
    });
    const image = document.createElement("img");
    image.src = IMG_URL + poster_path;
    image.alt = `${title} poster`;

    const textContainer = document.createElement("div");
    textContainer.classList.add("movies-block__content-text");

    const movieTitle = document.createElement("h2");
    movieTitle.textContent = title;

    const movieOverview = document.createElement("p");
    movieOverview.textContent = overview;

    textContainer.appendChild(movieTitle);
    textContainer.appendChild(movieOverview);

    movieBlock.appendChild(image);
    movieBlock.appendChild(textContainer);

    movieCardContainer.appendChild(movieBlock);
  });
};
loadMovies(genreId, minRating, year, currentPage, moviesPerPage, queryString);

let suggestions = [
  "Star Wars",
  "Pirates of the Caribbean: The Curse of the Black Pearl",
  "Pirates of the Caribbean: Dead Man's Chest",
  "Pretty Woman",
  "Charlie and the Chocolate Factory",
  "The Lord of the Rings: The Fellowship of the Ring",
  "Spirited Away",
  "The Dark Knight",
  "The Godfather",
  "The Shawshank Redemption",
  "Pirates of the Caribbean: At World's End",
  "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
  "Ice Age",
  "Spider-Man",
  "Monsters, Inc.",
  "Titanic",
  "Harry Potter and the Philosopher's Stone",
  "Harry Potter and the Chamber of Secrets",
  "Harry Potter and the Prisoner of Azkaban",
  "Harry Potter and the Goblet of Fire",
  "Harry Potter and the Order of the Phoenix",
  "Harry Potter and the Half-Blood Prince",
  "Shrek",
  "Shrek 2",
  "Toy Story",
  "Toy Story 2",
  "Iron Man",
  "Pirates of the Caribbean: On Stranger Tides",
  "The Amazing Spider-Man",
  "Ratatouille",
  "Scream",
  "Scary Movie",
  "Brothers",
  "The Lion King",
  "Twilight",
  "Caligula",
  "Iron Man 2",
  "The Little Mermaid",
  "White Men Can't Jump",
  "Thor",
  "The Princess and the Frog",
  "Peter Pan",
  "Mulan",
  "Cinderella",
  "White Chicks",
  "Harry Potter and the Deathly Hallows: Part 1",
  "Harry Potter and the Deathly Hallows: Part 2",
  "Up",
  "Coraline",
  "Avatar",
];

/// Getting all required elements
const searchInput = document.querySelector(".searchInput");
const input = searchInput.querySelector("input");
const resultBox = searchInput.querySelector(".resultBox");
const icon = searchInput.querySelector(".icon");
let linkTag = searchInput.querySelector("a");
let webLink;

// If the user presses any key and releases it
input.onkeyup = (e) => {
  let userData = e.target.value; // User entered data
  let emptyArray = [];
  if (userData) {
    emptyArray = suggestions.filter((data) => {
      // Filtering array value and user characters to lowercase and return only those words which start with the user entered chars
      return data.toLowerCase().startsWith(userData.toLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      // Passing returned data inside li tag
      return "<li>" + data + "</li>";
    });
    searchInput.classList.add("active"); // Show autocomplete box
    showSuggestions(emptyArray);
    let allList = resultBox.querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
      // Adding onclick attribute to all li tags
      allList[i].setAttribute("onclick", "select(this)");
    }
  } else {
    searchInput.classList.remove("active"); // Hide autocomplete box
  }
};

// Function to show the suggestions in the result box
function showSuggestions(list) {
  let listData;
  if (!list.length) {
    listData = "<li>" + input.value + "</li>";
  } else {
    listData = list.join("");
  }
  resultBox.innerHTML = listData;
}

// Function to handle the selection of a suggestion
function select(element) {
  let selectData = element.textContent;
  input.value = selectData;
  searchInput.classList.remove("active");
  // Perform any desired actions with the selected value
}

const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", function () {
  const input = document.querySelector(".searchInput input");
  queryString = input.value;
  input.value = "";
  searchInput.classList.remove("active");
  search(queryString);
  queryString = "";
});

const search = async (queryString) => {
  const URL = `http://localhost:3000/movies?genreId=0&page=1&pageSize=${moviesPerPage}&queryString=${queryString}`;

  await fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.movies);
    });
  createPagination(0, null, null, 1, moviesPerPage, queryString);
};
