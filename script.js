class TodoList {
  constructor() {
    this.todoTasks = [];
    this.inProgressTasks = [];
    this.finishedTasks = [];
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
    console.log(`Task "${task.title}" added.`);
  }

  deleteTask(list, index) {
    list.splice(index, 1);
    this.displayTasks();
  }

  moveToInProgress(index) {
    const task = this.todoTasks.splice(index, 1)[0];
    this.inProgressTasks.push(task);
    this.displayTasks();
  }

  moveToFinished(index) {
    const task = this.inProgressTasks.splice(index, 1)[0];
    task.completed = true;
    task.finishedAt = this.getCurrentTime();
    this.finishedTasks.push(task);
    this.displayTasks();
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

    const makeEditable = (taskItem, task, list, index) => {
      const span = taskItem.querySelector("span");
      const originalText = span.innerText;
      const input = document.createElement("input");
      input.type = "text";
      input.value = originalText;
      input.className = "edit-input";

      span.replaceWith(input);
      input.focus();

      const saveChanges = () => {
        task.description = input.value;
        this.displayTasks();
      };

      input.addEventListener("blur", saveChanges);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          saveChanges();
        }
      });
    };

    this.todoTasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className = getImportanceClass(task.importance);
      taskItem.innerHTML = `<span>${task.title} - ${task.description} <div>Créée le : ${task.createdAt}</div></span>`;

      const inProgressButton = document.createElement("button");
      inProgressButton.innerText = "📌​";
      inProgressButton.onclick = () => this.moveToInProgress(index);

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "❌";
      deleteButton.onclick = () => this.deleteTask(this.todoTasks, index);

      const editButton = document.createElement("button");
      editButton.innerText = "✏️​";
      editButton.className = "edit-button";
      editButton.onclick = () =>
        makeEditable(taskItem, task, this.todoTasks, index);

      taskItem.appendChild(editButton);
      taskItem.appendChild(inProgressButton);
      taskItem.appendChild(deleteButton);

      todoList.appendChild(taskItem);
    });

    this.inProgressTasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className = getImportanceClass(task.importance);
      taskItem.innerHTML = `<span>${task.title} - ${task.description}<div>Créée le : ${task.createdAt}</div></span>`;

      const finishButton = document.createElement("button");
      finishButton.innerText = "✅";
      finishButton.onclick = () => this.moveToFinished(index);

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "❌";
      deleteButton.onclick = () => this.deleteTask(this.inProgressTasks, index);

      const editButton = document.createElement("button");
      editButton.innerText = "✏️";
      editButton.className = "edit-button";
      editButton.onclick = () =>
        makeEditable(taskItem, task, this.inProgressTasks, index);

      taskItem.appendChild(editButton);
      taskItem.appendChild(finishButton);
      taskItem.appendChild(deleteButton);

      inProgressList.appendChild(taskItem);
    });

    this.finishedTasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className = `completed ${getImportanceClass(task.importance)}`;
      taskItem.innerHTML = `<span>${task.title} - ${task.description} <div>Créée le : ${task.createdAt}</div>Terminée le : ${task.finishedAt}</span>`;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "❌";
      deleteButton.onclick = () => this.deleteTask(this.finishedTasks, index);

      taskItem.appendChild(deleteButton);

      finishedList.appendChild(taskItem);
    });
  }
}

const myTodoList = new TodoList();

document
  .getElementById("todoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const taskTitle = document.getElementById("taskTitle").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskImportance = document.getElementById("taskImportance").value;

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
