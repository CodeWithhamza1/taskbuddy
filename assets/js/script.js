// select all DOM elements
// select all DOM elements
const headerTime = document.querySelector("[data-header-time]");
const menuTogglers = document.querySelectorAll("[data-menu-toggler]");
const menu = document.querySelector("[data-menu]");
const themeBtns = document.querySelectorAll("[data-theme-btn]");
const modalTogglers = document.querySelectorAll("[data-modal-toggler]");
const welcomeNote = document.querySelector("[data-welcome-note]");
const taskList = document.querySelector("[data-task-list]");
const taskInput = document.querySelector("[data-task-input]");
const modal = document.querySelector("[data-info-modal]");
let taskItem = []; // Changed to an empty array
let taskRemover = []; // Changed to an empty array

// Rest of the code...


// store current date from build-in date object
const date = new Date();

// import task complete sound
const taskCompleteSound = new Audio("./assets/sounds/task-complete.mp3");

/**
 * convert weekday number to weekday name
 * totalParameter: 1;
 * parameterValue: <number> 0-6;
 */
const getWeekDayName = function (dayNumber) {
  switch (dayNumber) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Not a valid day";
  }
};

/**
 * convert month number to month name
 * totalParameter: 1;
 * parameterValue: <number> 0-11;
 */
const getMonthName = function (monthNumber) {
  switch (monthNumber) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
    default:
      return "Not a valid month";
  }
};

// store weekday name, month name & month-of-day number
const weekDayName = getWeekDayName(date.getDay());
const monthName = getMonthName(date.getMonth());
const monthOfDay = date.getDate();

// update headerTime date
headerTime.textContent = `${weekDayName}, ${monthName} ${monthOfDay}`;

/**
 * toggle active class on element
 * totalParameter: 1;
 * parameterValue: <object> elementNode;
 */
const elemToggler = function (elem) {
  elem.classList.toggle("active");
};

/**
 * toggle active class on multiple elements
 * totalParameter: 2;
 * parameterValue: <object> elementNode, <function> any;
 */
const addEventOnMultiElem = function (elems, event) {
  for (let i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", event);
  }
};

/**
 * create taskItem elementNode and return it
 * totalParameter: 1;
 * parameterValue: <string> any;
 */
const taskItemNode = function (taskText) {
  const createTaskItem = document.createElement("li");
  createTaskItem.classList.add("task-item");
  createTaskItem.setAttribute("data-task-item", "");

  createTaskItem.innerHTML = `
    <button class="item-icon" data-task-remove="complete">
    <span class="check-icon"></span>
    </button>
    <p class="item-text">${taskText}</p>
    <button class="item-action-btn" aria-label="Remove task" data-task-remove>
    <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
    </button>
    `;

  return createTaskItem;
};

/**
 
/**
 * task input validation
 * totalParameter: 1;
 * parameterValue: <string> any
 */
 const taskInputValidation = function (taskIsValid) {
  if (taskIsValid) {
    const taskText = taskInput.value.trim();
    const words = taskText.split(' ');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const capitalizedTask = capitalizedWords.join(' ');

    if (taskList.childElementCount > 0) {
      taskList.insertBefore(taskItemNode(capitalizedTask), taskItem[0]);
    } else {
      taskList.appendChild(taskItemNode(capitalizedTask));
    }

    // after adding task on taskList, input field should be empty
    taskInput.value = "";

    // hide the welcome note
    welcomeNote.classList.add("hide");

    // update taskItem DOM selection
    taskItem = document.querySelectorAll("[data-task-item]");
    taskRemover = document.querySelectorAll("[data-task-remove]");

    // Store tasks in local storage
    const tasks = Array.from(taskItem).map((item) => item.querySelector(".item-text").textContent);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Add fire/sparkles animation
    const animationElement = document.createElement("div");
    animationElement.classList.add("animation-element");
    taskList.insertBefore(animationElement, taskList.firstChild);

    // Remove animation element after animation ends
    animationElement.addEventListener("animationend", () => {
      animationElement.remove();
    });
    
  } else {
    console.log("Please write something!");
  }
};

/**
 
if there is an existing task,
the welcome note will be hidden
*/
const removeWelcomeNote = function () {
  if (taskList.childElementCount > 0) {
    welcomeNote.classList.add("hide");
  } else {
    welcomeNote.classList.remove("hide");
  }
};
/**
 
removeTask when click on delete button or check button
*/
const removeTask = function () {
  const parentElement = this.closest("[data-task-item]");
  const taskText = parentElement.querySelector(".item-text").textContent;

  parentElement.classList.add("complete");
  taskCompleteSound.play();
  setTimeout(function () {
    parentElement.remove();
    removeWelcomeNote();

    // Remove task from taskItem array
    taskItem = Array.from(taskItem).filter(item => item.querySelector(".item-text").textContent !== taskText);

    // Remove task from local storage
    const tasks = Array.from(taskItem).map(item => item.querySelector(".item-text").textContent);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, 250);
};







/**
 
addTask function
*/
const addTask = function () {
  taskInputValidation(taskInput.value);
  addEventOnMultiElem(taskRemover, removeTask);
};
/**
 
add keypress listener on taskInput
*/
taskInput.addEventListener("keypress", function (e) {
  switch (e.key) {
    case "Enter":
      addTask();
      break;
  }
});
// toggle active class on menu when click on menuBtn or dropdownLink
const toggleMenu = function () {
  elemToggler(menu);
};
addEventOnMultiElem(menuTogglers, toggleMenu);

// toggle active class on modal when click on dropdownLink or modal Ok button
const toggleModal = function () {
  elemToggler(modal);
};
addEventOnMultiElem(modalTogglers, toggleModal);

/**
 
add "loaded" class on body when website is fully loaded
*/
window.addEventListener("load", function () {
  document.body.classList.add("loaded");
});
/**
 
change body background when click on any themeBtn
*/
const themeChanger = function () {
  const hueValue = this.dataset.hue;
  document.documentElement.style.setProperty
    ("--hue", hueValue);

  for (let i = 0; i < themeBtns.length; i++) {
    if (themeBtns[i].classList.contains("active")) {
      themeBtns[i].classList.remove("active");
    }
  }

  this.classList.add("active");
};

addEventOnMultiElem(themeBtns, themeChanger);

// Retrieve tasks from local storage on page load
window.addEventListener("load", function () {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);
    tasks.forEach((task) => {
      taskList.appendChild(taskItemNode(task));
    });
    taskItem = document.querySelectorAll("[data-task-item]");
    taskRemover = document.querySelectorAll("[data-task-remove]");
    removeWelcomeNote();
    addEventOnMultiElem(taskRemover, removeTask);
  }
});

/**
 * jump to task input when "/" key is pressed
 */
 window.addEventListener("keypress", function (e) {
  if (e.key === "/") {
    e.preventDefault();
    taskInput.focus();
  }
});

window.addEventListener("keypress", function (e) {
  if (e.key === "`") {
    e.preventDefault();
    taskInput.focus();
  }
});

/**
 * unfocus task input when "Esc" key is pressed
 */
 window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    taskInput.blur();
  }
});
