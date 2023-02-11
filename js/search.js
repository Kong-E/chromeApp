const searchForm = document.getElementById("search-form");
const query = document.querySelector(".query");

searchForm.addEventListener("submit", () => {
  let url = `https://www.google.com/search?q=${query.value}`;
  window.open(url);
});
