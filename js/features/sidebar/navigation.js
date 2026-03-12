import { setView } from "../../state/view.js";

export function navigate(view) {

  const sidebar = document.getElementById("sidebar");

  if (!sidebar.classList.contains("open")) return;

  sidebar.classList.remove("open");

  setTimeout(() => setView(view), 0);

}