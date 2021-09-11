<template>
  <div id="player" class="player" ref="player"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PropType } from "vue";
import VimeoPlayer from "@vimeo/player";

import { OptionsInterface, PlayerInterface } from "./Player.types";
import { WindowInterface } from "@/window";
import http from "@/http";

declare const window: Window & WindowInterface;

@Options({
  props: {
    options: {
      type: Object as PropType<OptionsInterface>,
      validator: (options: OptionsInterface) => !!options.id,
    },
  },
})
export default class CPlayer extends Vue implements PlayerInterface {
  options: OptionsInterface;

  async mounted(): Promise<void> {
    const vimeoPlayer = new VimeoPlayer("player", this.options);

    vimeoPlayer.on("play", () => {
      this.$emit("play");
      this.onVideoPlayed();
    });

    vimeoPlayer.on("ended", () => {
      this.$emit("ended");
      this.onVideoEnded();
    });

    vimeoPlayer.on("timeupdate", (props: any) => {
      this.$emit("timeupdate", props);
      this.onTimeUpdate(props);
    });

    const seconds = Number(localStorage.getItem("seconds"));
    if (seconds && seconds < (await vimeoPlayer.getDuration()) - 1) {
      vimeoPlayer.setCurrentTime(seconds);
    }

    // para depuração
    eval(" window._vp = vimeoPlayer ");

    // queremos que o video seja explicitamente iniciado
    if (!(await vimeoPlayer.getPlayed())?.length || 0 < 1) {
      await vimeoPlayer.pause();
    }
  }

  isVisible(): boolean {
    if (!window._vp) {
      return false;
    }

    const rect = window._vp.element.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  }

  onVideoPlayed(): void {
    http.post("/api/user@updateVideo", {
      login: window.login,
      videoId: window.videoId,
    });

    window.scrollTo(0, document.documentElement.scrollHeight);
  }

  onVideoEnded(): void {
    http.post("/api/user@updateVideo", {
      login: window.login,
      videoId: window.videoId,
      status: "complete",
    });
  }

  onTimeUpdate(props: any): void {
    //
  }
}
</script>

<style scoped src="./Player.css"></style>
