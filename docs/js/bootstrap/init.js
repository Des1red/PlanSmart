import { initPlan, setPlan, ensurePlanIntegrity } from "../state/plan.js";
import { startWizard } from "../features/wizard/wizard.js";
import { render } from "../render/render.js";
import { subscribe } from "../state/events.js";
import { initSidebarInteractions } from "../features/sidebar/interactions.js";
import { sidebarCloseLogic } from "../features/sidebar/close.js";
import { renderSidebar } from "../render/sidebar.js";
import { evaluateStreak } from "../state/streak.js";
import { savePlan } from "../storage/storage.js";
import { restoreRoom } from "../features/team/team.js";

export function initApp(container) {

  function draw() {
    render(container);
  }

  subscribe(draw);

  initializePlanState(container, draw);

  registerServiceWorker();
}

function initializePlanState(container, draw) {

  const plan = initPlan();

  if (!plan) {

    startWizard(container, (newPlan) => {

      setPlan(newPlan);

      renderSidebar();
      initSidebarInteractions();
      sidebarCloseLogic();
      restoreRoom(); 
      draw();

    });

    return;
  }

  let changed = false;

  changed = ensurePlanIntegrity(plan) || changed;

  if (evaluateStreak(plan)) {
    changed = true;
  }

  if (changed) {
    savePlan(plan);
  }

  renderSidebar();
  initSidebarInteractions();
  sidebarCloseLogic();
  restoreRoom()
  draw();
}
function registerServiceWorker() {

  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register("./sw.js");

  let refreshing = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

}
