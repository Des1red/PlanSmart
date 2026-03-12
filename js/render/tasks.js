import { el } from "../components/dom.js";
import { uiAlert } from "../components/ui.js";
import { getPlan } from "../state/plan.js";
import { createTask, deleteTask, editTask } from "../features/tasks/tasks.js";


export function renderTaskManager(container) {

  const plan = getPlan();

  container.innerHTML = "";
  let editingId = null;
  const nameInput = el("input", {  type: "text", placeholder: "Task name" });
  const placeInput = el("input", {  type: "text", placeholder: "Place" });

  const timeInput = el("input", {
    type: "number",
    placeholder: "Estimated minutes",
    min: 1
  });

  const typeSelect = el("select", { class: "task-type-select" }, [
    el("option", { value: "daily",   text: "⟳  Daily"   }),
    el("option", { value: "weekly",  text: "◈  Weekly"  }),
    el("option", { value: "monthly", text: "◉  Monthly" }),
  ]);

  const freqInput = el("input", {
    type: "number",
    placeholder: "Times per week",
    min: 1,
    max: 7
  });

   /* enforce monthly/weekly rule */
   typeSelect.addEventListener("change", () => {
   
     if (typeSelect.value === "daily") {
       freqInput.value = 7;
       freqInput.disabled = true;
     }
     else if (typeSelect.value === "monthly") {
       freqInput.value = 1;
       freqInput.disabled = true;
     }
     else {
       freqInput.disabled = false;
     
       if (!freqInput.value || freqInput.value > 7) {
         freqInput.value = 1;
       }
     }
   
   });
   const addButton = el("button", {
      text: "Add Task",
      onclick: () => {

        const name = nameInput.value.trim();
        const place = placeInput.value.trim();
        const time = Number(timeInput.value);
        const maxMinutes = plan.hoursPerDay * 60;

        if (time > maxMinutes) {
          uiAlert(`Task exceeds daily limit (${maxMinutes} minutes). Increase daily hours or reduce task time.`);
          return;
        }
        const type = typeSelect.value;
        let freq;

        if (type === "daily") freq = 7;
        else if (type === "monthly") freq = 1;
        else freq = Number(freqInput.value);

        if (!name || !place || !time || !freq) {
          uiAlert("Please fill all fields.");
          return;
        }

        const data = {
          name,
          place,
          time,
          type,
          timesPerWeek: freq
        };

        if (editingId !== null) {
          editTask(editingId, data);
          editingId = null;
          addButton.textContent = "Add Task";
        } else {
          createTask(data);
        }

      }
    });
    
  const list = el("div");
  plan.tasks.forEach((t) => {

    const del = el("button", {
      text: "Delete",
      onclick: () => {
        deleteTask(t.id);
      }
    });
    const editBtn = el("button", {
      text: "Edit",
      onclick: () => {

        nameInput.value = t.name;
        placeInput.value = t.place;
        timeInput.value = t.time;
        typeSelect.value = t.type;
        freqInput.value = t.timesPerWeek;
        /* enforce monthly rule on edit */
        if (t.type === "monthly") {
          freqInput.disabled = true;
        } else {
          freqInput.disabled = false;
        }
        editingId = t.id;

        addButton.textContent = "Update Task";
      }
    });
    list.appendChild(
      el("div", { class: "task-item" }, [
      
        el("div", { class: "task-meta" }, [
          el("strong", { text: t.name }),
          el("span", { text: `(${t.place})` }),
          el("span", { text: `${t.time}m` }),
           el("span", {
              text:
                t.type === "daily"
                  ? "daily"
                  : t.type === "monthly"
                  ? "monthly"
                  : `${t.timesPerWeek}/week`
            })
        ]),
      
        el("div", { class: "task-actions" }, [
          editBtn,
          del
        ])
      
      ])
    );
  });

  container.appendChild(
     el("div", { class: "card" }, [
      el("h2", { text: "Tasks" }),

      el("div", { class: "form-grid" }, [
        nameInput,
        placeInput,
        timeInput,
        typeSelect,
        freqInput
      ]),
    
      el("div", { class: "form-actions" }, [
        addButton
      ]),
    
      el("hr"),
      list
    ])
  );

}