const containerMovie = document.querySelector(".movies");
const buttonPrev = document.querySelector(".btn-prev");
const buttonNext = document.querySelector(".btn-next");
const searchInput = document.querySelector(".input");
const themeButton = document.querySelector(".btn-theme");
const body = document.querySelector("body");

let mudarFoto = false;
let presentPages = 0;
let allMovies = [];

const controls = {
  next() {
    if (presentPages === 3) {
      presentPages = 0;
    } else {
      presentPages++;
    }
    displayMovies();
  },
  prev() {
    if (presentPages === 0) {
      presentPages = 3;
    } else {
      presentPages--;
    }
    displayMovies();
  },
  inputValue(event) {
    if (event.key !== "Enter") return;
    presentPages = 0;
    if (searchInput.value) {
      searchMovie(searchInput.value);
    } else {
      listMovies();
    }
    searchInput.value = "";
  },
  addHiddenModal() {
    modalMovie.classList.add("hidden");
  },
  buttonModalClose() {
    modalMovie.classList.add("hidden");
  },
  toogleTheme() {
    body.style.setProperty(
      "--background-color",
      body.style.getPropertyValue("--background-color") === "#242424"
        ? "#FFF"
        : "#242424"
    );
    body.style.setProperty(
      "--highlight-background",
      body.style.getPropertyValue("--highlight-background") === "#454545"
        ? "#FFF"
        : "#454545"
    );
    body.style.setProperty(
      "--shadow-color",
      body.style.getPropertyValue("--shadow-color") ===
        "0px 4px 8px rgba(255, 255, 255, 0.15)"
        ? "0px 4px 8px rgba(0, 0, 0, 0.15)"
        : "0px 4px 8px rgba(255, 255, 255, 0.15)"
    );
    body.style.setProperty(
      "--highlight-color",
      body.style.getPropertyValue("--highlight-color") ===
        "rgba(255, 255, 255, 0.7)"
        ? "rgba(0, 0, 0, 0.7)"
        : "rgba(255, 255, 255, 0.7)"
    );
    body.style.setProperty(
      "--highlight-description",
      body.style.getPropertyValue("--highlight-description") === "#FFF"
        ? "#000"
        : "#FFF"
    );
    body.style.setProperty(
      "--color",
      body.style.getPropertyValue("--color") === "#FFF" ? "#000" : "#FFF"
    );

    if (!mudarFoto) {
      themeButton.src = "../assets/dark-mode.svg";
      buttonNext.src = "../assets/seta-direita-branca.svg";
      buttonPrev.src = "../assets/seta-esquerda-branca.svg";
      mudarFoto = true;
      return;
    }
    if (mudarFoto) {
      themeButton.src = "../assets/light-mode.svg";
      buttonNext.src = "../assets/seta-direita-preta.svg";
      buttonPrev.src = "../assets/seta-esquerda-preta.svg";
      mudarFoto = false;
    }
  },
};

themeButton.addEventListener("click", controls.toogleTheme);

const displayMovies = () => {
  containerMovie.textContent = "";
  let start = presentPages * 5;
  let end = start + 1 * 5;

  const paginatedItems = allMovies.slice(start, end);
  paginatedItems.forEach((currentMovie) => {
    const posterMovie = document.createElement("div");
    posterMovie.classList.add("movie");
    posterMovie.style.backgroundImage = `url(${currentMovie.poster_path})`;

    posterMovie.addEventListener("click", () => {
      modalMovies(currentMovie.id);
    });

    const cardText = document.createElement("div");
    cardText.classList.add("movie__info");

    const spanTitle = document.createElement("span");
    spanTitle.classList.add("movie__title");
    spanTitle.textContent = currentMovie.title;

    const spanRating = document.createElement("span");
    spanRating.classList.add("movie__rating");

    const starImg = document.createElement("img");
    starImg.alt = "Estrela";
    starImg.src = "../assets/estrela.svg";

    spanRating.append(starImg, currentMovie.vote_average);
    cardText.append(spanTitle, spanRating);
    posterMovie.appendChild(cardText);
    containerMovie.appendChild(posterMovie);
  });
};

buttonNext.addEventListener("click", controls.next);
buttonPrev.addEventListener("click", controls.prev);

const listMovies = async () => {
  const responseApi = await fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
  );
  const responseJson = await responseApi.json();
  allMovies = responseJson.results;
  displayMovies();
};

const searchMovie = async (value) => {
  const responseApi = await fetch(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${value}`
  );
  const responseJson = await responseApi.json();
  allMovies = responseJson.results;
  displayMovies();
};

searchInput.addEventListener("keyup", controls.inputValue);

const highlightBackDrop = document.querySelector(".highlight__video");
const highlightTitle = document.querySelector(".highlight__title");
const highlightRating = document.querySelector(".highlight__rating");
const highlightGenres = document.querySelector(".highlight__genres");
const highlightlaunch = document.querySelector(".highlight__launch");
const highlightDescription = document.querySelector(".highlight__description");
const highlightVideo = document.querySelector(".highlight__video-link");

const movieDay = async () => {
  const responseApi = await fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
  );
  const responseJson = await responseApi.json();

  highlightBackDrop.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6) 100%, rgba(0, 0, 0, 0.6) 100%), url(${responseJson.backdrop_path})`;
  highlightTitle.textContent = responseJson.title;
  highlightRating.textContent = responseJson.vote_average.toFixed(1);
  highlightGenres.textContent = responseJson.genres
    .map((genre) => genre.name)
    .join(", ");
  highlightlaunch.textContent = responseJson.release_date
    .split("-")
    .reverse()
    .join("/");
  highlightDescription.textContent = responseJson.overview;

  watchMovieDay();
};

const watchMovieDay = async () => {
  const responseApi = await fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
  );
  const responseJson = await responseApi.json();
  highlightVideo.href = `https://www.youtube.com/watch?v=${responseJson.results[0].key}`;
};

const modalMovie = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal__title");
const modalImg = document.querySelector(".modal__img");
const modalDescription = document.querySelector(".modal__description");
const modalAverage = document.querySelector(".modal__average");
const modalGenres = document.querySelector(".modal__genres");
const modalClose = document.querySelector(".modal__close");

const modalMovies = async (id) => {
  modalMovie.classList.remove("hidden");

  const responseApi = await fetch(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`
  );
  const responseJson = await responseApi.json();

  modalTitle.textContent = responseJson.title;
  modalImg.src = responseJson.backdrop_path;
  modalImg.alt = responseJson.title;
  modalDescription.textContent = responseJson.overview;
  modalAverage.textContent = responseJson.vote_average.toFixed(1);
  modalGenres.innerHTML = "";

  responseJson.genres.forEach((genre) => {
    const modalGenre = document.createElement("span");
    modalGenre.textContent = genre.name;
    modalGenre.classList.add("modal__genre");
    modalGenres.appendChild(modalGenre);
  });
};

modalClose.addEventListener("click", controls.buttonModalClose);
modalImg.addEventListener("click", controls.addHiddenModal);

listMovies();
movieDay();
