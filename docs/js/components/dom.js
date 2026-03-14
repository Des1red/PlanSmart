const SVG_TAGS = new Set([
  "svg","path","circle","rect","line","polyline","polygon","g","text"
]);
const SVG_NS = "http://www.w3.org/2000/svg";

export function el(tag, attrs = null, children = null) {

  /* ---------- FAST SVG CHECK ---------- */

  const isSVG = SVG_TAGS.has(tag);

  const node = isSVG
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag);

  /* ---------- ATTRIBUTES ---------- */

  if (attrs) {
    for (const k in attrs) {
      const v = attrs[k];

      if (k === "class") {
        if (isSVG) node.setAttribute("class", v);
        else node.className = v;
      }
      else if (k === "text") {
        node.textContent = v;
      }
      else if (k[0] === "o" && k[1] === "n") {
        node.addEventListener(k.slice(2), v);
      }
      else {
        node.setAttribute(k, v);
      }
    }
  }

  /* ---------- CHILDREN ---------- */

  if (children) {
    const frag = document.createDocumentFragment();

    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        frag.appendChild(children[i]);
      }
    } else {
      frag.appendChild(children);
    }

    node.appendChild(frag);
  }

  return node;
}