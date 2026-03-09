const KEY = "cleaning_plan";

export function loadPlan() {
  try {
    const data = localStorage.getItem(KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function savePlan(plan) {
  localStorage.setItem(KEY, JSON.stringify(plan));
}

export function deletePlan() {
  localStorage.removeItem(KEY);
}