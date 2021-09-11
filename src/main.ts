import { createApp } from "vue";
import { WindowInterface } from "./window";
import http from "./http";
import App from "./App.vue";

declare const window: WindowInterface;
const app = createApp(App);

if (!localStorage.getItem("user")) {
  /*
   * geração randômica de strings
   * ref: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
   */
  const user = (Math.random() + 1).toString(36).substr(5);
  localStorage.setItem("user", user);
}

(async () => {
  try {
    const video = await http.get("/api/video@getAll").then(
      ({
        data: {
          result: [video],
        },
      }) => video
    );

    window.videoId = video.id;

  } catch (err) {
    // caso falhe, temos um video de fallback
    window.videoId = "12345";
    console.trace(err);

  } finally {
    window.login = localStorage.getItem('user') || 'undef'
    app.mount("#app");
  }
})();

