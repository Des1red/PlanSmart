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

      // ignore taps on navigation items
      if (e.target.closest(".sidebar-item")) return;

      // open sidebar when tapping edge/background
      if (!sidebar.classList.contains("open")) {
        e.preventDefault();
        sidebar.classList.add("open");
      }

    },
    { passive: false }
  );

  /* overlay click → close sidebar */
  const overlay = document.getElementById("sidebar-overlay");

  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

}