import { getPlan, setPlan  } from "../../state/plan.js";
import { el } from "../../components/dom.js";
import { uiAlert, uiConfirm, uiPrompt } from "../../components/ui.js";
export function exportPlan() {

  const plan = getPlan();

  const blob = new Blob(
    [JSON.stringify(plan, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = el("a", {
    href: url,
    download: "plan-smart.json"
  });

  a.click();

  URL.revokeObjectURL(url);
}

export function importPlan(file) {

  const reader = new FileReader();

  reader.onload = () => {

    try {

      const parsed = JSON.parse(reader.result);

      if (!parsed || typeof parsed !== "object") {
        uiAlert("Invalid plan file.");
        return;
      }

      if (!Array.isArray(parsed.tasks)) {
        uiAlert("This file is not a valid PlanSmart export.");
        return;
      }

      setPlan(parsed);

    } catch {
      uiAlert("Invalid plan file.");
    }

  };

  reader.readAsText(file);
}

export async function resetPlan() {
  const proceed = await uiConfirm("Delete your cleaning plan?");
  if (!proceed) return;
  localStorage.removeItem("cleaning_plan");
  location.reload();
}

export async function changeDailyHours() {
  const plan = getPlan();
  const current = plan.hoursPerDay || 2;

  let longest = 0;
  for (const t of plan.tasks) {
    if (t.time > longest) longest = t.time;
  }
  const longestHours = (longest / 60).toFixed(2);

  const input = await uiPrompt(
    `Daily cleaning hours (current: ${current})\nLongest task requires ${longest} minutes (~${longestHours} hours).`,
    current
  );
  if (!input) return;

  const hours = Number(input);
  if (!hours || hours <= 0 || hours > 24) {
    uiAlert("Please enter a valid number between 1 and 24.");
    return;
  }

  const capacityMinutes = hours * 60;
  if (longest > capacityMinutes) {
    const proceed = await uiConfirm(
      `Your longest task takes ${longest} minutes.\nWith ${hours} hours/day (${capacityMinutes} minutes) it will exceed the daily limit.\nContinue anyway?`
    );
    if (!proceed) return;
  }

  setPlan({ ...plan, hoursPerDay: hours });
}