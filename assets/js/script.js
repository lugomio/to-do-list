// ELEMENTS
const todoList = document.querySelector(".list");
const addBtn = document.querySelectorAll(".add");
const taskDescription = document.querySelector("#task-description");

const items = JSON.parse(localStorage.getItem('todolist')) || [];

//FUNCTIONS
function addItem(e) {
    if (taskDescription.value.length === 0 || e.type === 'keyup' && e.keyCode != 13) return;

    let item = {
        'description': taskDescription.value,
        'done': false
    };

    items.push(item);
    taskDescription.value = "";

    updateList(items, todoList);
}

function updateList(items = [], todoList) {
    items.sort((a, b) => (a.done === b.done) ? 0 : a.done ? 1 : -1);
    todoList.innerHTML = items.map((item, i) => {
        let done = item.done ? "done" : "";
        let description = item.description;
        return `
            <li id="item-${i}" class="item ${done}" draggable="true" data-index="${i}">
                <div class="left">
                    <span class="icon drag">
                        <i class="material-symbols-rounded">drag_indicator</i>
                    </span>
                    <div class="checkbox" data-index="${i}"></div>
                    <h2 class="task">${description}</h2>
                </div>
                <div class="right">
                    <span class="icon delete" data-index="${i}">
                        <i class="material-symbols-rounded">close</i>
                    </span>
                </div
            </li>
        `;
    }).join('');

    localStorage.setItem('todolist', JSON.stringify(items));

    const checkBoxes = todoList.querySelectorAll('.checkbox');
    checkBoxes.forEach(checkbox => checkbox.addEventListener('click', toggleDone));

    const deletes = todoList.querySelectorAll('.delete');
    deletes.forEach(del => del.addEventListener('click', removeItem));

    const dragItems = todoList.querySelectorAll('.item');
    dragItems.forEach(item => {
        item.addEventListener('dragstart', startDrag);
        item.addEventListener('dragend', endDrag);
    });
}

function toggleDone(e) {
    let index = e.target.dataset.index;
    items[index].done = !items[index].done;

    updateList(items, todoList);
}

function removeItem(e) {
    let index = parseInt(e.target.dataset.index);
    items.splice(index, 1);

    updateList(items, todoList);
}

let draggingItem, dropItem;

function startDrag(e) {
    draggingItem = e.target.dataset.index;
    setTimeout(() => e.target.classList.add("dragging"), 50);
}

function endDrag(e) {
    let tmp = items[draggingItem];
    items[draggingItem] = items[dropItem];
    items[dropItem] = tmp;

    e.target.classList.remove("dragging");

    updateList(items, todoList);
}

function dragSwapItems(e) {
    const siblings = [...todoList.querySelectorAll('.item:not(.dragging)')];

    dropItem = siblings.find((sibling) => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight;
    }).dataset.index;
}

function debounce(func, timeout = 50) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

//EVENTS
addBtn.forEach(btn => btn.addEventListener('click', addItem));
taskDescription.addEventListener('keyup', addItem);
todoList.addEventListener('dragover', debounce(dragSwapItems));
updateList(items, todoList);