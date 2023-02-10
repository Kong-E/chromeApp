const address = document.querySelector("#address");
const text = document.querySelector("#bm-text");
const bookmark = document.querySelector("#bookmark");

const HIDDEN = "hidden";
const STYLE = "style";

address.addEventListener("mouseenter", () => {
  text.classList.toggle(HIDDEN);
  bookmark.classList.toggle(HIDDEN);
  address.classList.toggle(STYLE);
});
address.addEventListener("mouseleave", () => {
  text.classList.toggle(HIDDEN);
  bookmark.classList.toggle(HIDDEN);
  address.classList.toggle(STYLE);
});
