import { createApp } from "vue";
import { WindowInterface } from "./window";
import http from "./http";
import App from "./App.vue";

declare const window: WindowInterface;
const app = createApp(App);

if (!localStorage.getItem("login")) {
  /*
   * geração randômica de strings
   * ref: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
   */
  const login = (Math.random() + 1).toString(36).substr(5);
  localStorage.setItem("login", login);
}

window.login = localStorage.getItem("login") || "undef";

(async () => {
  try {
    const video = await http
      .post("/api/user@getVideo", { login: window.login })
      .then(({ data }) => data.result);
    window.videoId = video.id;
  } catch (err) {
    // caso falhe, temos um video de fallback
    window.videoId = "12345";
    console.trace(err);
  } finally {
    app.mount("#app");
  }
})();
