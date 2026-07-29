

(function () {
  const gridEl = document.getElementById("cardsGrid");
  const paginationEl = document.getElementById("pagination");
  const statusRowEl = document.getElementById("statusRow");
  const statusTextEl = document.getElementById("statusText");
  const clockEl = document.getElementById("clock");
  const searchFormEl = document.getElementById("searchForm");
  const searchInputEl = document.getElementById("searchInput");
  const searchClearEl = document.getElementById("searchClear");

  const SEARCH_DEBOUNCE_MS = 400;
  const MIN_QUERY_LENGTH = 2;

  const state = {
    page: 0,
    isLoading: false,
    hasNext: true,
    mode: "browse", // "browse" | "search"
    query: "",
  };

  let searchDebounceTimer = null;

  function setStatus(message, type = "normal") {
    statusTextEl.textContent = message;
    statusRowEl.classList.toggle("is-error", type === "error");
    statusRowEl.classList.toggle("is-hidden", !message);
  }

  /**
   * Carga y muestra una página del catálogo.
   * @param {number} page
   */
  async function loadPage(page) {
    state.isLoading = true;
    setStatus("Cargando función…");
    renderPagination(paginationEl, state, handlePageChange); // deshabilita botones mientras carga

    try {
      const shows = await fetchShowsPage(page);

      if (shows.length === 0) {
        // No hay más contenido: nos quedamos en la página anterior válida
        state.hasNext = false;
        setStatus("No hay más resultados en la cartelera.");
      } else {
        state.page = page;
        state.hasNext = true;
        renderCards(gridEl, shows);
        setStatus(`Mostrando ${shows.length} títulos — página ${page + 1}`);
      }
    } catch (error) {
      setStatus(error.message, "error");
    } finally {
      state.isLoading = false;
      renderPagination(paginationEl, state, handlePageChange);
    }
  }

  function handlePageChange(newPage) {
    if (newPage < 0) return;
    loadPage(newPage);
  }

  function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    clockEl.textContent = `${hh}:${mm}`;
  }


  async function runSearch(query) {
    state.mode = "search";
    state.isLoading = true;
    paginationEl.classList.add("is-hidden");
    setStatus(`Buscando "${query}"…`);

    try {
      const results = await searchShows(query);
      if (query !== state.query) return; // el usuario ya cambió el texto

      if (results.length === 0) {
        gridEl.innerHTML = "";
        setStatus(`Sin coincidencias para "${query}".`);
      } else {
        renderCards(gridEl, results);
        setStatus(`${results.length} coincidencia(s) para "${query}".`);
      }
    } catch (error) {
      if (query === state.query) setStatus(error.message, "error");
    } finally {
      if (query === state.query) state.isLoading = false;
    }
  }

 
  function exitSearchMode() {
    if (state.mode === "browse") return;
    state.mode = "browse";
    paginationEl.classList.remove("is-hidden");
    loadPage(state.page);
  }

  function handleSearchInput() {
    const query = searchInputEl.value.trim();
    state.query = query;
    searchClearEl.hidden = query.length === 0;

    clearTimeout(searchDebounceTimer);

    if (query.length === 0) {
      exitSearchMode();
      return;
    }

    if (query.length < MIN_QUERY_LENGTH) {
      setStatus("Escribe al menos 2 caracteres para buscar…");
      return;
    }

    searchDebounceTimer = setTimeout(() => runSearch(query), SEARCH_DEBOUNCE_MS);
  }

  function handleSearchClear() {
    searchInputEl.value = "";
    state.query = "";
    searchClearEl.hidden = true;
    clearTimeout(searchDebounceTimer);
    exitSearchMode();
    searchInputEl.focus();
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    setInterval(updateClock, 1000 * 30);
    loadPage(state.page);

    searchInputEl.addEventListener("input", handleSearchInput);
    searchClearEl.addEventListener("click", handleSearchClear);
    searchFormEl.addEventListener("submit", (event) => {
      event.preventDefault(); // evita recargar la página al presionar Enter
      clearTimeout(searchDebounceTimer);
      const query = searchInputEl.value.trim();
      if (query.length >= MIN_QUERY_LENGTH) runSearch(query);
    });
  });
})();
