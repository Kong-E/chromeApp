const address = document.querySelector("#address");
const text = document.querySelector("#bm-text");
const addBtn = document.querySelector("#add-btn");
const modalName = document.querySelector("#modal-name");
const modalLink = document.querySelector("#modal-link");
const saveBtn = document.querySelector("#save-btn");
const closeBtn = document.querySelector("#close-btn");
const bookmark = document.querySelector("#bookmark");
const modal = document.querySelector("#modal");

const HIDDEN = "hidden";
const BOOKMARK_KEY = "bookmark";

let bookmarks = [];

function togg() {
  text.classList.toggle(HIDDEN);
  bookmark.classList.toggle(HIDDEN);
}

function modalToggle() {
  modal.classList.toggle(HIDDEN);
}

function paintBookmark(bmObj) {
  const a = document.createElement("a");
  a.innerText = bmObj.name;
  a.href = bmObj.link;
  a.target = "_blank";
  bookmark.prepend(a);
}

function submitBookmark(e) {
  e.preventDefault();
  if (modalName.value === "" || modalLink.value === "") return;
  const bmName = modalName.value;
  const bmLink = modalLink.value;
  modalName.value = "";
  modalLink.value = "";
  const bmObj = {
    id: Date.now(),
    name: bmName,
    link: bmLink,
  };
  bookmarks.push(bmObj);
  paintBookmark(bmObj);
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
}

address.addEventListener("mouseenter", togg);
address.addEventListener("mouseleave", togg);
addBtn.addEventListener("click", modalToggle);
saveBtn.addEventListener("click", submitBookmark);
closeBtn.addEventListener("click", modalToggle);

const savedBookmarks = localStorage.getItem(BOOKMARK_KEY);

if (savedBookmarks !== null) {
  const parsedBookmarks = JSON.parse(savedBookmarks);
  bookmarks = parsedBookmarks;
  bookmarks.forEach(paintBookmark);
}
