import { setView } from "../../state/view.js";

export function navigate(view) {

  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  // First tap on mobile opens sidebar only
  if (!sidebar.classList.contains("open")) {
    sidebar.classList.add("open");
    return;
  }

  // Second tap navigates
  sidebar.classList.remove("open");
  setView(view);

}