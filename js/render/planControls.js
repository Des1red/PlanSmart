import { el } from "../components/dom.js";
import { exportPlan, importPlan, resetPlan, changeDailyHours } from "../features/plan/controls.js";

export function renderPlanControls(container) {

  const exportBtn = el("button", {
    text: "Export Plan",
    onclick: exportPlan
  });

  const importInput = el("input", {
    type: "file",
    accept: "application/json",
    style: "display:none",
    onchange: (e) => {
      const file = e.target.files[0];
      if (!file) return;
      importPlan(file);
    }
  });

  const importBtn = el("button", {
    text: "Import Plan",
    onclick: () => importInput.click()
  });

  const resetBtn = el("button", {
    text: "Reset Plan",
    onclick: resetPlan
  });

  const hoursBtn = el("button", {
    text: "Daily Hours",
    onclick: changeDailyHours
  });
  
  container.appendChild(
    el("div", { class: "plan-controls" }, [
      el("h3", { text: "Plan Controls" }),
    
      el("div", { class: "plan-controls-buttons" }, [
        exportBtn,
        importBtn,
        hoursBtn,
        importInput,
        resetBtn
      ])
    ])
  );

}