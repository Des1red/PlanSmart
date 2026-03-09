import { el } from "../components/dom.js";
import { getRoutes } from "../state/routes.js";
import * as icons from "../components/icons.js";
import { navigate } from "../features/sidebar/navigation.js";

const ROUTE_ICONS = {
  plan: icons.iconPlan,
  calendar: icons.iconCalendar
};

export function renderSidebar() {

  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = "";

  sidebar.appendChild(
    el("div", { class: "sidebar-title", text: "PlanSmart" })
  );

  const routes = getRoutes();

  routes.forEach((route) => {

    const iconFn = ROUTE_ICONS[route.key];
    const icon = iconFn ? iconFn(18) : null;

    sidebar.appendChild(
      el(
        "button",
        {
          class: "sidebar-item",
          onclick: () => navigate(route.key)
        },
        [
          icon,
          el("span", { text: route.label })
        ]
      )
    );

  });
  sidebar.appendChild(createThemeToggle());
}

function createThemeToggle() {
  // Read persisted preference, fall back to system preference
  const stored = localStorage.getItem("plansmart-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = stored ? stored === "dark" : prefersDark;

  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

  const checkbox = el("input", { type: "checkbox" });
  checkbox.checked = isDark;

  const track = el("span", { class: "toggle-track" });

  const switchWrap = el("label", { class: "toggle-switch" });
  switchWrap.appendChild(checkbox);
  switchWrap.appendChild(track);

  const label = el("span", { text: isDark ? "Dark" : "Light" });

  checkbox.addEventListener("change", () => {
    const dark = checkbox.checked;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("plansmart-theme", dark ? "dark" : "light");
    label.textContent = dark ? "Dark" : "Light";
  });

  const wrapper = el("div", { class: "theme-toggle" });
  wrapper.appendChild(label);
  wrapper.appendChild(switchWrap);
  return wrapper;
}