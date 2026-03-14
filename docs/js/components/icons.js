import { el } from "./dom.js";

export function iconCalendar(size = 18) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");

  svg.innerHTML = `
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="8" y1="3" x2="8" y2="7"/>
    <line x1="16" y1="3" x2="16" y2="7"/>
  `;

  return svg;
}

export function iconPlan(size = 18) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");

  svg.innerHTML = `
    <line x1="9" y1="6" x2="21" y2="6"/>
    <line x1="9" y1="12" x2="21" y2="12"/>
    <line x1="9" y1="18" x2="21" y2="18"/>
    <circle cx="5" cy="6" r="2"/>
    <circle cx="5" cy="12" r="2"/>
    <circle cx="5" cy="18" r="2"/>
  `;

  return svg;
}

export function iconSidebarHint(size = 24) {
  return el("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2.2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, [
    // sidebar panel
    el("rect", {
      x: "3",
      y: "4",
      width: "6",
      height: "16",
      rx: "1.5"
    }),

    // arrow pointing right
    el("polyline", {
      points: "11 7 16 12 11 17"
    })
  ]);
}

export function iconUsers(size = 18) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");

  svg.innerHTML = `
    <circle cx="9" cy="8" r="3"/>
    <circle cx="17" cy="10" r="2.5"/>
    <path d="M3 20c0-3 3-5 6-5s6 2 6 5"/>
    <path d="M14 20c.3-2 2-3.5 4-3.5 1.7 0 3 1 3 2.5"/>
  `;

  return svg;
}