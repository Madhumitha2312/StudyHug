function loadUsername(){

  let username = getDisplayName();
  
  document.getElementById("dashboardWelcome").innerText =
  "Hey " + username + " 👋";
  
  document.getElementById("topbarUsername").innerText =
  username;
  
}
  
  // --- Storage helpers -------------------------------------------------------
const STORAGE_KEYS = {
  USERS: "studyhug_users",
  CURRENT_USER: "studyhug_current_user",
  TASKS: "studyhug_tasks",
  NOTES: "studyhug_notes",
  TIMETABLE: "studyhug_timetable",
  EXAMS: "studyhug_exams",
  PROFILE: "studyhug_profile",
  SETTINGS: "studyhug_settings",
  STATS: "studyhug_stats",
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- State ------------------------------------------------------------------
let currentUser = readStorage(STORAGE_KEYS.CURRENT_USER, null);
let users = readStorage(STORAGE_KEYS.USERS, []);
let tasks = readStorage(STORAGE_KEYS.TASKS, []);
let notes = readStorage(STORAGE_KEYS.NOTES, []);
let timetable = readStorage(STORAGE_KEYS.TIMETABLE, []);
let exams = readStorage(STORAGE_KEYS.EXAMS, []);
let profile = readStorage(STORAGE_KEYS.PROFILE, {});
let settings = readStorage(STORAGE_KEYS.SETTINGS, {
  theme: "light",
  notificationsEnabled: true,
  waterIntervalMinutes: 30,
  waterEnabled: false,
  studyDurationMinutes: 25,
  accentColor: "blue",
  backgroundColor: "light",
});
let stats = readStorage(STORAGE_KEYS.STATS, {
  studyMinutesToday: 0,
  tasksCompleted: 0,
  waterRemindersShown: 0,
  studySessions: 0,
  studyStreakDays: 0,
  lastStudyDate: null,
  date: new Date().toDateString(),
});

// reset daily stats (but keep streak info) if date changed
const todayString = new Date().toDateString();
if (stats.date !== todayString) {
  stats.studyMinutesToday = 0;
  stats.tasksCompleted = 0;
  stats.waterRemindersShown = 0;
  stats.studySessions = 0;
  stats.date = todayString;
  writeStorage(STORAGE_KEYS.STATS, stats);
}

// --- DOM references ---------------------------------------------------------
const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-item");
const sidebar = document.getElementById("sidebar");
const topbarTitle = document.getElementById("topbarTitle");
const topbarUser = document.getElementById("topbarUser");
const topbarUsername = document.getElementById("topbarUsername");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");

// Landing
const landingStartBtn = document.getElementById("landingStartBtn");
const landingLoginBtn = document.getElementById("landingLoginBtn");
const landingSignupBtn = document.getElementById("landingSignupBtn");
const heroStudyMinutes = document.getElementById("heroStudyMinutes");
const heroTasksDone = document.getElementById("heroTasksDone");
const heroHydrationStreak = document.getElementById("heroHydrationStreak");

// Auth
const loginView = document.getElementById("login-view");
const signupView = document.getElementById("signup-view");
const landingView = document.getElementById("landing-view");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");
const goToSignup = document.getElementById("goToSignup");
const goToLogin = document.getElementById("goToLogin");
const logoutBtn = document.getElementById("logoutBtn");

// Dashboard
const dashboardWelcome = document.getElementById("dashboardWelcome");
const dashboardQuote = document.getElementById("dashboardQuote");
const dashboardStreak = document.getElementById("dashboardStreak");
const dashboardStreakDays = document.getElementById("dashboardStreakDays");
const dashStreakDays = document.getElementById("dashStreakDays");
const dashStudyToday = document.getElementById("dashStudyToday");
const dashSessions = document.getElementById("dashSessions");
const dashWaterCount = document.getElementById("dashWaterCount");
const dashboardTasks = document.getElementById("dashboardTasks");
const dashboardProgressFill = document.getElementById("dashboardProgressFill");
const dashboardProgressLabel = document.getElementById("dashboardProgressLabel");
const dashboardExamReminders = document.getElementById("dashboardExamReminders");
const dashboardAssignmentReminders = document.getElementById(
  "dashboardAssignmentReminders"
);

// Tasks
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Timetable
const timetableForm = document.getElementById("timetableForm");
const timetableBody = document.getElementById("timetableBody");

// Exam timetable
const examForm = document.getElementById("examForm");
const examBody = document.getElementById("examBody");

// Notes
const noteForm = document.getElementById("noteForm");
const notesList = document.getElementById("notesList");

// Timer
const timerModeEl = document.getElementById("timerMode");
const timerCountdownEl = document.getElementById("timerCountdown");
const timerStartBtn = document.getElementById("timerStart");
const timerPauseBtn = document.getElementById("timerPause");
const timerResetBtn = document.getElementById("timerReset");
const timerSubtitleEl = document.getElementById("timerSubtitle");
const timerSessionsEl = document.getElementById("timerSessions").querySelector(
  "span"
);

// Progress
const metricTasksDone = document.getElementById("metricTasksDone");
const metricTasksPending = document.getElementById("metricTasksPending");
const metricSessions = document.getElementById("metricSessions");
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");

// Water reminder
const waterIntervalSelect = document.getElementById("waterInterval");
const waterToggle = document.getElementById("waterToggle");
const waterStatus = document.getElementById("waterStatus");
const waterModal = document.getElementById("waterModal");
const waterModalClose = document.getElementById("waterModalClose");

// Profile
const profileForm = document.getElementById("profileForm");
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const profileGoal = document.getElementById("profileGoal");

// Settings
const themeToggle = document.getElementById("themeToggle");
const lightModeBtn = document.getElementById("lightModeBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const notificationsToggle = document.getElementById("notificationsToggle");
const settingsUsernameInput = document.getElementById("settingsUsername");
const timerDurationSelect = document.getElementById("timerDurationSelect");
const accentColorSelect = document.getElementById("accentColorSelect");
const backgroundColorSelect = document.getElementById("backgroundColorSelect");

// AI Assistant
const aiForm = document.getElementById("aiForm");
const aiQuestionInput = document.getElementById("aiQuestion");
const chatMessagesEl = document.getElementById("chatMessages");

// --- Navigation & view management -------------------------------------------
function showView(id) {
  views.forEach((v) => v.classList.add("hidden"));
  const target = document.getElementById(id);
  if (target) target.classList.remove("hidden");
  if (window.innerWidth < 768 && !sidebar.classList.contains("hidden")) {
    sidebar.classList.add("hidden");
  }

  // highlight nav
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === id);
  });

  const titleMap = {
    "dashboard-view": "Dashboard",
    "planner-view": "Tasks",
    "timetable-view": "Timetable",
    "exam-view": "Exam Timetable",
    "assignments-view": "Assignments",
    "notes-view": "Notes",
    "timer-view": "Pomodoro Timer",
    "progress-view": "Progress Tracker",
    "water-view": "Water Reminder",
    "ai-view": "AI Assistant",
    "profile-view": "Profile",
    "settings-view": "Settings",
    "subscription-view": "Plans",
  };
  topbarTitle.textContent = titleMap[id] || "StudyHug";

  if (id === "dashboard-view") renderDashboard();
  if (id === "planner-view") renderTasks();
  if (id === "notes-view") renderNotes();
  if (id === "progress-view") renderProgress();
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const viewId = btn.dataset.view;
    showView(viewId);
  });
});

mobileMenuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

// --- Auth -------------------------------------------------------------------
function saveUsers() {
  writeStorage(STORAGE_KEYS.USERS, users);
}

function updateStoredUserName(email, newName) {
  const user = users.find((u) => u.email === email);
  if (user) {
    user.username = newName;
    saveUsers();
  }
}

function getDisplayName() {
  if (profile && profile.username) return profile.username;
  if (currentUser && currentUser.username) return currentUser.username;
  return "Student";
}

function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    writeStorage(STORAGE_KEYS.CURRENT_USER, user);
    sidebar.classList.remove("hidden");
    topbarUser.classList.remove("hidden");
    topbarUsername.textContent = getDisplayName();
    landingView.classList.add("hidden");
    showView("dashboard-view");
    hydrateProfileDefaults();
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    sidebar.classList.add("hidden");
    topbarUser.classList.add("hidden");
    landingView.classList.remove("hidden");
    showView("landing-view");
  }
}

landingLoginBtn.addEventListener("click", () => {
  landingView.classList.add("hidden");
  signupView.classList.add("hidden");
  loginView.classList.remove("hidden");
  showView("login-view");
});

landingSignupBtn.addEventListener("click", () => {
  landingView.classList.add("hidden");
  loginView.classList.add("hidden");
  signupView.classList.remove("hidden");
  showView("signup-view");
});

goToSignup.addEventListener("click", () => {
  loginView.classList.add("hidden");
  signupView.classList.remove("hidden");
  showView("signup-view");
});

goToLogin.addEventListener("click", () => {
  signupView.classList.add("hidden");
  loginView.classList.remove("hidden");
  showView("login-view");
});


let tempSignupEmail = null;
signupForm.addEventListener("submit", (e)=>{

  e.preventDefault();
  
  const email =
  document.getElementById("signupEmail").value.trim();
  
  const password =
  document.getElementById("signupPassword").value;
  
  if(!email || !password){
  
  signupError.textContent="Fill all fields";
  signupError.classList.remove("hidden");
  return;
  
  }
  
  if(users.some(u=>u.email===email)){
  
  signupError.textContent="Account exists";
  signupError.classList.remove("hidden");
  return;
  
  }
  
  const newUser={
  
  email:email,
  password:password,
  username:""
  
  };
  
  users.push(newUser);
  
  saveUsers();
  
  tempSignupEmail=email;
  
  showView("username-view");
  
});

loginForm.addEventListener("submit",(e)=>{

  e.preventDefault();
  
  const email =
  document.getElementById("loginEmail").value.trim();
  
  const password =
  document.getElementById("loginPassword").value;
  
  const found =
  users.find(u =>
  u.email===email &&
  u.password===password
  );
  
  if(!found){
  
  loginError.textContent="Invalid email or password";
  loginError.classList.remove("hidden");
  return;
  
  }
  
  /* restore profile */
  profile.username = found.username;
  profile.email = found.email;
  
  writeStorage(STORAGE_KEYS.PROFILE, profile);
  
  /* login */
  setCurrentUser(found);
  
  loadUsername();
  
  showView("dashboard-view");
  
});

document.getElementById("saveUsernameBtn")
.addEventListener("click", function(){

let name =
document.getElementById("usernameInput").value.trim();

if(!name) return;

let user =
users.find(u => u.email === tempSignupEmail);

if(!user){
alert("Signup failed");
return;
}

/* SAVE USERNAME */
user.username = name;

saveUsers();

/* SAVE PROFILE */
profile.username = name;
profile.email = user.email;

writeStorage(STORAGE_KEYS.PROFILE, profile);

/* LOGIN */
setCurrentUser(user);

loadUsername();

showView("dashboard-view");

});

logoutBtn.addEventListener("click", () => {

  localStorage.removeItem("username");
  
  setCurrentUser(null);
  
});

// --- Dashboard --------------------------------------------------------------
const QUOTES = [
  "Small consistent efforts beat last‑minute marathons.",
  "Study smarter today so future you can relax tomorrow.",
  "Focus for 25 minutes; your future self will thank you.",
  "Deep work now, big results later.",
  "Hydrated brain, sharper thinking.",
];

function renderDashboard() {
  if (!currentUser) return;
  const name = getDisplayName();
  const streakDays = stats.studyStreakDays || 0;
  dashboardWelcome.textContent = `Hey ${name} 👋`;
  if (dashboardStreak) {
    dashboardStreak.textContent = `🔥 Study Streak: ${streakDays} days`;
  }
  if (dashboardStreakDays) {
    dashboardStreakDays.textContent = streakDays.toString();
  }
  dashboardQuote.textContent =
    QUOTES[Math.floor(Math.random() * QUOTES.length)];

  dashStudyToday.textContent = `${stats.studyMinutesToday || 0} min`;
  if (dashStreakDays) {
    dashStreakDays.textContent = `${streakDays} days`;
  }
  if (dashSessions) {
    dashSessions.textContent = (stats.studySessions || 0).toString();
  }
  dashWaterCount.textContent = `${stats.waterRemindersShown || 0}`;

  dashboardTasks.innerHTML = "";
  const today = new Date().toDateString();
  const todaysTasks = tasks.filter((t) => t.deadline === today);
  todaysTasks.slice(0, 4).forEach((t) => {
    const li = document.createElement("li");
    li.textContent = `${t.subject} – ${t.title}`;
    dashboardTasks.appendChild(li);
  });

  // daily progress bar based on today's tasks
  if (dashboardProgressFill && dashboardProgressLabel) {
    const totalToday = todaysTasks.length;
    const doneToday = todaysTasks.filter((t) => t.completed).length;
    const percentToday =
      totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0;
    dashboardProgressFill.style.width = `${percentToday}%`;
    dashboardProgressLabel.textContent = `${percentToday}% of today's tasks completed`;
  }

  // dashboard exam reminders as compact chips
  if (dashboardExamReminders) {
    dashboardExamReminders.innerHTML = "";
    if (!exams.length) {
      const div = document.createElement("div");
      div.className = "subtitle";
      div.textContent = "No upcoming exams added.";
      dashboardExamReminders.appendChild(div);
    } else {
      exams
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 4)
        .forEach((exam) => {
          const days = daysRemaining(exam.date);
          const chip = document.createElement("div");
          chip.className = "reminder-chip " + getReminderColorClass(days);

          const title = document.createElement("span");
          title.className = "reminder-title";
          title.textContent = exam.subject;

          const meta = document.createElement("span");
          meta.className = "reminder-meta";
          meta.textContent =
            days === 0 ? "Today / Passed" : `${days} day(s) to go`;

          chip.appendChild(title);
          chip.appendChild(meta);
          dashboardExamReminders.appendChild(chip);
        });
    }
  }

  // dashboard assignment reminders as compact chips
  if (dashboardAssignmentReminders) {
    dashboardAssignmentReminders.innerHTML = "";
    if (!assignments.length) {
      const div = document.createElement("div");
      div.className = "subtitle";
      div.textContent = "No upcoming assignments.";
      dashboardAssignmentReminders.appendChild(div);
    } else {
      assignments
        .slice()
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4)
        .forEach((a) => {
          const days = daysRemainingFromToday(a.dueDate);
          const chip = document.createElement("div");
          chip.className = "reminder-chip " + getReminderColorClass(days);

          const title = document.createElement("span");
          title.className = "reminder-title";
          title.textContent = a.name;

          const meta = document.createElement("span");
          meta.className = "reminder-meta";
          meta.textContent =
            days === 0 ? "Today / Passed" : `${days} day(s) left`;

          chip.appendChild(title);
          chip.appendChild(meta);
          dashboardAssignmentReminders.appendChild(chip);
        });
    }
  }
}

// --- Planner ---------------------------------------------------------------
function saveTasks() {
  writeStorage(STORAGE_KEYS.TASKS, tasks);
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const subject = document.getElementById("taskSubject").value.trim();
  const title = document.getElementById("taskTitle").value.trim();
  const deadline = document.getElementById("taskDeadline").value;
  if (!subject || !title || !deadline) return;

  tasks.push({
    id: Date.now(),
    subject,
    title,
    deadline: new Date(deadline).toDateString(),
    completed: false,
  });
  saveTasks();
  taskForm.reset();
  renderTasks();
  renderProgress();
});

function toggleTaskCompletion(id) {
  const t = tasks.find((x) => x.id === id);
  if (!t) return;
  t.completed = !t.completed;
  if (t.completed) {
    stats.tasksCompleted = (stats.tasksCompleted || 0) + 1;
    writeStorage(STORAGE_KEYS.STATS, stats);
  }
  saveTasks();
  renderTasks();
  renderProgress();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
  renderProgress();
}

function renderTasks() {
  taskList.innerHTML = "";
  if (!tasks.length) {
    taskList.innerHTML =
      '<p class="subtitle">No tasks yet. Add your first study task above.</p>';
    return;
  }

  tasks
    .slice()
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .forEach((task) => {
      const div = document.createElement("div");
      div.className = "task-item";

      const main = document.createElement("div");
      main.className = "task-main";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => toggleTaskCompletion(task.id));

      const meta = document.createElement("div");
      meta.className = "task-meta";

      const title = document.createElement("span");
      title.className = "task-title";
      title.textContent = task.title;
      if (task.completed) {
        title.style.textDecoration = "line-through";
        title.style.opacity = "0.7";
      }

      const subject = document.createElement("span");
      subject.className = "task-subject";
      subject.textContent = task.subject;

      const deadline = document.createElement("span");
      deadline.className = "task-deadline";
      deadline.textContent = task.deadline;

      meta.appendChild(title);
      meta.appendChild(subject);
      meta.appendChild(deadline);

      main.appendChild(checkbox);
      main.appendChild(meta);

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const statusBadge = document.createElement("span");
      statusBadge.className = "badge " + (task.completed ? "" : "badge-muted");
      statusBadge.textContent = task.completed ? "Done" : "Pending";

      const delBtn = document.createElement("button");
      delBtn.className = "btn-ghost small";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => deleteTask(task.id));

      actions.appendChild(statusBadge);
      actions.appendChild(delBtn);

      div.appendChild(main);
      div.appendChild(actions);

      taskList.appendChild(div);
    });
}

// --- Notes ------------------------------------------------------------------
function saveNotes() {
  writeStorage(STORAGE_KEYS.NOTES, notes);
}

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();
  if (!title || !content) return;

  notes.push({
    id: Date.now(),
    title,
    content,
  });
  saveNotes();
  noteForm.reset();
  renderNotes();
});

function editNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;
  const newTitle = prompt("Edit title", note.title);
  if (newTitle === null) return;
  const newContent = prompt("Edit note", note.content);
  if (newContent === null) return;
  note.title = newTitle.trim();
  note.content = newContent.trim();
  saveNotes();
  renderNotes();
}

function deleteNote(id) {
  notes = notes.filter((n) => n.id !== id);
  saveNotes();
  renderNotes();
}

function renderNotes() {
  notesList.innerHTML = "";
  if (!notes.length) {
    notesList.innerHTML =
      '<p class="subtitle">No notes yet. Capture your first idea above.</p>';
    return;
  }

  notes
    .slice()
    .sort((a, b) => b.id - a.id)
    .forEach((note) => {
      const div = document.createElement("div");
      div.className = "note-card";

      const title = document.createElement("div");
      title.className = "note-title";
      title.textContent = note.title;

      const content = document.createElement("div");
      content.className = "note-content";
      content.textContent = note.content;

      const actions = document.createElement("div");
      actions.className = "note-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "btn-ghost small";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => editNote(note.id));

      const delBtn = document.createElement("button");
      delBtn.className = "btn-outline small";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => deleteNote(note.id));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      div.appendChild(title);
      div.appendChild(content);
      div.appendChild(actions);

      notesList.appendChild(div);
    });
}

// --- Timer / Pomodoro ------------------------------------------------------
let timerInterval = null;
let timerSecondsRemaining = (settings.studyDurationMinutes || 25) * 60;
let timerMode = "focus"; // "focus" or "break"

function updateTimerDisplay() {
  const minutes = Math.floor(timerSecondsRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timerSecondsRemaining % 60).toString().padStart(2, "0");
  timerCountdownEl.textContent = `${minutes}:${seconds}`;
  timerModeEl.textContent = timerMode === "focus" ? "Focus" : "Break";
}

function setTimerMode(mode) {
  timerMode = mode;
  const focusMinutes = settings.studyDurationMinutes || 25;
  timerSecondsRemaining = mode === "focus" ? focusMinutes * 60 : 5 * 60;
  updateTimerDisplay();
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerSecondsRemaining -= 1;
    if (timerSecondsRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;

      if (timerMode === "focus") {
        const focusMinutes = settings.studyDurationMinutes || 25;
        stats.studyMinutesToday =
          (stats.studyMinutesToday || 0) + focusMinutes;
        stats.studySessions = (stats.studySessions || 0) + 1;

        // update streak
        const today = new Date();
        const todayStr = today.toDateString();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (!stats.studyStreakDays || !stats.lastStudyDate) {
          stats.studyStreakDays = 1;
        } else if (stats.lastStudyDate === todayStr) {
          // same day, keep streak
        } else if (stats.lastStudyDate === yesterdayStr) {
          stats.studyStreakDays += 1;
        } else {
          stats.studyStreakDays = 1;
        }
        stats.lastStudyDate = todayStr;

        writeStorage(STORAGE_KEYS.STATS, stats);
        timerSessionsEl.textContent = stats.studySessions.toString();
        setTimerMode("break");
      } else {
        setTimerMode("focus");
      }
      renderDashboard();
      renderProgress();
      updateLandingStats();
      return;
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  pauseTimer();
  setTimerMode("focus");
}

timerStartBtn.addEventListener("click", startTimer);
timerPauseBtn.addEventListener("click", pauseTimer);
timerResetBtn.addEventListener("click", resetTimer);

// --- Progress --------------------------------------------------------------
function renderProgress() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = total - done;

  metricTasksDone.textContent = done.toString();
  metricTasksPending.textContent = pending.toString();
  metricSessions.textContent = (stats.studySessions || 0).toString();

  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
  progressFill.style.width = `${percentage}%`;
  progressLabel.textContent = `${percentage}% of planned tasks completed`;
}

// --- Water reminder --------------------------------------------------------
let waterIntervalId = null;

function applyWaterSettings() {
  waterIntervalSelect.value = String(settings.waterIntervalMinutes || 30);
  waterToggle.checked = !!settings.waterEnabled;
  updateWaterStatus();
  setupWaterTimer();
}

function updateWaterStatus() {
  if (settings.waterEnabled) {
    waterStatus.textContent = `Reminders every ${
      settings.waterIntervalMinutes || 30
    } minutes are ON.`;
  } else {
    waterStatus.textContent = "Reminders are currently off.";
  }
}

function setupWaterTimer() {
  if (waterIntervalId) {
    clearInterval(waterIntervalId);
    waterIntervalId = null;
  }
  if (!settings.waterEnabled) return;

  const intervalMs = (settings.waterIntervalMinutes || 30) * 60 * 1000;
  waterIntervalId = setInterval(() => {
    if (!settings.notificationsEnabled) return;
    showWaterReminder();
  }, intervalMs);
}

function showWaterReminder() {
  waterModal.classList.remove("hidden");
  stats.waterRemindersShown = (stats.waterRemindersShown || 0) + 1;
  writeStorage(STORAGE_KEYS.STATS, stats);
  renderDashboard();
  updateLandingStats();
}

waterModalClose.addEventListener("click", () => {
  waterModal.classList.add("hidden");
});

waterIntervalSelect.addEventListener("change", () => {
  settings.waterIntervalMinutes = Number(waterIntervalSelect.value);
  writeStorage(STORAGE_KEYS.SETTINGS, settings);
  updateWaterStatus();
  setupWaterTimer();
});

waterToggle.addEventListener("change", () => {
  settings.waterEnabled = waterToggle.checked;
  writeStorage(STORAGE_KEYS.SETTINGS, settings);
  updateWaterStatus();
  setupWaterTimer();
});

// --- Profile ---------------------------------------------------------------
function hydrateProfileDefaults() {
  if (!currentUser) return;
  if (!profile.email) {
    profile = {
      username: currentUser.username,
      email: currentUser.email,
      goalHours: 4,
    };
    writeStorage(STORAGE_KEYS.PROFILE, profile);
  }
  profileUsername.value = profile.username || currentUser.username;
  profileEmail.value = profile.email || currentUser.email;
  profileGoal.value = profile.goalHours || "";
}

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  profile.username = profileUsername.value.trim() || profile.username;
  profile.email = profileEmail.value.trim() || profile.email;
  profile.goalHours = Number(profileGoal.value) || profile.goalHours;
  writeStorage(STORAGE_KEYS.PROFILE, profile);
  localStorage.setItem(
    "username",
    profile.username
    );
    
  loadUsername();
  if (currentUser) {
    currentUser.username = profile.username;
    currentUser.email = profile.email;
    writeStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    updateStoredUserName(currentUser.email, currentUser.username);
    topbarUsername.textContent = getDisplayName();
    renderDashboard();
  }
});

// --- Settings & Theme ------------------------------------------------------
function applyTheme() {
  if (settings.theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙";
  }
}

themeToggle.addEventListener("click", () => {
  settings.theme = settings.theme === "dark" ? "light" : "dark";
  writeStorage(STORAGE_KEYS.SETTINGS, settings);
  applyTheme();
});

lightModeBtn.addEventListener("click", () => {
  settings.theme = "light";
  writeStorage(STORAGE_KEYS.SETTINGS, settings);
  applyTheme();
});

darkModeBtn.addEventListener("click", () => {
  settings.theme = "dark";
  writeStorage(STORAGE_KEYS.SETTINGS, settings);
  applyTheme();
});

notificationsToggle.addEventListener("change", () => {
  settings.notificationsEnabled = notificationsToggle.checked;
  writeStorage(STORAGE_KEYS.SETTINGS, settings);
});

function applyAccentColor() {
  const accent = settings.accentColor || "blue";
  const root = document.documentElement;
  if (accent === "green") {
    root.style.setProperty("--primary", "#22c55e");
    root.style.setProperty("--primary-strong", "#15803d");
    root.style.setProperty("--primary-soft", "#dcfce7");
  } else if (accent === "pink") {
    root.style.setProperty("--primary", "#ec4899");
    root.style.setProperty("--primary-strong", "#db2777");
    root.style.setProperty("--primary-soft", "#fce7f3");
  } else if (accent === "purple") {
    root.style.setProperty("--primary", "#8b5cf6");
    root.style.setProperty("--primary-strong", "#6d28d9");
    root.style.setProperty("--primary-soft", "#ede9fe");
  } else {
    // blue
    root.style.setProperty("--primary", "#3b82f6");
    root.style.setProperty("--primary-strong", "#1d4ed8");
    root.style.setProperty("--primary-soft", "#dbeafe");
  }
}

function applyBackgroundTheme() {
  const choice = settings.backgroundColor || "light";
  if (choice === "dark") {
    document.body.style.background = "#020617";
  } else if (choice === "pink") {
    document.body.style.background =
      "radial-gradient(circle at top left, #ffe4e6, #fdf2f8)";
  } else if (choice === "blue") {
    document.body.style.background =
      "radial-gradient(circle at top left, #e0f2fe, #eff6ff)";
  } else if (choice === "purple") {
    document.body.style.background =
      "radial-gradient(circle at top left, #ede9fe, #f5f3ff)";
  } else {
    // light default
    document.body.style.background =
      "radial-gradient(circle at top left, #e0e7ff, #f4f5fb), radial-gradient(circle at bottom right, #fee2e2, #f4f5fb)";
  }
}

function applySettingsUI() {
  notificationsToggle.checked = !!settings.notificationsEnabled;
  if (timerDurationSelect) {
    timerDurationSelect.value = String(settings.studyDurationMinutes || 25);
  }
  if (accentColorSelect) {
    accentColorSelect.value = settings.accentColor || "blue";
  }
  if (settingsUsernameInput) {
    settingsUsernameInput.value = getDisplayName();
  }
  if (backgroundColorSelect) {
    backgroundColorSelect.value = settings.backgroundColor || "light";
  }
}

if (settingsUsernameInput) {
  settingsUsernameInput.addEventListener("change", () => {
    const newName = settingsUsernameInput.value.trim();
    if (!newName || !currentUser) return;
    profile.username = newName;
    writeStorage(STORAGE_KEYS.PROFILE, profile);
    updateStoredUserName(currentUser.email, newName);
    currentUser.username = newName;
    writeStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    topbarUsername.textContent = getDisplayName();
    renderDashboard();
  });
}

if (timerDurationSelect) {
  timerDurationSelect.addEventListener("change", () => {
    settings.studyDurationMinutes = Number(timerDurationSelect.value) || 25;
    writeStorage(STORAGE_KEYS.SETTINGS, settings);
    resetTimer();
    if (timerSubtitleEl) {
      timerSubtitleEl.textContent = `Focus for ${settings.studyDurationMinutes} minutes • 5 minutes break`;
    }
  });
}

if (accentColorSelect) {
  accentColorSelect.addEventListener("change", () => {
    settings.accentColor = accentColorSelect.value || "blue";
    writeStorage(STORAGE_KEYS.SETTINGS, settings);
    applyAccentColor();
  });
}

if (backgroundColorSelect) {
  backgroundColorSelect.addEventListener("change", () => {
    settings.backgroundColor = backgroundColorSelect.value || "light";
    writeStorage(STORAGE_KEYS.SETTINGS, settings);
    applyBackgroundTheme();
  });
}

// --- Timetable --------------------------------------------------------------
function saveTimetable() {
  writeStorage(STORAGE_KEYS.TIMETABLE, timetable);
}

if (timetableForm) {
  timetableForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const subject = document.getElementById("timetableSubject").value.trim();
    const day = document.getElementById("timetableDay").value;
    const time = document.getElementById("timetableTime").value;
    if (!subject || !day || !time) return;

    timetable.push({
      id: Date.now(),
      subject,
      day,
      time,
    });
    saveTimetable();
    timetableForm.reset();
    renderTimetable();
  });
}

function deleteTimetableRow(id) {
  timetable = timetable.filter((row) => row.id !== id);
  saveTimetable();
  renderTimetable();
}

function renderTimetable() {
  if (!timetableBody) return;
  timetableBody.innerHTML = "";
  if (!timetable.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "No timetable entries yet.";
    td.className = "subtitle";
    tr.appendChild(td);
    timetableBody.appendChild(tr);
    return;
  }

  timetable.forEach((row) => {
    const tr = document.createElement("tr");

    const tdSubject = document.createElement("td");
    tdSubject.textContent = row.subject;

    const tdDay = document.createElement("td");
    tdDay.textContent = row.day;

    const tdTime = document.createElement("td");
    tdTime.textContent = row.time;

    const tdActions = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.className = "btn-ghost small";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteTimetableRow(row.id));
    tdActions.appendChild(delBtn);

    tr.appendChild(tdSubject);
    tr.appendChild(tdDay);
    tr.appendChild(tdTime);
    tr.appendChild(tdActions);

    timetableBody.appendChild(tr);
  });
}

// --- Exam timetable ---------------------------------------------------------
function saveExams() {
  writeStorage(STORAGE_KEYS.EXAMS, exams);
}

if (examForm) {
  examForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const subject = document.getElementById("examSubject").value.trim();
    const dateValue = document.getElementById("examDate").value;
    if (!subject || !dateValue) return;

    exams.push({
      id: Date.now(),
      subject,
      date: dateValue,
    });
    saveExams();
    examForm.reset();
    renderExams();
  });
}

function deleteExam(id) {
  exams = exams.filter((x) => x.id !== id);
  saveExams();
  renderExams();
}

function daysRemaining(dateValue) {
  const today = new Date();
  const examDate = new Date(dateValue);
  const todayMs = today.setHours(0, 0, 0, 0);
  const examMs = examDate.setHours(0, 0, 0, 0);
  const diffMs = examMs - todayMs;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? 0 : diffDays;
}

function renderExams() {
  if (!examBody) return;
  examBody.innerHTML = "";
  if (!exams.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "No exams added yet.";
    td.className = "subtitle";
    tr.appendChild(td);
    examBody.appendChild(tr);
    return;
  }

  exams
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((exam) => {
      const tr = document.createElement("tr");

      const tdSubject = document.createElement("td");
      tdSubject.textContent = exam.subject;

      const tdDate = document.createElement("td");
      tdDate.textContent = new Date(exam.date).toDateString();

      const tdRemaining = document.createElement("td");
      const days = daysRemaining(exam.date);
      tdRemaining.textContent =
        days === 0 ? "Today / Passed" : `${days} day(s)`;

      const tdActions = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.className = "btn-ghost small";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => deleteExam(exam.id));
      tdActions.appendChild(delBtn);

      tr.appendChild(tdSubject);
      tr.appendChild(tdDate);
      tr.appendChild(tdRemaining);
      tr.appendChild(tdActions);

      examBody.appendChild(tr);
    });
}

// --- Assignments (Dashboard) -------------------------------------------------
const STORAGE_ASSIGNMENTS = "studyhug_assignments";
let assignments = readStorage(STORAGE_ASSIGNMENTS, []);
const assignmentForm = document.getElementById("assignmentForm");
const assignmentBody = document.getElementById("assignmentBody");

function saveAssignments() {
  writeStorage(STORAGE_ASSIGNMENTS, assignments);
}

function daysRemainingFromToday(dateValue) {
  return daysRemaining(dateValue);
}

function getReminderColorClass(days) {
  if (days <= 1) return "reminder-red";
  if (days <= 3) return "reminder-yellow";
  return "reminder-green";
}

function renderAssignments() {
  if (!assignmentBody) return;
  assignmentBody.innerHTML = "";
  if (!assignments.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "No assignments added yet.";
    td.className = "subtitle";
    tr.appendChild(td);
    assignmentBody.appendChild(tr);
    return;
  }

  assignments
    .slice()
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .forEach((a) => {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      tdName.textContent = a.name;
      const tdSubject = document.createElement("td");
      tdSubject.textContent = a.subject;
      const tdDue = document.createElement("td");
      tdDue.textContent = new Date(a.dueDate).toDateString();
      const tdRem = document.createElement("td");
      const days = daysRemainingFromToday(a.dueDate);
      tdRem.textContent =
        days === 0 ? "Today / Passed" : `${days} days left`;

      tr.appendChild(tdName);
      tr.appendChild(tdSubject);
      tr.appendChild(tdDue);
      tr.appendChild(tdRem);

      assignmentBody.appendChild(tr);
    });
}

if (assignmentForm) {
  assignmentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("assignmentName").value.trim();
    const subject = document.getElementById("assignmentSubject").value.trim();
    const dateValue = document.getElementById("assignmentDate").value;
    if (!name || !subject || !dateValue) return;
    assignments.push({
      id: Date.now(),
      name,
      subject,
      dueDate: dateValue,
    });
    saveAssignments();
    assignmentForm.reset();
    renderAssignments();
  });
}

// --- AI Assistant -----------------------------------------------------------
function getAIResponseText(question) {
  const q = question.toLowerCase();
  if (q.includes("exam tips")) {
    return [
      "Here are some exam tips:",
      "- Revise daily so concepts stay fresh.",
      "- Practice problems instead of only rereading notes.",
      "- Take breaks to reset your focus.",
      "- Sleep well before the exam so your brain is sharp.",
    ].join("\n");
  }
  if (q.includes("time management")) {
    return [
      "Time management tips:",
      "- Use the Pomodoro technique for focused blocks.",
      "- Remove distractions (phone, social media) while studying.",
      "- Plan your tasks and do the most important one first.",
    ].join("\n");
  }
  return [
    "General study suggestions:",
    "- Set a clear goal for each study session.",
    "- Review your notes regularly instead of cramming.",
    "- Stay hydrated and move around between long sessions.",
  ].join("\n");
}

if (aiForm) {
  aiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const question = aiQuestionInput.value.trim();
    if (!question) return;

    if (!chatMessagesEl) return;

    const userBubble = document.createElement("div");
    userBubble.className = "bubble bubble-user";
    userBubble.textContent = question;
    chatMessagesEl.appendChild(userBubble);

    const text = getAIResponseText(question);
    const aiBubble = document.createElement("div");
    aiBubble.className = "bubble bubble-ai";
    aiBubble.innerHTML = text.replace(/\n/g, "<br>");
    chatMessagesEl.appendChild(aiBubble);

    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    aiQuestionInput.value = "";
  });
}

function updateLandingStats() {

  if(heroStudyMinutes)
  heroStudyMinutes.textContent =
  `${stats.studyMinutesToday || 0} min`;
  
  if(heroTasksDone)
  heroTasksDone.textContent =
  `${stats.tasksCompleted || 0}`;
  
  if(heroHydrationStreak)
  heroHydrationStreak.textContent =
  `${stats.waterRemindersShown || 0}`;
  
}

// --- Init -------------------------------------------------------------------
function init() {
  applyTheme();
  applyAccentColor();
  applyBackgroundTheme();
  applySettingsUI();
  applyWaterSettings();
  renderTasks();
  renderNotes();
  renderProgress();
  renderTimetable();
  renderExams();
  renderAssignments();
  updateLandingStats();

  if(currentUser){

    setCurrentUser(currentUser);
    
    loadUsername();
    
    }else{
    
    setCurrentUser(null);
    
  }

  timerSessionsEl.textContent = (stats.studySessions || 0).toString();
  setTimerMode("focus");
}

document.addEventListener("DOMContentLoaded", init);

