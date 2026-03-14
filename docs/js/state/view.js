import { emit } from "./events.js";

let currentView = "calendar";
export function getView() {
  return currentView;
}

export function setView(v) {
  currentView = v;
  emit();
}