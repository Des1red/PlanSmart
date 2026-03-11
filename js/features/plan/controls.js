import { getPlan, setPlan } from "../../state/plan.js";
import { el } from "../../components/dom.js";

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
      const plan = JSON.parse(reader.result);
      ensurePlanIntegrity(plan);
      setPlan(plan);
    } catch {
      alert("Invalid plan file");
    }

  };

  reader.readAsText(file);
}

export function resetPlan() {

  if (!confirm("Delete your cleaning plan?")) return;

  localStorage.removeItem("cleaning_plan");

  location.reload();
}