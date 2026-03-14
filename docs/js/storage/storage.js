const KEY = "cleaning_plan";
const ROOM_KEY = "cleaning_room";
const NAME_KEY = "plansmart_username";

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

export function saveRoom(code) {
  localStorage.setItem(ROOM_KEY, code);
}

export function loadRoom() {
  return localStorage.getItem(ROOM_KEY);
}

export function deleteRoom() {
  localStorage.removeItem(ROOM_KEY);
}

export function saveName(name) {
  localStorage.setItem(NAME_KEY, name);
}

export function loadName() {
  return localStorage.getItem(NAME_KEY);
}

export function deleteName() {
  return localStorage.removeItem(NAME_KEY)
}