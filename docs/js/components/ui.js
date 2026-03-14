import { el } from "./dom.js";

export function uiPrompt(message, defaultValue = "") {

  return new Promise(resolve => {

    const overlay = el("div", { class: "alert-overlay" });

    const input = el("input", {
      type: "number",
      value: defaultValue,
      min: 1,
      max: 24
    });

    const modal = el("div", { class: "alert-modal" }, [

      el("p", { text: message }),

      input,

      el("div", { class: "form-actions" }, [

        el("button", {
          class: "btn-ghost",
          text: "Cancel",
          onclick: () => {
            overlay.remove();
            resolve(null);
          }
        }),

        el("button", {
          text: "OK",
          onclick: () => {
            const val = input.value;
            overlay.remove();
            resolve(val);
          }
        })

      ])

    ]);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    input.focus();

  });

}

export function uiConfirm(message) {

  return new Promise(resolve => {

    const overlay = el("div", { class: "alert-overlay" });

    const modal = el("div", { class: "alert-modal" }, [

      el("p", { text: message }),

      el("div", { class: "form-actions" }, [

        el("button", {
          class: "btn-ghost",
          text: "Cancel",
          onclick: () => {
            overlay.remove();
            resolve(false);
          }
        }),

        el("button", {
          text: "Continue",
          onclick: () => {
            overlay.remove();
            resolve(true);
          }
        })

      ])

    ]);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

  });

}

export function uiAlert(message) {

  const overlay = el("div", { class: "alert-overlay" });

  const modal = el("div", { class: "alert-modal" }, [
    el("p", { text: message }),

    el("button", {
      text: "OK",
      onclick: () => overlay.remove()
    })
  ]);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}