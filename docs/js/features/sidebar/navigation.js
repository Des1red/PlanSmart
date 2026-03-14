import { setView } from "../../state/view.js";
import { setshouldScrollToToday } from "../../state/sidebar.js";

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
  if (view === "calendar") setshouldScrollToToday(true);
  setView(view);
}