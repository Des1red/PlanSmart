import { el } from "../../components/dom.js";
import { getPlan } from "../../state/plan.js";

export function openDay(day) {

  const plan = getPlan();

  const overlay = el("div", { class: "calendar-overlay" });
  const modal = el("div", { class: "calendar-modal" });

  const closeBtn = el("button", {
    text: "Close",
    onclick: () => overlay.remove()
  });

  const items = day.tasks.map(id => {

    const task = plan.tasks.find(t => t.id === id);

    if (!task) {
      return el("div", { text: "Unknown task" });
    }

    return el("div", { class: "calendar-analytics" }, [
      el("strong", { text: `${task.name} (${task.place})` }),
      el("div", { text: `Time: ${task.time} minutes` }),
      el("div", { text: `Type: ${task.type}` })
    ]);

  });

  modal.appendChild(
    el("h2", { text: `Day ${day.day}` })
  );

  items.forEach(i => modal.appendChild(i));
  modal.appendChild(closeBtn);

  overlay.appendChild(modal);

  document.body.appendChild(overlay);

}