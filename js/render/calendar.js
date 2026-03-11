import { el } from "../components/dom.js";
import { getPlan } from "../state/plan.js";
import { openDay } from "../features/calendar/calendar.js";

export function renderCalendar(container) {

  const plan = getPlan();

  container.innerHTML = "";
  const today = plan.calendar.today;
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
  container.appendChild(
    el("div", {
      class: "calendar-streak",
      text: `🔥 Streak: ${plan.streak?.current || 0} days`
    })
  );
  const grid = el("div", { class: "calendar-grid" });

  for (let w = 0; w < plan.calendar.weeks; w++) {

    const weekDays = plan.calendar.days.slice(w * 7, w * 7 + 7);

    const weekBlock = el("div", { class: "calendar-week" }, [
      el("h2", { text: `Week ${w + 1}` })
    ]);

    weekDays.forEach(day => {
      const isToday = day.day === today;
      const done = day.done ? day.done.length : 0;
      const total = day.tasks.length;

      const items = day.tasks.map(id => {

        const task = plan.tasks.find(t => t.id === id);

        return el("div", {
          class: "calendar-day-task",
          text: task ? `${task.name} (${task.place})` : "Unknown task"
        });

      });

      weekBlock.appendChild(
        el("div", {
          class: [
            "calendar-day",
            done === total && total > 0 ? "calendar-day-complete" : "",
            isToday ? "calendar-day-today" : ""
          ].join(" "),
          onclick: () => openDay(day, isToday)
        }, [
          el("h3", {
            text: isToday
              ? `Day ${day.day} (today)`
              : `Day ${day.day}`
          }),

          el("div", {
            class: "calendar-progress",
            text: `${done} / ${total} done`
          }),

          ...items
        ])
      );

    });

    grid.appendChild(weekBlock);
  }

  container.appendChild(grid);
  const todayWeek = Math.floor((today - 1) / 7);
  const weeks = grid.querySelectorAll(".calendar-week");

  if (weeks[todayWeek]) {
    weeks[todayWeek].scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}