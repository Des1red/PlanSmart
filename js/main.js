import { initApp } from "./bootstrap/init.js";

const app = document.getElementById("app");

initApp(app);

if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register("./sw.js")
    .then(reg => {

      reg.addEventListener("updatefound", () => {
        console.log("New version available");
      });

    });

}