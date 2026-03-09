import { el } from "../components/dom.js";
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

  const typeSelect = el("select",  { class: "task-item" }, [
    el("option", { value: "daily", text: "Daily Task" }),
    el("option", { value: "monthly", text: "Monthly Task" })
  ]);

  const freqInput = el("input", {
    type: "number",
    placeholder: "Times per week",
    min: 1,
  });

   /* enforce monthly rule */
  typeSelect.addEventListener("change", () => {

    if (typeSelect.value === "monthly") {
      freqInput.value = 1;
      freqInput.disabled = true;
    } else {
      freqInput.disabled = false;
    }

  });
   const addButton = el("button", {
      text: "Add Task",
      onclick: () => {

        const name = nameInput.value.trim();
        const place = placeInput.value.trim();
        const time = Number(timeInput.value);
        const type = typeSelect.value;
        let freq =
               type === "monthly"
                 ? 1
                 : Number(freqInput.value);
        if (!name || !place || !time || !freq) {
          alert("Please fill all fields.");
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
        el("strong", { text: t.name }),
        el("span", { text: ` (${t.place}) ` }),
        el("span", { text: `${t.time}m ` }),
        el("span", { text: `[${t.type}] ` }),
        el("span", { text: `${t.timesPerWeek}/week ` }),
        editBtn,
        del
      ])
    );
  });

  container.appendChild(
      el("div",  { class: "task-item" }, [
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