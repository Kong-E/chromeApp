const address = document.querySelector("#address");
const text = document.querySelector("#bm-text");
const bookmark = document.querySelector("#bookmark");
const addBtn = document.querySelector("#add-btn");
const editBtn = document.querySelector("#edit-btn");
const modal = document.querySelector("#modal");
const modalName = document.querySelector("#modal-name");
const modalLink = document.querySelector("#modal-link");
const saveBtn = document.querySelector("#save-btn");
const closeBtn = document.querySelector("#close-btn");

const HIDDEN = "hidden";
const BOOKMARK_KEY = "bookmark";

let bookmarks = [];

function saveBookmarks() {
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
}

function enterToggle() {
  text.classList.add(HIDDEN);
  bookmark.classList.remove(HIDDEN);
}

function leaveToggle() {
  text.classList.remove(HIDDEN);
  bookmark.classList.add(HIDDEN);
  modal.classList.add(HIDDEN);
}

function modalToggle() {
  modal.classList.toggle(HIDDEN);
  modalLink.value = "https://";
}

function paintBookmark(bmObj) {
  const div = document.createElement("div");
  div.id = bmObj.ID;
  const a = document.createElement("a");
  a.innerText = bmObj.name;
  a.href = bmObj.link;
  a.target = "_blank";
  const btn = document.createElement("button");
  btn.innerHTML = '<i class="fa-regular fa-x"></i>';
  btn.id = "del-btn";
  btn.classList.add(HIDDEN);
  div.append(a);
  div.append(btn);
  bookmark.prepend(div);
}

function submitBookmark(e) {
  e.preventDefault();
  if (modalName.value === "" || modalLink.value === "") return;
  const bmName = modalName.value;
  const bmLink = modalLink.value;
  modalName.value = "";
  modalLink.value = "https://";
  const bmObj = {
    ID: Date.now(),
    name: bmName,
    link: bmLink,
  };
  bookmarks.push(bmObj);
  paintBookmark(bmObj);
  saveBookmarks();
}

address.addEventListener("mouseenter", enterToggle);
address.addEventListener("mouseleave", leaveToggle);
addBtn.addEventListener("click", modalToggle);
saveBtn.addEventListener("click", submitBookmark);
closeBtn.addEventListener("click", modalToggle);
editBtn.addEventListener("click", () => {
  const deleteBtns = document.querySelectorAll("#del-btn");
  deleteBtns.forEach((btn) => {
    btn.classList.toggle(HIDDEN);
    btn.addEventListener("click", (e) => {
      const div = e.target.parentElement.parentElement;
      div.remove();
      console.log(e.target);
      bookmarks = bookmarks.filter((item) => item.ID !== parseInt(div.id));
      saveBookmarks();
    });
  });
});

const savedBookmarks = localStorage.getItem(BOOKMARK_KEY);

if (savedBookmarks !== null) {
  const parsedBookmarks = JSON.parse(savedBookmarks);
  bookmarks = parsedBookmarks;
  bookmarks.forEach(paintBookmark);
}
