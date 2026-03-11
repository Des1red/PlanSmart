import { el } from "../../components/dom.js";
import { getPlan } from "../../state/plan.js";
import { savePlan } from "../../storage/storage.js";
import { emit } from "../../state/events.js";

export function openDay(day, isToday) {

  const plan = getPlan();

  const overlay = el("div", { class: "calendar-overlay" });
  const modal = el("div", { class: "calendar-modal" });

  const closeBtn = el("button", {
    text: "Close",
    onclick: () => {
      overlay.remove()
       emit();
    }
  });

  const items = day.tasks.map(id => {
  const task = plan.tasks.find(t => t.id === id);

  if (!task) {
    return el("div", { text: "Unknown task" });
  }

  const checked = day.done && day.done.includes(id);

    return el("div", {
      class: checked
        ? "calendar-analytics task-done"
        : "calendar-analytics"
    },[

      el("label", { class: "calendar-check-row" }, [

      el("input", {
        type: "checkbox",
        ...(checked ? { checked: true } : {}),
        ...(isToday ? {} : { disabled: true }),
        onchange: (e) => {
          
            day.done = day.done || [];
          
            if (e.target.checked) {
              if (!day.done.includes(id)) {
                day.done.push(id);
              }
            } else {
              day.done = day.done.filter(t => t !== id);
            }
          
            const row = e.target.closest(".calendar-analytics");
          
            if (e.target.checked) {
              row.classList.add("task-done");
            } else {
              row.classList.remove("task-done");
            }
          
            savePlan(plan);
          }
        }),

        el("strong", { text: `${task.name} (${task.place})` })
      ]),

      el("div", { text: `Time: ${task.time} minutes` }),
      el("div", { text: `Type: ${task.type}` })

    ]);

  });

  modal.appendChild(
    el("h2", {
      text: isToday
        ? `Day ${day.day} (today)`
        : `Day ${day.day}`
    })
  );
  if (!isToday) {
  modal.appendChild(
    el("div", {
      class: "calendar-lock",
      text: "Tasks can only be completed on the current day."
    })
  );
}
  items.forEach(i => modal.appendChild(i));
  modal.appendChild(closeBtn);

  overlay.appendChild(modal);

  document.body.appendChild(overlay);

}