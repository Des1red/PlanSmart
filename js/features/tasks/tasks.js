import { addTask, removeTask, updateTask } from "../../state/plan.js";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createTask(data) {

  const task = {
    id:  makeId(),
    name: data.name,
    place: data.place,
    time: data.time,
    type: data.type,
    timesPerWeek: data.timesPerWeek
  };

  if (!task.name || !task.time) return;

  addTask(task);
}

export function deleteTask(id) {
  removeTask(id);
}

export function editTask(id, data) {

  const task = {
    id,
    name: data.name,
    place: data.place,
    time: data.time,
    type: data.type,
    timesPerWeek: data.timesPerWeek
  };

  if (!task.name || !task.time) return;

  updateTask(id, task);
}