import { initPlan, setPlan, ensurePlanIntegrity } from "../state/plan.js";
import { startWizard } from "../features/wizard/wizard.js";
import { render } from "../render/render.js";
import { subscribe } from "../state/events.js";
import { initSidebarInteractions } from "../features/sidebar/interactions.js";
import { sidebarCloseLogic } from "../features/sidebar/close.js";
import { evaluateStreak } from "../state/streak.js";
import { savePlan } from "../storage/storage.js";

export function initApp(container) {

  function draw() {
    render(container);
  }

  subscribe(draw);

  // initialize global UI behavior once
  initSidebarInteractions();
  sidebarCloseLogic();

  const plan = initPlan();

  if (!plan) {
    startWizard(container, (newPlan) => {
      setPlan(newPlan);   // emit() → draw()
    });
  } else {
    ensurePlanIntegrity(plan);
    if (evaluateStreak(plan)) {
      savePlan(plan);
    }
    draw();
  }

}