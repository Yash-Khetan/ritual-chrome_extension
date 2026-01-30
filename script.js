const STORAGE_KEY = "ritual-data";

const habitList = document.getElementById("habitList");
const addBtn = document.getElementById("addHabitBtn");
const dateEl = document.getElementById("date");

/* ---------- utilities ---------- */

function today() {
  return new Date().toISOString().split("T")[0];
}

function prettyDate() {
  return new Date().toDateString();
}

/* ---------- storage ---------- */

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      date: today(),
      habits: []
    };
  }
  return JSON.parse(raw);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ---------- reset logic ---------- */

function resetIfNewDay(data) {
  if (data.date !== today()) {
    data.habits.forEach(h => {
      if (h.completed) {
        h.streak += 1;
      } else {
        h.streak = 0;
      }
      h.completed = false;
    });
    data.date = today();
  }
  return data;
}

/* ---------- render ---------- */

function render(data) {
  habitList.innerHTML = "";
  dateEl.textContent = prettyDate();

  data.habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.className = "habit";
    if (habit.completed) li.classList.add("completed");

    const left = document.createElement("div");
    left.className = "habit-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.completed;

    checkbox.onclick = () => {
      toggleHabit(index);
    };

    const name = document.createElement("span");
    name.className = "habit-name";
    name.textContent = habit.name;

    left.appendChild(checkbox);
    left.appendChild(name);

    const streak = document.createElement("span");
    streak.className = "streak";
    streak.textContent = `🔥 ${habit.streak}`;

    li.appendChild(left);
    li.appendChild(streak);

    habitList.appendChild(li);
  });
}

/* ---------- actions ---------- */

function toggleHabit(index) {
  let data = loadData();
  data = resetIfNewDay(data);

  data.habits[index].completed = !data.habits[index].completed;

  saveData(data);
  render(data);
}

function addHabit(name) {
  let data = loadData();
  data = resetIfNewDay(data);

  data.habits.push({
    name,
    completed: false,
    streak: 0
  });

  saveData(data);
  render(data);
}

/* ---------- add habit button ---------- */

addBtn.onclick = () => {
  const name = prompt("New ritual:");
  if (!name || name.trim() === "") return;
  addHabit(name.trim());
};

/* ---------- init ---------- */

function init() {
  let data = loadData();
  data = resetIfNewDay(data);
  saveData(data);
  render(data);
}

init();
