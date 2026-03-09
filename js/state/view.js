import { emit } from "./events.js";

let currentView = "plan";

export function getView() {
  return currentView;
}

export function setView(v) {
  currentView = v;
  emit();
}