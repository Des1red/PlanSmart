import { loadPlan, savePlan } from "../storage/storage.js";
import { emit } from "./events.js";
import { generateCalendar } from "../core/scheduler.js";
import { uiAlert } from "../components/ui.js";
import { sendPlan } from "../sync/socket.js";

let plan = null;

export function getPlan() {
  return plan;
}

export function setPlan(newPlan,  remote = false) {

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
   if (!remote) recalcCalendar(); 
  emit();
  if (!remote) broadcastPlan();
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

function broadcastPlan() {
  sendPlan({
    tasks: plan.tasks,
    hoursPerDay: plan.hoursPerDay,
    streak: plan.streak,
    calendar: plan.calendar
  });
}

export function addTask(task) {
  plan.tasks.push(task);

  recalcCalendar();

  savePlan(plan);
  emit();
  broadcastPlan();
}

export function removeTask(id) {

  plan.tasks = plan.tasks.filter(t => t.id !== id);

  recalcCalendar();

  savePlan(plan);
  emit();
  broadcastPlan();
}

export function updateTask(id, updated) {

  const i = plan.tasks.findIndex(t => t.id === id);
  if (i === -1) return;

  plan.tasks[i] = updated;

  recalcCalendar();

  savePlan(plan);
  emit();
  broadcastPlan();
}

export function toggleTaskDone(dayNumber, taskId, checked) {

  const day = plan.calendar.days.find(d => d.day === dayNumber);
  if (!day) return;

  if (!Array.isArray(day.done)) {
    day.done = [];
  }

  if (checked) {
    if (!day.done.includes(taskId)) {
      day.done.push(taskId);
    }
  } else {
    day.done = day.done.filter(id => id !== taskId);
  }

  savePlan(plan);
  emit();
  broadcastPlan();
}

function recalcCalendar() {
  if (!plan.tasks || plan.tasks.length === 0) {
    plan.calendar = { month: null, year: null, weeks: 0, days: [] };
    return;
  }

  const doneMap = new Map();
  if (plan.calendar?.days) {
    for (const day of plan.calendar.days) {
      if (day.done?.length) {
        doneMap.set(day.day, day.done);
      }
    }
  }

  plan.calendar = generateCalendar(plan);

  const validIds = new Set(plan.tasks.map(t => t.id)); // 👈

  for (const day of plan.calendar.days) {
    if (doneMap.has(day.day)) {
      day.done = doneMap.get(day.day).filter(id => validIds.has(id)); // 👈
    }
  }
}

window.__applyRemotePlan = function(remotePlan) {

  setPlan({
    tasks: remotePlan.tasks || [],
    hoursPerDay: remotePlan.hoursPerDay || 2,
    streak: remotePlan.streak || {
      current: 0,
      best: 0,
      lastEvaluatedDate: null
    },
    calendar: remotePlan.calendar || {
      month: null,
      year: null,
      weeks: 0,
      days: []
    }
  },true);

};

window.__broadcastPlan = function () {

  if (!plan) {
    plan = loadPlan();
    if (!plan) return;
  }

  sendPlan({
    tasks: plan.tasks,
    hoursPerDay: plan.hoursPerDay,
    streak: plan.streak,
    calendar: plan.calendar
  });

};