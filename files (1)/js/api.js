

const API_BASE_URL = "https://api.tvmaze.com";


async function fetchShowsPage(page) {
  const url = `${API_BASE_URL}/shows?page=${page}`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`La API respondió con estado ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Re-lanzamos con un mensaje amigable para que app.js lo muestre en la UI
    throw new Error(
      `No se pudo obtener la cartelera (página ${page}): ${error.message}`
    );
  }
}


async function searchShows(query) {
  const url = `${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`La API respondió con estado ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((result) => result.show).filter(Boolean);
  } catch (error) {
    throw new Error(`No se pudo buscar "${query}": ${error.message}`);
  }
}
