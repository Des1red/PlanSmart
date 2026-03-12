import { loadPlan, savePlan } from "../storage/storage.js";
import { emit } from "./events.js";
import { generateCalendar } from "../core/scheduler.js";
import { uiAlert } from "../components/ui.js";

let plan = null;

export function getPlan() {
  return plan;
}

export function setPlan(newPlan) {

  ensurePlanIntegrity(newPlan);

  const capacity = newPlan.hoursPerDay * 60;

  let longest = 0;

  for (const t of newPlan.tasks) {
    if (t.time > longest) longest = t.time;
  }

  if (longest > capacity) {
    uiAlert(
      `Longest task (${longest} min) exceeds daily capacity (${capacity} min)`
    );
  }

  plan = newPlan;

  savePlan(plan);
  recalcCalendar();
  emit();

}

export function initPlan() {
  plan = loadPlan();
  if (plan) {
    ensurePlanIntegrity(plan);
  }
  return plan;
}

export function ensurePlanIntegrity(plan) {
  let changed = false;

  if (!Array.isArray(plan.tasks)) {
    plan.tasks = [];
    changed = true;
  }

  if (typeof plan.hoursPerDay !== "number") {
    plan.hoursPerDay = 2; // sensible default
    changed = true;
  }
  /* sanitize tasks to prevent scheduler crashes */
  plan.tasks = plan.tasks.filter(t =>
    t &&
    typeof t.id === "string" &&
    typeof t.time === "number"
  );
  
  if (!plan.streak) {
    plan.streak = {
      current: 0,
      best: 0,
      lastEvaluatedDate: null
    };
    changed = true;
  } else {
    if (typeof plan.streak.current !== "number") {
      plan.streak.current = 0;
      changed = true;
    }

    if (typeof plan.streak.best !== "number") {
      plan.streak.best = 0;
      changed = true;
    }

    if (!("lastEvaluatedDate" in plan.streak)) {
      plan.streak.lastEvaluatedDate = null;
      changed = true;
    }
  }

  if (!plan.calendar) {
    plan.calendar = {
      month: null,
      year: null,
      weeks: 0,
      days: []
    };
    changed = true;
  }

  return changed;
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
      month: null,
      year: null,
      weeks: 0,
      days: []
    };
    return;
  }

  plan.calendar = generateCalendar(plan);
}