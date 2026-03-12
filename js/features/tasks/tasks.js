import { addTask, removeTask, updateTask } from "../../state/plan.js";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createTask(data) {

  let freq;

  if (data.type === "daily") freq = 7;
  else if (data.type === "monthly") freq = 1;
  else freq = Math.min(7, Math.max(1, data.timesPerWeek));

  const task = {
    id: makeId(),
    name: data.name,
    place: data.place,
    time: data.time,
    type: data.type,
    timesPerWeek: freq
  };

  if (!task.name || !task.time) return;

  addTask(task);
}

export function deleteTask(id) {
  removeTask(id);
}

export function editTask(id, data) {

  let freq;

  if (data.type === "daily") freq = 7;
  else if (data.type === "monthly") freq = 1;
  else freq = Math.min(7, Math.max(1, data.timesPerWeek));

  const task = {
    id,
    name: data.name,
    place: data.place,
    time: data.time,
    type: data.type,
    timesPerWeek: freq
  };

  if (!task.name || !task.time) return;

  updateTask(id, task);
}