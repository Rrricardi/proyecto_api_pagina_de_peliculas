
function extractYear(dateStr) {
  if (!dateStr) return "S/D"; // sin dato
  return dateStr.split("-")[0];
}


function createShowCard(show) {
  const card = document.createElement("article");
  card.className = "card";

  // ---- Póster ----
  const posterWrap = document.createElement("div");
  posterWrap.className = "card-poster-wrap";

  const posterUrl = show.image ? show.image.medium || show.image.original : null;

  if (posterUrl) {
    const img = document.createElement("img");
    img.className = "card-poster";
    img.src = posterUrl;
    img.alt = `Póster de ${show.name}`;
    img.loading = "lazy";
    posterWrap.appendChild(img);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "card-poster-fallback";
    fallback.textContent = show.name || "Sin imagen disponible";
    posterWrap.appendChild(fallback);
  }

  const yearStub = document.createElement("span");
  yearStub.className = "card-year-stub";
  yearStub.textContent = extractYear(show.premiered);
  posterWrap.appendChild(yearStub);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = show.name || "Título desconocido";

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const genre = document.createElement("span");
  genre.textContent = (show.genres && show.genres[0]) || "Género variado";

  const rating = document.createElement("span");
  rating.className = "card-rating dot";
  const score = show.rating && show.rating.average ? show.rating.average : "S/D";
  rating.textContent = `★ ${score}`;

  meta.appendChild(genre);
  meta.appendChild(rating);

  body.appendChild(title);
  body.appendChild(meta);

  card.appendChild(posterWrap);
  card.appendChild(body);

  return card;
}


function renderCards(container, shows) {
  container.innerHTML = "";

  const fragment = document.createDocumentFragment();
  shows.forEach((show) => {
    fragment.appendChild(createShowCard(show));
  });

  container.appendChild(fragment);
}
