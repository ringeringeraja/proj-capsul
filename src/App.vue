<template>
  <div :class="{ app: true, 'app--full': !!isFullscreen }">
    <div class="app__disclaimer">
      <p class="app__disclaimer__p">
        Quisque quam posuere libero, ut faucibus ac, pretium augue potenti
        feugiat fames lectus. Interdum viverra, quam odio lacus lectus. Tortor
        lorem nisi, diam eu, commodo curae lectus pulvinar libero nec. Duis
        auctor volutpat, potenti libero ut molestie. Sollicitudin lacinia urna,
        taciti risus platea eros. Vestibulum diam tincidunt quam, quisque etiam
        phasellus fermentum donec. Mauris gravida quisque, etiam aliquam
        sollicitudin nunc dictumst. Integer massa primis consequat, tortor
        placerat ullamcorper egestas sapien. Risus porttitor praesent auctor,
        habitant nec primis, sociosqu nunc malesuada ullamcorper posuere purus
        euismod. Curae potenti, sit nullam class suspendisse. Vel et purus,
        curabitur porta erat quam pellentesque. Dui amet pellentesque quis,
        nullam sollicitudin orci, convallis lacus fermentum nulla justo lorem
        eros dapibus. Fames convallis taciti ut, tempus pulvinar aliquet vel
        nibh. Quisque ad bibendum, mauris ut nullam praesent nunc. Tempus
        elementum adipiscing, luctus et, consequat convallis curabitur bibendum
        nam accumsan augue. Egestas erat, platea est taciti. Neque nam nostra,
        ipsum commodo, laoreet molestie per volutpat elementum. Feugiat
        sollicitudin mi, suspendisse risus, felis habitasse curabitur molestie
        imperdiet donec cursus. Placerat hendrerit, habitasse sed per. Duis dui
        magna, cras ante, consectetur ultrices felis potenti auctor non
        adipiscing. Sed tempor, lacus fusce nulla. Ullamcorper fusce nulla
        senectus, duis mollis praesent, torquent etiam tellus proin pulvinar
        consequat a convallis. Ornare purus consequat congue, sollicitudin porta
        dictum, viverra himenaeos semper sed sagittis sodales et felis. Nostra
        rhoncus blandit, molestie quis, faucibus neque lectus massa iaculis
        quisque gravida. Rutrum suspendisse odio, dolor laoreet, urna
        ullamcorper scelerisque malesuada netus augue cubilia. Consequat leo
        tellus sapien, aliquam sollicitudin id, ut libero primis dictum congue
        bibendum. Aliquet quisque ligula, sapien rutrum, porttitor praesent et
        augue vehicula integer. Odio nunc, massa sollicitudin nulla. Senectus
        turpis hac, nullam vehicula potenti sollicitudin. Nisl nostra volutpat,
        tempor gravida ornare velit. Bibendum euismod platea, arcu blandit
        elementum augue. Aliquam tempor tincidunt platea, eros auctor mattis,
        sed velit ut sodales pharetra viverra aenean.
      </p>

      <c-player
        class="app__disclaimer__video"
        ref="videoPlayer"
        :options="{
          id: videoId,
          controls: true,
          portrait: false,
          byline: false,
          title: false,
          height: 400,
        }"
        @play="onVideoPlayed"
        @ended="onVideoEnded"
        @timeupdate="onTimeUpdate"
      />

      <p class="app__disclaimer__p app__disclaimer__p--last">
        Assista ao depoimento e tire as suas próprias conclusões.
      </p>
    </div>

    <transition name="logger" mode="out-in">
      <c-logger
        class="app__logger"
        v-show="!isFullscreen"
        ref="logger"
        @advance="advanceVideo"
        @close="isFullscreen = true"
      />
    </transition>

    <transition name="logger">
      <c-slip v-if="!!isFullscreen" @click="isFullscreen = false" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { DefineComponent } from "vue";
import { WindowInterface } from "./window";
import http from "@/http";

import CPlayer from "./components/Player.vue";
import CLogger from "./components/Logger.vue";
import CSlip from "./components/Slip.vue";

declare const window: Window & WindowInterface;

@Options({
  components: {
    CPlayer,
    CLogger,
    CSlip,
  },

  computed: {
    videoId() {
      return window.videoId;
    },
  },
})
export default class App extends Vue {
  videoPlayer: DefineComponent;
  logger: DefineComponent;

  isFullscreen = false;

  async mounted(): Promise<void> {
    this.videoPlayer = this.$refs.videoPlayer as DefineComponent;
    this.logger = this.$refs.logger as DefineComponent;

    window.addEventListener("scroll", () => {
      this.logger.isVideoVisible = this.videoPlayer.isVisible();
    });

    window.addEventListener("beforeunload", async () => {
      const seconds = await window._vp.getCurrentTime();
      localStorage.setItem("seconds", seconds);

      await http.post("/api/user@updateVideo", {
        login: window.login,
        videoId: window.videoId,
        mark: seconds,
      });

      return "";
    });

    // typescript quer que funções assincronas sempre resolvam
    return Promise.resolve();
  }

  onVideoPlayed(): void {
    this.logger.isVideoPlaying = true;
    window.scrollY;
  }

  onVideoEnded(): void {
    this.logger.hasVideoEnded = true;
  }

  onTimeUpdate(props: any): void {
    this.logger.updateTime(props);
  }

  async advanceVideo(): Promise<void> {
    window._vp.setCurrentTime((await window._vp.getDuration()) - 5);
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap");

body,
html {
  margin: 0;
  padding: 0;
  width: 100%;

  overflow-x: hidden;
}

html {
  scroll-behavior: smooth;
}

body {
  --logger-bg-color: #efefef;
  --logger-shadow: 2px 2px 12px #666;
}
</style>

<style scoped src="./App.css"></style>
