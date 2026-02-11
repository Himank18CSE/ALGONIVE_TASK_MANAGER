const form = document.getElementById("taskForm");
const columns = document.querySelectorAll(".task-list");
const stats = document.getElementById("stats");
const ring = document.getElementById("progressRing");
const progressText = document.getElementById("progressText");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const circumference = 314;

function save(){ localStorage.setItem("tasks", JSON.stringify(tasks)); }

function updateStats(){
  const done = tasks.filter(t=>t.status==="done").length;
  stats.textContent = `${tasks.length} Tasks | ${done} Completed`;
  const percent = tasks.length ? Math.round(done/tasks.length*100):0;
  ring.style.strokeDashoffset = circumference - percent/100*circumference;
  progressText.textContent = percent+"%";
}

function notify(task){
  if(Notification.permission==="granted"){
    new Notification("Deadline Near 🔔",{body:task.title});
  }
}

function render(){
  columns.forEach(col=>col.innerHTML="");

  tasks.forEach((task,index)=>{
    const div=document.createElement("div");
    div.className=`task ${task.priority}`;
    div.draggable=true;

    const due=new Date(task.dueDate);
    const today=new Date();
    if((due-today)/(1000*60*60*24)<=1 && task.status!=="done"){
      notify(task);
    }

    div.innerHTML=`
      <strong contenteditable="true" onblur="editTask(${index},this.innerText)">
        ${task.title}
      </strong>
      <small>Due: ${task.dueDate}</small>
      <button onclick="removeTask(${index},this)">✖</button>
    `;

    div.addEventListener("dragstart",()=>div.classList.add("dragging"));
    div.addEventListener("dragend",()=>div.classList.remove("dragging"));

    document.getElementById(task.status).appendChild(div);
  });

  updateStats();
  save();
}

function editTask(index,text){
  tasks[index].title=text;
  save();
}

function removeTask(index,btn){
  const card=btn.closest(".task");
  card.classList.add("fade-out");
  setTimeout(()=>{tasks.splice(index,1);render();},400);
}

form.addEventListener("submit",e=>{
  e.preventDefault();
  tasks.push({
    title:title.value,
    dueDate:dueDate.value,
    priority:priority.value,
    status:"todo"
  });
  form.reset();
  render();
});

columns.forEach(column=>{
  column.addEventListener("dragover",e=>{
    e.preventDefault();
    const dragging=document.querySelector(".dragging");
    column.appendChild(dragging);
  });

  column.addEventListener("drop",()=>{
    const dragging=document.querySelector(".dragging");
    const newStatus=column.parentElement.dataset.status;
    const taskText=dragging.querySelector("strong").innerText;
    const taskObj=tasks.find(t=>t.title===taskText);
    taskObj.status=newStatus;
    render();
  });
});

function toggleTheme(){
  document.body.classList.toggle("dark");
}

if("Notification" in window){
  Notification.requestPermission();
}

render();
