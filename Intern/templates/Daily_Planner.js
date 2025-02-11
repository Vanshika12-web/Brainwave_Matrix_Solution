 // Add Calendar functionality
 let currentDate = new Date();
 const monthNames = ["January", "February", "March", "April", "May", "June",
     "July", "August", "September", "October", "November", "December"];
 const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

 function generateCalendar(date) {
     const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
     const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
     const today = new Date();

     document.getElementById('calendar-month').textContent =
         `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

     const calendarGrid = document.getElementById('calendar-grid');
     calendarGrid.innerHTML = '';

     // Add day headers
     dayNames.forEach(day => {
         const dayHeader = document.createElement('div');
         dayHeader.className = 'calendar-day-header';
         dayHeader.textContent = day;
         calendarGrid.appendChild(dayHeader);
     });

     // Add padding days from previous month
     const firstDayOfWeek = firstDay.getDay();
     const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0);
     for (let i = firstDayOfWeek - 1; i >= 0; i--) {
         const dayDiv = document.createElement('div');
         dayDiv.className = 'calendar-day other-month';
         dayDiv.textContent = prevLastDay.getDate() - i;
         calendarGrid.appendChild(dayDiv);
     }

     // Add days of current month
     for (let i = 1; i <= lastDay.getDate(); i++) {
         const dayDiv = document.createElement('div');
         dayDiv.className = 'calendar-day';
         if (i === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear()) {
             dayDiv.className += ' current';
         }
         dayDiv.textContent = i;
         calendarGrid.appendChild(dayDiv);
     }

     // Add padding days from next month
     const remainingDays = 42 - (firstDayOfWeek + lastDay.getDate());
     for (let i = 1; i <= remainingDays; i++) {
         const dayDiv = document.createElement('div');
         dayDiv.className = 'calendar-day other-month';
         dayDiv.textContent = i;
         calendarGrid.appendChild(dayDiv);
     }
 }

 function previousMonth() {
     currentDate.setMonth(currentDate.getMonth() - 1);
     generateCalendar(currentDate);
 }

 function nextMonth() {
     currentDate.setMonth(currentDate.getMonth() + 1);
     generateCalendar(currentDate);
 }

 // Initialize calendar
 generateCalendar(currentDate);

 // Add this new function for greeting
 function updateGreeting() {
     const greeting = document.getElementById('user-greeting');
     const hour = new Date().getHours();
     let greetText = '';

     if (hour >= 5 && hour < 12) {
         greetText = 'Good morning!';
     } else if (hour >= 12 && hour < 17) {
         greetText = 'Good afternoon!';
     } else if (hour >= 17 && hour < 22) {
         greetText = 'Good evening!';
     } else {
         greetText = 'Good night!';
     }

     greeting.textContent = greetText;
 }

 // Update current time
 function updateTime() {
     const timeElement = document.getElementById('current-time');
     timeElement.textContent = new Date().toLocaleString();
 }

 // Call both functions initially and set intervals
 updateGreeting();
 updateTime();
 setInterval(updateGreeting, 60000); // Update greeting every minute
 setInterval(updateTime, 1000); // Update time every second

 // Keep the rest of your existing JavaScript code...
 // (All the existing JavaScript code for tasks, schedule, etc. remains the same)
 // Thoughts of the day array
 const thoughts = [
     "The only way to do great work is to love what you do.",
     "Success is not final, failure is not fatal: it is the courage to continue that counts.",
     "Every moment is a fresh beginning.",
     "Believe you can and you're halfway there.",
     "Make each day your masterpiece.",
     "The future depends on what you do today.",
     "Don't wait. The time will never be just right.",
     "Start where you are. Use what you have. Do what you can.",
     "Everything you've ever wanted is on the other side of fear.",
     "Your time is limited, don't waste it living someone else's life."
 ];

 // Task class to manage individual tasks
 class Task {
     constructor(id, content) {
         this.id = id;
         this.content = content;
         this.isCompleted = false;
         this.timer = 0;
         this.timerInterval = null;
         this.isRunning = false;
     }

     formatTime() {
         const hours = Math.floor(this.timer / 3600);
         const minutes = Math.floor((this.timer % 3600) / 60);
         const seconds = this.timer % 60;
         return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
     }
 }

 // TaskManager class to manage all tasks
 class TaskManager {
     constructor() {
         this.tasks = [];
         this.loadTasks();
     }

     addTask(content) {
         const task = new Task(Date.now(), content);
         this.tasks.push(task);
         this.saveTasks();
         this.renderTasks();
     }

     deleteTask(id) {
         this.tasks = this.tasks.filter(task => task.id !== id);
         this.saveTasks();
         this.renderTasks();
     }

     toggleComplete(id) {
         const task = this.tasks.find(task => task.id === id);
         if (task) {
             task.isCompleted = !task.isCompleted;
             this.saveTasks();
             this.renderTasks();
         }
     }

     editTask(id, newContent) {
         const task = this.tasks.find(task => task.id === id);
         if (task) {
             task.content = newContent;
             this.saveTasks();
             this.renderTasks();
         }
     }

     toggleTimer(id) {
         const task = this.tasks.find(task => task.id === id);
         if (task) {
             if (task.isRunning) {
                 clearInterval(task.timerInterval);
                 task.isRunning = false;
             } else {
                 task.timerInterval = setInterval(() => {
                     task.timer++;
                     this.updateTimerDisplay(id);
                     this.saveTasks();
                 }, 1000);
                 task.isRunning = true;
             }
             this.renderTasks();
         }
     }

     updateTimerDisplay(id) {
         const timerElement = document.getElementById(`timer-${id}`);
         const task = this.tasks.find(task => task.id === id);
         if (timerElement && task) {
             timerElement.textContent = task.formatTime();
         }
     }

     saveTasks() {
         localStorage.setItem('tasks', JSON.stringify(this.tasks));
     }

     loadTasks() {
         const savedTasks = localStorage.getItem('tasks');
         if (savedTasks) {
             const parsedTasks = JSON.parse(savedTasks);
             this.tasks = parsedTasks.map(task => {
                 const newTask = new Task(task.id, task.content);
                 newTask.isCompleted = task.isCompleted;
                 newTask.timer = task.timer;
                 newTask.isRunning = false;
                 return newTask;
             });
         }
     }

     renderTasks() {
         const taskList = document.getElementById('task-list');
         taskList.innerHTML = '';

         this.tasks.forEach(task => {
             const li = document.createElement('li');
             li.className = `task-item ${task.isCompleted ? 'completed' : ''}`;

             li.innerHTML = `
                 <div class="task-content">${task.content}</div>
                 <div class="task-timer" id="timer-${task.id}">${task.formatTime()}</div>
                 <div class="task-actions">
                     <button onclick="taskManager.toggleTimer(${task.id})" class="${task.isRunning ? 'btn-pause' : 'btn-start'}">
                         ${task.isRunning ? 'Pause' : 'Start'}
                     </button>
                     <button onclick="taskManager.toggleComplete(${task.id})" class="btn-complete">
                         ${task.isCompleted ? 'Undo' : 'Complete'}
                     </button>
                     <button onclick="editTaskPrompt(${task.id})" class="btn-edit">Edit</button>
                     <button onclick="taskManager.deleteTask(${task.id})" class="btn-delete">Delete</button>
                 </div>
             `;
             taskList.appendChild(li);
         });
     }
 }

 // Initialize TaskManager
 const taskManager = new TaskManager();
 taskManager.renderTasks();

 // Update current time
 function updateTime() {
     const timeElement = document.getElementById('current-time');
     timeElement.textContent = new Date().toLocaleString();
 }
 setInterval(updateTime, 1000);
 updateTime();

 // Set random thought of the day
 function setThoughtOfTheDay() {
     const thoughtElement = document.getElementById('thought-of-day');
     const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
     thoughtElement.textContent = randomThought;
 }
 setThoughtOfTheDay();

 // Add new task
 function addTask() {
     const input = document.getElementById('task-input');
     const content = input.value.trim();
     if (content) {
         taskManager.addTask(content);
         input.value = '';
     }
 }

 // Edit task prompt
 function editTaskPrompt(id) {
     const task = taskManager.tasks.find(task => task.id === id);
     if (task) {
         const newContent = prompt('Edit task:', task.content);
         if (newContent !== null && newContent.trim()) {
             taskManager.editTask(id, newContent.trim());
         }
     }
 }

 // Add keyboard shortcut for adding tasks
 document.getElementById('task-input').addEventListener('keypress', function (e) {
     if (e.key === 'Enter') {
         addTask();
     }
 });

 // Schedule management
 function createSchedule() {
     const scheduleContainer = document.getElementById('schedule');
     for (let hour = 0; hour < 24; hour++) {
         const scheduleItem = document.createElement('div');
         scheduleItem.className = 'schedule-item';
         scheduleItem.innerHTML = `
             <span class="schedule-time">${hour.toString().padStart(2, '0')}:00</span>
             <input type="text" id="schedule-${hour}" placeholder="Task">
         `;
         scheduleContainer.appendChild(scheduleItem);
     }
 }
 createSchedule();

 // Save and load functions for additional sections
 function saveAdditionalData() {
     const goals = document.getElementById('goals').value;
     const notes = document.getElementById('notes').value;
     const forTomorrow = document.getElementById('for-tomorrow').value;
     const schedule = {};
     for (let hour = 0; hour < 24; hour++) {
         schedule[hour] = document.getElementById(schedule - `${hour}`).value;
     }

     localStorage.setItem('additionalData', JSON.stringify({
         goals,
         notes,
         forTomorrow,
         schedule
     }));
 }

 function loadAdditionalData() {
     const savedData = localStorage.getItem('additionalData');
     if (savedData) {
         const { goals, notes, forTomorrow, schedule } = JSON.parse(savedData);
         document.getElementById('goals').value = goals || '';
         document.getElementById('notes').value = notes || '';
         document.getElementById('for-tomorrow').value = forTomorrow || '';
         for (let hour = 0; hour < 24; hour++) {
             document.getElementById(schedule - `${hour}`).value = schedule[hour] || '';
         }
     }
 }

 // Save data when inputs change
 ['goals', 'notes', 'for-tomorrow'].forEach(id => {
     document.getElementById(id).addEventListener('input', saveAdditionalData);
 });
 for (let hour = 0; hour < 24; hour++) {
     const scheduleInput = document.getElementById(`schedule-${hour}`);
     if (scheduleInput) {
         scheduleInput.addEventListener('input', saveAdditionalData);
     }
 }
 

 // Load saved data on page load
 loadAdditionalData();

 document.addEventListener("DOMContentLoaded", function () {
     
     document.getElementById("resetWaterBtn").addEventListener("click", resetWater);
     let waterCount = 0;
     const maxWater = 8;
 
     const waterProgress = document.getElementById("waterProgress");
     const waterCountDisplay = document.getElementById("waterCount");
     const increaseWaterBtn = document.getElementById("increaseWaterBtn");
     const generateReportButton = document.querySelector(".generate-report");
 
     function updateWaterTracker() {
         waterProgress.value = waterCount;
         waterCountDisplay.innerText = `${waterCount}/${maxWater} glasses`;
     }
 
     function increaseWater() {
         if (waterCount < maxWater) {
             waterCount++;
             updateWaterTracker();
         } else {
             alert("🚰 You've already reached your daily water goal!");
         }
     }
 
     function resetWater() {
         waterCount = 0;
         updateWaterTracker();
     }
 
     // Ensure button works properly
     increaseWaterBtn.addEventListener("click", increaseWater);
 
     generateReportButton?.addEventListener("click", function () {
         const mood = document.getElementById("moodSelect")?.value || "Not Set";
         alert(`📊 Daily Report:\n💧 Water Intake: ${waterCount}/${maxWater} glasses\n😊 Mood: ${mood}`);
     });
     
 
     updateWaterTracker();
 });

 document.addEventListener("DOMContentLoaded", function () {
     let waterCount = 0;
     const maxWater = 8;
 
     const waterProgress = document.getElementById("waterProgress");
     const waterCountDisplay = document.getElementById("waterCount");
     const generateReportButton = document.querySelector(".generate-report");
 
     function updateWaterTracker() {
         waterProgress.value = waterCount;
         waterCountDisplay.innerText = `${waterCount}/${maxWater} glasses`;
     }
 
     window.increaseWater = function () {
         if (waterCount < maxWater) {
             waterCount++;
             updateWaterTracker();
         } else {
             alert("You've already reached your daily water goal!");
         }
     };
 
     generateReportButton.addEventListener("click", function () {
         const mood = document.getElementById("moodSelect").value;
         const thought = document.querySelector(".thought-of-day").innerText.trim();
         
         // Collect task list
         const tasks = [];
         document.querySelectorAll(".task-item").forEach(task => {
             const taskText = task.querySelector(".task-content").innerText.trim();
             tasks.push(`- ${taskText}`);
         });
 
         // Collect schedule
         const schedule = [];
         document.querySelectorAll(".schedule-item").forEach(event => {
             const time = event.querySelector(".schedule-time")?.innerText.trim() || "No time set";
             const eventText = event.querySelector(".schedule-input")?.value.trim() || "No event description";
             schedule.push(`⏰ ${time}: ${eventText}`);
         });
 
         // Format report content
             const reportText = `
     📊 Daily Report:
     
     💧 Water Intake: ${waterCount}/${maxWater} glasses
     😊 Mood: ${mood}
     
     💡 Thought of the Day:
     "${thought}"
     
     ✅ Tasks:
     ${tasks.length > 0 ? tasks.join("\n") : "No tasks recorded"}
     
     📅 Schedule:
     ${schedule.length > 0 ? schedule.join("\n") : "No scheduled events"}
     `;

     
 
         // Create a Blob with the report text
         const blob = new Blob([reportText], { type: "text/plain" });
 
         // Create a temporary download link
         const link = document.createElement("a");
         link.href = URL.createObjectURL(blob);
         link.download = "Daily_Report.txt";
 
         // Append to the body, trigger the click, and remove it
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
     });
 
     updateWaterTracker();
 });
 
 function saveAdditionalData() {
     const goals = document.getElementById('goals').value;
     const notes = document.getElementById('notes').value;
     const forTomorrow = document.getElementById('for-tomorrow').value;
     
     // Store water intake
     const waterCount = document.getElementById("waterProgress").value;
 
     // Store mood tracker selection
     const mood = document.getElementById("moodSelect").value;
 
     // Store schedule
     const schedule = {};
     for (let hour = 0; hour < 24; hour++) {
         const input = document.getElementById(`schedule-${hour}`);
         if (input) {
             schedule[hour] = input.value;
         }
     }
 
     localStorage.setItem('plannerData', JSON.stringify({
         goals,
         notes,
         forTomorrow,
         schedule,
         waterCount,
         mood
     }));
 }
 function loadAdditionalData() {
     const savedData = localStorage.getItem('plannerData');
     if (savedData) {
         const { goals, notes, forTomorrow, schedule, waterCount, mood } = JSON.parse(savedData);
         
         document.getElementById('goals').value = goals || '';
         document.getElementById('notes').value = notes || '';
         document.getElementById('for-tomorrow').value = forTomorrow || '';
 
         // Load schedule
         for (let hour = 0; hour < 24; hour++) {
             const input = document.getElementById(`schedule-${hour}`);
             if (input) {
                 input.value = schedule[hour] || '';
             }
         }
 
         // Load water tracker
         document.getElementById("waterProgress").value = waterCount || 0;
         document.getElementById("waterCount").innerText = `${waterCount || 0}/8 glasses`;
 
         // Load mood tracker
         document.getElementById("moodSelect").value = mood || "neutral";
     }
 }
 document.addEventListener("DOMContentLoaded", function () {
     loadAdditionalData(); // Load stored data when page loads
 
     // Save when inputs change
     ['goals', 'notes', 'for-tomorrow'].forEach(id => {
         document.getElementById(id).addEventListener('input', saveAdditionalData);
     });
 
     // Save schedule changes
     for (let hour = 0; hour < 24; hour++) {
         const input = document.getElementById(`schedule-${hour}`);
         if (input) {
             input.addEventListener('input', saveAdditionalData);
         }
     }
 
     // Save water tracker changes
     document.getElementById("increaseWaterBtn").addEventListener("click", function () {
         let waterCount = parseInt(document.getElementById("waterProgress").value) || 0;
         if (waterCount < 8) {
             waterCount++;
             document.getElementById("waterProgress").value = waterCount;
             document.getElementById("waterCount").innerText = `${waterCount}/8 glasses`;
             saveAdditionalData(); // Store updated value
         }
     });
 
     document.getElementById("resetWaterBtn").addEventListener("click", function () {
         document.getElementById("waterProgress").value = 0;
         document.getElementById("waterCount").innerText = "0/8 glasses";
         saveAdditionalData();
     });
 
     // Save mood tracker changes
     document.getElementById("moodSelect").addEventListener("change", saveAdditionalData);
 });
 