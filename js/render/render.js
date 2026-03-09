import { el } from "../components/dom.js";
import { renderSidebar } from "./sidebar.js";
import { renderCalendar } from "./calendar.js";
import { renderPlan } from "./plan.js";
import { getView } from "../state/view.js";

export function render(container) {

  const view = getView();

  container.innerHTML = "";

  const sidebar = el("div");
  const main = el("div");

  container.appendChild(sidebar);
  container.appendChild(main);

  renderSidebar(sidebar);

  if (view === "plan") {
    renderPlan(main);
  }

  if (view === "calendar") {
    renderCalendar(main);
  }

}