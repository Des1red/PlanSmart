export function initSidebarInteractions() {

  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  sidebar.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") sidebar.classList.add("open");
  });

  sidebar.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") sidebar.classList.remove("open");
  });

  sidebar.addEventListener(
    "touchstart",
    (e) => {
      if (!sidebar.classList.contains("open")) {
        e.preventDefault();
        sidebar.classList.add("open");
      }
    },
    { passive: false }
  );

}