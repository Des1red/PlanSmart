import { el } from "../components/dom.js";
import { renderCalendar } from "./calendar.js";
import { renderPlan } from "./plan.js";
import { renderTeam } from "./team.js";
import { getView } from "../state/view.js";

export function render(container) {
  const view = getView();

  container.style.transition = "opacity 0.15s ease";
  container.style.opacity = "0";

  requestAnimationFrame(() => {
    container.innerHTML = "";
    const main = el("div");
    container.appendChild(main);

    if (view === "plan") renderPlan(main);
    if (view === "calendar") renderCalendar(main);
    if (view === "team") renderTeam(main);

    requestAnimationFrame(() => {
      container.style.opacity = "1";
    });
  });
}