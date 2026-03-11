import { loadPlan, savePlan } from "../storage/storage.js";
import { emit } from "./events.js";
import { generateCalendar } from "../core/scheduler.js";

let plan = null;

export function getPlan() {
  return plan;
}

export function setPlan(newPlan) {
  plan = newPlan;
  savePlan(plan);
  recalcCalendar();
  emit();
}

export function initPlan() {

  plan = loadPlan();

  if (plan) {
    if (!plan.streak) {
      plan.streak = {
        current: 0,
        best: 0,
        lastEvaluatedDate: null
      };
    }
    recalcCalendar();
  }

  return plan;
}

export function addTask(task) {
  plan.tasks.push(task);

  recalcCalendar();

  savePlan(plan);
  emit();
}

export function removeTask(id) {

  plan.tasks = plan.tasks.filter(t => t.id !== id);

  recalcCalendar();

  savePlan(plan);
  emit();
}

export function updateTask(id, updated) {

  const i = plan.tasks.findIndex(t => t.id === id);
  if (i === -1) return;

  plan.tasks[i] = updated;

  recalcCalendar();

  savePlan(plan);
  emit();
}

function recalcCalendar() {
  if (!plan.tasks || plan.tasks.length === 0) {
    plan.calendar = {
      weeks: 0,
      days: []
    };
    return;
  }

  plan.calendar = generateCalendar(plan);
}