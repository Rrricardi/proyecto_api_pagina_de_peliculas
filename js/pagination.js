
function renderPagination(container, state, onPageChange) {
  container.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.className = "ticket ticket--prev";
  prevButton.textContent = "← Anterior";
  prevButton.disabled = state.page <= 0 || state.isLoading;
  prevButton.addEventListener("click", () => onPageChange(state.page - 1));

  const pageIndicator = document.createElement("span");
  pageIndicator.className = "ticket-page";
  pageIndicator.textContent = String(state.page + 1).padStart(2, "0");

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "ticket ticket--next";
  nextButton.textContent = "Siguiente →";
  nextButton.disabled = !state.hasNext || state.isLoading;
  nextButton.addEventListener("click", () => onPageChange(state.page + 1));

  container.appendChild(prevButton);
  container.appendChild(pageIndicator);
  container.appendChild(nextButton);
}
