const toDoForm = document.getElementById("todo-form");
const toDoInput = document.querySelector("#todo-form input");
const toDoList = document.getElementById("todo-list");
// const toDoRemove = document.getElementById("all-remove");

const TODOS_KEY = "todos";
const LINE_THROUGH = "line-through";

let toDos = [];

// toDoRemove.addEventListener("click",deleteAllToDo);

function changeOrder(e) {
  const li = e.target.parentElement.parentElement;
  let idx;
  // 바꿀요소의 인덱스 추출
  for (var i = 0; i < toDos.length; i++) {
    if (toDos[i].ID === parseInt(li.id)) {
      idx = i;
      break;
    }
  }
  if (idx === 0) return;
  const target = toDos.splice(idx, 1)[0];
  toDos.splice(idx - 1, 0, target);
  deleteAllToDo();
  toDos.forEach(paintToDo);
  const lis = document.querySelectorAll("ul li");
  for (var i = 0; i < toDos.length; i++) {
    if (toDos[i].done === true) {
      lis[i].childNodes[0].classList.add(LINE_THROUGH);
    }
  }
  saveToDos();
}

function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function deleteToDo(e) {
  const li = e.target.parentElement.parentElement;
  li.remove();
  toDos = toDos.filter((item) => item.ID !== parseInt(li.id));
  saveToDos();
}

function deleteAllToDo() {
  //임시
  toDoList.innerHTML = ``;
}

function addLineThrough(e) {
  e.target.classList.toggle(LINE_THROUGH);

  // 로컬스토리지 연동
  const li = e.target.parentElement;
  if (e.target.classList.contains(LINE_THROUGH)) {
    toDos = toDos.map((item) =>
      item.ID === parseInt(li.id) ? { ...item, done: true } : item
    );
  } else {
    toDos = toDos.map((item) =>
      item.ID === parseInt(li.id) ? { ...item, done: false } : item
    );
  }
  saveToDos();
}

function paintToDo(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.ID;
  const span = document.createElement("span");
  span.innerText = newTodo.text;
  span.addEventListener("click", addLineThrough);
  const button1 = document.createElement("button");
  button1.innerHTML = '<span class="fa-solid fa-x"></span>';
  button1.children[0].addEventListener("click", deleteToDo);
  const button2 = document.createElement("button");
  button2.innerHTML = '<span class="fa-solid fa-caret-up"></span>';
  button2.title = "위로 올리기";
  button2.children[0].addEventListener("click", changeOrder);
  li.appendChild(span);
  li.appendChild(button1);
  li.appendChild(button2);
  toDoList.appendChild(li);
}

function handleToDoSubmit(e) {
  e.preventDefault();
  const newTodo = toDoInput.value;
  toDoInput.value = "";
  const newTodoObj = {
    text: newTodo,
    ID: Date.now(),
    done: false,
  };
  toDos.push(newTodoObj);
  paintToDo(newTodoObj);
  saveToDos();
}

toDoForm.addEventListener("submit", handleToDoSubmit);

const savedToDos = localStorage.getItem(TODOS_KEY);

if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  toDos.forEach(paintToDo);

  // 라인 추가
  const lis = document.querySelectorAll("ul li");
  for (var i = 0; i < toDos.length; i++) {
    if (toDos[i].done === true) {
      lis[i].childNodes[0].classList.add(LINE_THROUGH);
    }
  }
}
