import { savePlan } from "../../storage/storage.js";
import { el } from "../../components/dom.js";

export function startWizard(container, onComplete) {

  container.innerHTML = "";

  const input = el("input", {
    type: "number",
    min: 1,
    placeholder: "Hours per day"
  });
  const button = el("button", {
    text: "Create Plan",
    onclick: () => {
  
      const hours = Number(input.value);
  
      if (!hours || hours < 1) {
        alert("Please enter at least 1 hour.");
        return;
      }
  
      const plan = {
        version: 1,
        hoursPerDay: hours,
        tasks: [],
        calendar: []
      };
  
      savePlan(plan);
      onComplete(plan);
    }
  });

  container.appendChild(
    el("div",  { class: "card wizard" }, [
      el("h2", { text: "Cleaning Plan Setup" }),
      el("p", { text: "How many hours per day can you clean?" }),
      input,
      button
    ])
  );

}