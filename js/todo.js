const toDoForm = document.getElementById("todo-form");
const toDoInput = document.querySelector("#todo-form input");
const toDoList = document.getElementById("todo-list");

const TODOS_KEY = "todos";
const LINE_THROUGH = "line-through";

let toDos = [];

function saveToDos() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function deleteToDo(e) {
    const li = e.target.parentElement;
    li.remove();
    toDos = toDos.filter(item => item.ID !== parseInt(li.id));
    saveToDos();
}

function addLineThrough(e) {
    e.target.classList.toggle(LINE_THROUGH);

    // 로컬스토리지 연동
    const li = e.target.parentElement;
    if (e.target.classList.contains(LINE_THROUGH)) {
        toDos = toDos.map(item => item.ID === parseInt(li.id) ? {...item, done: true} : item);
    } else {
        toDos = toDos.map(item => item.ID === parseInt(li.id) ? {...item, done: false} : item);
    }
    saveToDos();
}

function paintToDo(newTodo) {
    const li = document.createElement("li");
    li.id = newTodo.ID;
    const span = document.createElement("span");
    span.innerText = newTodo.text;
    span.addEventListener("click", addLineThrough);
    const button = document.createElement("button");
    button.innerText = "X"
    button.addEventListener("click", deleteToDo)
    li.appendChild(span);
    li.appendChild(button);
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
    }
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

    const lis = document.querySelectorAll("ul li");
    for (var i=0; i<toDos.length; i++) {
        if (toDos[i].done === true) {
            lis[i].childNodes[0].classList.add(LINE_THROUGH);
        }
    }
}