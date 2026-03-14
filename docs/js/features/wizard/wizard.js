import { el } from "../../components/dom.js";
import { uiAlert } from "../../components/ui.js";

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
    
      if (!hours || hours <= 0 || hours > 24) {
        uiAlert("Please enter valid hours (1–24).");
        return;
      }
    
      const plan = {
        version: 1,
        hoursPerDay: hours,
        tasks: [],
        calendar: null
      };
    
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