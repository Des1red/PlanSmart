import { el } from "../components/dom.js";
import { renderCalendar } from "./calendar.js";
import { renderPlan } from "./plan.js";
import { getView } from "../state/view.js";

export function render(container) {

  const view = getView();

  container.innerHTML = "";

  const main = el("div");

  container.appendChild(main);

  if (view === "plan") {
    renderPlan(main);
  }

  if (view === "calendar") {
    renderCalendar(main);
  }

}