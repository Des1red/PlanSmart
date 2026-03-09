import { el } from "../components/dom.js";
import { getPlan } from "../state/plan.js";
import { openDay } from "../features/calendar/calendar.js";

export function renderCalendar(container) {

  const plan = getPlan();

  container.innerHTML = "";

  if (!plan.calendar || !plan.calendar.days || plan.calendar.days.length === 0) {
    container.appendChild(
      el("p", { text: "No calendar generated yet." })
    );
    return;
  }
  container.appendChild(
    el("h2", {
      class: "calendar-month",
      text: `${plan.calendar.month} ${plan.calendar.year}`
    })
  );
  const grid = el("div", { class: "calendar-grid" });

  for (let w = 0; w < plan.calendar.weeks; w++) {

    const weekDays = plan.calendar.days.slice(w * 7, w * 7 + 7);

    const weekBlock = el("div", { class: "calendar-week" }, [
      el("h2", { text: `Week ${w + 1}` })
    ]);

    weekDays.forEach(day => {

      const items = day.tasks.map(id => {

        const task = plan.tasks.find(t => t.id === id);

        return el("div", {
          class: "calendar-day-task",
          text: task ? `${task.name} (${task.place})` : "Unknown task"
        });

      });

      weekBlock.appendChild(
        el("div", {
          class: "calendar-day",
          onclick: () => openDay(day)
        }, [
          el("h3", { text: `Day ${day.day}` }),
          ...items
        ])
      );

    });

    grid.appendChild(weekBlock);
  }

  container.appendChild(grid);

}