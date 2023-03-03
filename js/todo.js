const toDoForm = document.getElementById("todo-form");
const toDoInput = document.querySelector("#todo-form input");
const toDoList = document.getElementById("todo-list");

// const toDoRemove = document.getElementById("all-remove");

const TODOS_KEY = "todos";
const LINE_THROUGH = "line-through";

let toDos = [];

// toDoRemove.addEventListener("click",deleteAllToDo);

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

function paintLineThrough() {
  const lis = document.querySelectorAll("ul li");
  for (var i = 0; i < toDos.length; i++) {
    if (toDos[i].done === true) {
      lis[toDos.length - 1 - i].childNodes[0].classList.add(LINE_THROUGH);
    }
  }
}

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
  if (idx === toDos.length - 1) return;
  const target = toDos.splice(idx, 1)[0];
  toDos.splice(idx + 1, 0, target);
  deleteAllToDo();
  toDos.forEach(paintToDo);
  paintLineThrough();
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

function paintToDo(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.ID;
  li.draggable = true;
  const div = document.createElement("div");
  div.innerText = newTodo.text;
  div.title = "Drag and Drop!";
  div.addEventListener("click", addLineThrough);
  const button1 = document.createElement("button");
  button1.innerHTML = '<span class="fa-solid fa-x"></span>';
  button1.children[0].addEventListener("click", deleteToDo);
  const button2 = document.createElement("button");
  button2.innerHTML = '<span class="fa-solid fa-caret-up"></span>';
  button2.children[0].addEventListener("click", changeOrder);
  li.appendChild(div);
  li.appendChild(button1);
  li.appendChild(button2);
  toDoList.prepend(li);
  addEventsDragAndDrop(li);
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
  paintLineThrough();
}

// 드래그 시작할 때 1번 호출
async function dragStart(e) {
  console.log("drag start");
  console.log(e.target.id, e.target.innerText);
  this.style.opacity = "0.4";
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

// 마우스가 요소로 진입할 때 1번 호출
async function dragEnter(e) {
  console.log("drag enter");
  console.log(e.target.id, e.target.innerText);
  this.classList.add("over");
}

// 다른 요소로 넘어갈 때 1번 호출
function dragLeave(e) {
  e.stopPropagation();
  console.log("drag leave");
  console.log(e.target.id, e.target.innerText);
  this.classList.remove("over");
}

// 마우스 누른 채 유지할 때 계속 호출
function dragOver(e) {
  e.preventDefault();
  console.log("drag over");
  console.log(e.target.id, e.target.innerText);
  e.dataTransfer.dropEffect = "move";
  return false;
}

// 다른 요소로 옮기고 드랍했을 때 1번 호출
function dragDrop(e) {
  if (dragSrcEl != this) {
    console.log("drag drop");
    /* this와 e.target은 할일2 */
    //드래그 시작 요소 html = 현재 요소 html
    dragSrcEl.innerHTML = this.innerHTML;
    // 현재 요소 html = 드래그 시작 요소 html
    this.innerHTML = e.dataTransfer.getData("text/html");

    //parseInt(dragSrcEl.id) === toDo.ID, parseInt(this.id) === toDo.ID 찾아서 서로 자리 교환한후 saveToDos()
    const toDo1 = toDos.find((toDo) => toDo.ID === parseInt(dragSrcEl.id));
    const toDo2 = toDos.find((toDo) => toDo.ID === parseInt(this.id));

    let toDo1_Idx;
    let toDo2_Idx;

    for (let i = 0; i < toDos.length; i++) {
      if (toDos[i].ID === parseInt(dragSrcEl.id)) toDo1_Idx = i;
      if (toDos[i].ID === parseInt(this.id)) toDo2_Idx = i;
    }

    toDos.splice(toDo1_Idx, 1, toDo2);
    toDos.splice(toDo2_Idx, 1, toDo1);
    console.log(toDos);

    deleteAllToDo();
    toDos.forEach(paintToDo);
    paintLineThrough();
    saveToDos();
  }
  return false;
}

// 마우스업 하면 1번 호출
function dragEnd(e) {
  console.log("drag end");
  console.log(e.target.id, e.target.innerText);
  let lis = document.querySelectorAll("ul li");
  [].forEach.call(lis, function (item) {
    item.classList.remove("over");
  });
  this.style.opacity = "1";
}

function addEventsDragAndDrop(el) {
  el.addEventListener("dragstart", dragStart, false);
  el.addEventListener("dragenter", dragEnter, false);
  el.addEventListener("dragover", dragOver, false);
  el.addEventListener("dragleave", dragLeave, false);
  el.addEventListener("drop", dragDrop, false);
  el.addEventListener("dragend", dragEnd, false);
}

/* let lis = document.querySelectorAll("ul li");
[].forEach.call(lis, function (item) {
  addEventsDragAndDrop(item);
}); */
