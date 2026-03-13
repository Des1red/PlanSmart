import { setView } from "../../state/view.js";

export function navigate(view) {

  const sidebar = document.getElementById("sidebar");

  if (sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
  }

  setView(view);

}