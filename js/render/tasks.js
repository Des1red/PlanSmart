import { el } from "../components/dom.js";
import { uiAlert } from "../components/ui.js";
import { getPlan } from "../state/plan.js";
import { createTask, deleteTask, editTask } from "../features/tasks/tasks.js";


export function renderTaskManager(container) {

  const plan = getPlan();

  container.innerHTML = "";

  const state = { editingId: null };

  const inputs = createInputs();
  setupTypeRules(inputs);

  const addButton = createAddButton(plan, inputs, state);

  const list = buildTaskList(plan, inputs, state, addButton);

  container.appendChild(
    buildLayout(inputs, addButton, list)
  );
}


/* ───────────────────────────── */
/* INPUT CREATION                */
/* ───────────────────────────── */

function createInputs() {

  const nameInput = el("input", { type: "text", placeholder: "Task name" });

  const placeInput = el("input", { type: "text", placeholder: "Place" });

  const timeInput = el("input", {
    type: "number",
    placeholder: "Estimated minutes",
    min: 1
  });

  const typeSelect = el("select", { class: "task-type-select" }, [
    el("option", { value: "daily", text: "⟳  Daily" }),
    el("option", { value: "weekly", text: "◈  Weekly" }),
    el("option", { value: "monthly", text: "◉  Monthly" }),
  ]);

  const freqInput = el("input", {
    type: "number",
    placeholder: "Times per week",
    min: 1,
    max: 7
  });

  return {
    nameInput,
    placeInput,
    timeInput,
    typeSelect,
    freqInput
  };
}


/* ───────────────────────────── */
/* TYPE RULES                    */
/* ───────────────────────────── */

function setupTypeRules(inputs) {

  const { typeSelect, freqInput } = inputs;

  function enforceTypeRule() {

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
    }
  }

  freqInput.addEventListener("blur", () => {

    let v = Number(freqInput.value);

    if (!v || v < 1) freqInput.value = 1;
    if (v > 7) freqInput.value = 7;

  });

  typeSelect.addEventListener("change", enforceTypeRule);

  enforceTypeRule();

  inputs.enforceTypeRule = enforceTypeRule;
}


/* ───────────────────────────── */
/* ADD / UPDATE BUTTON           */
/* ───────────────────────────── */

function createAddButton(plan, inputs, state) {

  const {
    nameInput,
    placeInput,
    timeInput,
    typeSelect,
    freqInput
  } = inputs;

  return el("button", {
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

      if (state.editingId !== null) {

        editTask(state.editingId, data);

        state.editingId = null;

        this.textContent = "Add Task";

      } else {

        createTask(data);

      }

    }
  });
}


/* ───────────────────────────── */
/* TASK LIST                     */
/* ───────────────────────────── */

function buildTaskList(plan, inputs, state, addButton) {

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

        inputs.nameInput.value = t.name;
        inputs.placeInput.value = t.place;
        inputs.timeInput.value = t.time;
        inputs.typeSelect.value = t.type;
        inputs.freqInput.value = t.timesPerWeek;

        inputs.enforceTypeRule();

        state.editingId = t.id;

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

  return list;
}


/* ───────────────────────────── */
/* LAYOUT                        */
/* ───────────────────────────── */

function buildLayout(inputs, addButton, list) {

  return el("div", { class: "card" }, [

    el("h2", { text: "Tasks" }),

    el("div", { class: "form-grid" }, [
      inputs.nameInput,
      inputs.placeInput,
      inputs.timeInput,
      inputs.typeSelect,
      inputs.freqInput
    ]),

    el("div", { class: "form-actions" }, [
      addButton
    ]),

    el("hr"),

    list

  ]);
}