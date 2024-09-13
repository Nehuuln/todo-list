class TodoList {
  constructor() {
    this.todoTasks = [];
    this.inProgressTasks = [];
    this.finishedTasks = [];
    this.draggedTask = null;
    this.draggedFrom = null;
  }

  enableDragAndDrop() {
    const columns = document.querySelectorAll(".column");
    const trashBin = document.getElementById("trash");

    columns.forEach((column) => {
      column.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      column.addEventListener("drop", (event) => {
        event.preventDefault();
        const columnId = event.target.id;
        this.moveTaskToColumn(columnId);
      });
    });

    trashBin.addEventListener("dragover", (event) => {
      event.preventDefault();
      trashBin.classList.add("dragover");
    });

    trashBin.addEventListener("dragleave", () => {
      trashBin.classList.remove("dragover");
    });

    trashBin.addEventListener("drop", (event) => {
      event.preventDefault();
      trashBin.classList.remove("dragover");
      this.deleteDraggedTask();
    });
  }

  getCurrentTime() {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }

  addTask(task) {
    this.todoTasks.push({
      title: task.title,
      description: task.description,
      importance: task.importance,
      createdAt: this.getCurrentTime(),
      completed: false,
      finishedAt: null,
    });
    this.displayTasks();
  }

  deleteTask(list, index) {
    list.splice(index, 1);
    this.displayTasks();
  }

  deleteDraggedTask() {
    if (this.draggedTask && this.draggedFrom) {
      const index = this.draggedFrom.indexOf(this.draggedTask);
      if (index > -1) {
        this.draggedFrom.splice(index, 1);
        this.displayTasks();
      }
      this.draggedTask = null;
      this.draggedFrom = null;
    }
  }

  moveTaskToColumn(columnId) {
    const task = this.draggedTask;

    this.draggedFrom.splice(this.draggedFrom.indexOf(task), 1);

    if (columnId === "todoList") {
      this.todoTasks.push(task);
    } else if (columnId === "inProgressList") {
      this.inProgressTasks.push(task);
    } else if (columnId === "finishedList") {
      task.completed = true;
      task.finishedAt = this.getCurrentTime();
      this.finishedTasks.push(task);
    }

    this.displayTasks();
  }

  makeDraggableEditable(taskItem, task, list) {
    taskItem.draggable = true;
    taskItem.addEventListener("dragstart", () => {
      this.draggedTask = task;
      this.draggedFrom = list;
    });

    const title = taskItem.querySelector(".task-title");
    const description = taskItem.querySelector(".task-description");
    title.contentEditable = true;
    description.contentEditable = true;

    title.addEventListener("blur", () => {
      task.title = title.innerText;
    });
    description.addEventListener("blur", () => {
      task.description = description.innerText;
    });
  }

  isDuplicateTaskTitle(title) {
    return (
      this.todoTasks.some((task) => task.title === title) ||
      this.inProgressTasks.some((task) => task.title === title) ||
      this.finishedTasks.some((task) => task.title === title)
    );
  }

  displayTasks() {
    const todoList = document.getElementById("todoList");
    const inProgressList = document.getElementById("inProgressList");
    const finishedList = document.getElementById("finishedList");

    todoList.querySelectorAll("li").forEach((taskItem) => taskItem.remove());
    inProgressList
      .querySelectorAll("li")
      .forEach((taskItem) => taskItem.remove());
    finishedList
      .querySelectorAll("li")
      .forEach((taskItem) => taskItem.remove());

    const getImportanceClass = (importance) => {
      switch (importance) {
        case "High":
          return "high-importance";
        case "Medium":
          return "medium-importance";
        case "Low":
          return "low-importance";
        default:
          return "";
      }
    };

    this.todoTasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className = getImportanceClass(task.importance);
      taskItem.innerHTML = `
          <span class="task-title">${task.title}</span> - 
          <span class="task-description">${task.description}</span>
          <div>Créée le : ${task.createdAt}</div>
        `;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "❌";
      deleteButton.onclick = () => this.deleteTask(this.todoTasks, index);

      taskItem.appendChild(deleteButton);

      this.makeDraggableEditable(taskItem, task, this.todoTasks);

      todoList.appendChild(taskItem);
    });

    this.inProgressTasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className = getImportanceClass(task.importance);
      taskItem.innerHTML = `
          <span class="task-title">${task.title}</span> - 
          <span class="task-description">${task.description}</span>
          <div>Créée le : ${task.createdAt}</div>
        `;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "❌";
      deleteButton.onclick = () => this.deleteTask(this.inProgressTasks, index);

      taskItem.appendChild(deleteButton);

      this.makeDraggableEditable(taskItem, task, this.inProgressTasks);

      inProgressList.appendChild(taskItem);
    });

    this.finishedTasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className = `completed ${getImportanceClass(task.importance)}`;
      taskItem.innerHTML = `
          <span class="task-title">${task.title}</span> - 
          <span class="task-description">${task.description}</span>
          <div>Créée le : ${task.createdAt}</div>
          <div>Terminée le : ${task.finishedAt}</div>
        `;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "❌";
      deleteButton.onclick = () => this.deleteTask(this.finishedTasks, index);

      taskItem.appendChild(deleteButton);
      this.makeDraggableEditable(taskItem, task, this.finishedTasks);

      finishedList.appendChild(taskItem);
    });
  }
}

const myTodoList = new TodoList();
myTodoList.enableDragAndDrop();

document
  .getElementById("todoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const taskTitle = document.getElementById("taskTitle").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskImportance = document.getElementById("taskImportance").value;
    const errorMessage = document.getElementById("errorMessage");

    if (myTodoList.isDuplicateTaskTitle(taskTitle)) {
      errorMessage.textContent =
        "Erreur : Une tâche avec ce titre existe déjà.";
      errorMessage.style.display = "block"; // Affiche le message d'erreur
    } else {
      errorMessage.style.display = "none";

      if (taskTitle && taskDescription) {
        myTodoList.addTask({
          title: taskTitle,
          description: taskDescription,
          importance: taskImportance,
        });

        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskImportance").value = "Low";
      }
    }
  });

const form = document.getElementById("todoForm");
const openFormButton = document.getElementById("openFormButton");
const overlay = document.createElement("div");
const closeFormButton = document.getElementById("closeFormButton");

overlay.id = "overlay";
document.body.appendChild(overlay);

openFormButton.addEventListener("click", () => {
  form.style.display = "block";
  overlay.style.display = "block";
});

closeFormButton.addEventListener("click", () => {
  form.style.display = "none";
  overlay.style.display = "none";
});

overlay.addEventListener("click", () => {
  form.style.display = "none";
  overlay.style.display = "none";
});
