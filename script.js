const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;
    const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
    progressBar.style.width = percent + "%";
}

function render() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add(task.priority);
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
      <div>
        <strong>${task.title}</strong><br>
        <small>Due: ${task.dueDate}</small>
      </div>
      <div>
        <button class="complete-btn" onclick="toggle(${index})">
          ${task.completed ? "Undo" : "Done"}
        </button>
        <button class="delete-btn" onclick="removeTask(${index},this)">
          Delete
        </button>
      </div>
    `;

        taskList.appendChild(li);
    });

    updateProgress();
    save();
}

function toggle(index) {
    tasks[index].completed = !tasks[index].completed;
    render();
}

function removeTask(index, btn) {
    const li = btn.closest("li");
    li.classList.add("fade-out");

    setTimeout(() => {
        tasks.splice(index, 1);
        render();
    }, 300);
}
const themeSelector = document.getElementById("themeSelector");

const savedTheme = localStorage.getItem("theme") || "light";
document.body.className = savedTheme;
themeSelector.value = savedTheme;

themeSelector.addEventListener("change", function () {
    document.body.className = this.value;
    localStorage.setItem("theme", this.value);
});



form.addEventListener("submit", e => {
    e.preventDefault();

    tasks.push({
        title: title.value,
        dueDate: dueDate.value,
        priority: priority.value,
        completed: false
    });

    form.reset();
    render();
});

render();
