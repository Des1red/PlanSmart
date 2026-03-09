export function sidebarCloseLogic() {

  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const blockWhenOpen = (e) => {

    if (!sidebar.classList.contains("open")) return;

    if (sidebar.contains(e.target)) return;

    sidebar.classList.remove("open");

    e.preventDefault();
    e.stopPropagation();

  };

  document.addEventListener("touchstart", blockWhenOpen, {
    capture: true,
    passive: false
  });

  document.addEventListener("click", blockWhenOpen, {
    capture: true
  });

}