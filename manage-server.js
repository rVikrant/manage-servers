"use strict";

let servers = [],
  tasks = [],
  removeServer = false,
  runningTask = 0,
  MAX_RUNNING_TASK = 10,
  TASK_TIME = 20,
  TASK_STATUS = {
    WAITING: "WAITING",
    RUNNING: "RUNNING",
  };

// add new server -> after server check for pending -> exist -> assign task to server
function addAServer() {
  if (servers.length < 10) {
    servers.push({ newServer: servers.length + 1 });
    checkForPendingTask(true);
    alert("New Server Added SuccessFully. Server Count:" + servers.length);
  } else {
    alert("Max Servers Limit Reached i.e. 10");
  }
}

// remove server function -> check server running -> if true -> remove after completion -> else remove immediately
function removeAServer() {
  if (servers.length > 0) {
    if (runningTask < servers.length) {
      servers.pop();
      alert("Server Removed SuccessFully. Servers left:" + servers.length);
    } else {
      removeServer = true;
      alert("Server Will Be Removed As Soon As Be Idle");
    }
  } else {
    alert("No More Servers To Remove. Servers left: 0");
  }
}

// add tasks -> create new task -> if server exist -> assign -> else status waiting
function addTasks() {
  let newTasks = document.getElementById("newTaksInput").value,
    taskListContainer = document.getElementById("taskList"),
    possibleRunningTasks = servers.length;

  for (let i = 0; i < newTasks; i++) {
    tasks.push({
      task: tasks.length + 1,
      time: TASK_TIME,
      status: TASK_STATUS.WAITING,
    });

    let len = tasks.length,
      newTaskDiv = document.createElement("div");

    newTaskDiv.id = "task" + len;
    newTaskDiv.classList.add("tasks");
    newTaskDiv.innerHTML = "00:00";

    let taskContainer = document.createElement("div");

    taskContainer.append(newTaskDiv);

    if (runningTask < possibleRunningTasks) {
      runningTask++;
      tasks[len - 1].status = TASK_STATUS.RUNNING;

      timeSetForRunningTask(newTaskDiv, len);
    } else {
      newTaskDiv.style.color = "#AD94CB";
      newTaskDiv.innerHTML = "waiting...";

      let trashBtn = document.createElement("button");
      trashBtn.id = "trash" + len;
      trashBtn.style["margin-left"] = "5px";
      trashBtn.innerHTML = '<i class="fa fa-trash"></i>';

      taskContainer.append(trashBtn);
    }

    taskListContainer.append(taskContainer);
  }

  console.log(" new tasks--", tasks);
}

// time set for running task -> task will be completed in 20 sec -> so set an interval of 20 sec
function timeSetForRunningTask(newTaskDiv, len) {
  let count = 0,
    obj = {};

  obj["task" + len] = setInterval(() => {
    count++;
    console.log("count----", count, obj["task" + len]);
    newTaskDiv.style.padding = 0;
    newTaskDiv.innerHTML = `<span style= 'width: ${5 * count}%;'>00:${
      count < 10 ? "0" + count : count
    }</span>`;

    if (count === TASK_TIME) {
      clearInterval(obj["task" + len]);
      runningTask--;
      newTaskDiv.parentNode.parentNode.removeChild(newTaskDiv.parentNode);

      if (removeAServer) {
        servers.pop();
        removeAServer = false;
      } else {
        checkForPendingTask(true);
      }
    }
  }, 1000);
}

// checkForPendingTask--- > check for task with status WAITING -> if exist assign server if exist
function checkForPendingTask(popServer) {
  console.log("tasks--", tasks.length);

  let taskPending = true; // check for pending task

  if (tasks.length) {
    let task = tasks.findIndex((obj) => obj.status === TASK_STATUS.WAITING),
      id = "task" + (task + 1);

    console.log(task, id, "---");

    if (task >= 0) {
      taskPending = false;

      let element = document.getElementById(id),
        trashId = "trash" + (task + 1),
        trashBtn = document.getElementById(trashId);

      element.parentNode.removeChild(trashBtn);

      tasks[task].status = TASK_STATUS.RUNNING;
      runningTask++;

      console.log(tasks[task], "task up-----");

      timeSetForRunningTask(element, task + 1);
    }
  }

  if (!tasks.length && popServer && taskPending) {
    servers.pop();
  }
}
