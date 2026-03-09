import { el } from "../components/dom.js";
import { renderTaskManager } from "./tasks.js";
import { renderPlanControls } from "./planControls.js";
import { getPlan } from "../state/plan.js";

export function renderPlan(container) {

  const plan = getPlan();

  container.innerHTML = "";

  const header = el("div", { class: "plan-header" }, [
    el("h1", { text: "PlanSmart" }),
    el("p", { text: `Daily cleaning time: ${plan.hoursPerDay} hours` })
  ]);

  const controlsContainer = el("div");
  const taskContainer = el("div");

  container.appendChild(header);
  container.appendChild(controlsContainer);
  container.appendChild(taskContainer);

  renderPlanControls(controlsContainer);
  renderTaskManager(taskContainer);

}