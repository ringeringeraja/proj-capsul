<template>
  <div class="logger">
    <div class="logger__close" @click="$emit('close')">Fechar</div>
    <div class="logger__user">Seu nome de usuário agora é: {{ user }}</div>
    <ul class="logger__list">
      <li :class="{ active: !!isVideoVisible }">Vídeo visível na tela</li>
      <li
        :class="{
          active: true,
          hidden: !isVideoPlaying || !hasVideoStartedAlready,
        }"
      >
        Retomando de onde o usuário parou
      </li>
      <li :class="{ active: !!isVideoPlaying }">
        Usuário iniciou o vídeo ({{ time }}% assistidos)
        <a
          :class="{ button: true, hidden: !isVideoPlaying || hasUserAdvanced }"
          @click="advanceVideo"
          >ir para o final</a
        >
      </li>
      <li :class="{ active: !!hasVideoEnded }">Vídeo acabou</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  computed: {
    time() {
      return Math.floor(this.percent * 100);
    },
    user() {
      return localStorage.getItem("user");
    },
  },
})
export default class CLogger extends Vue {
  seconds = 0;
  percent = 0;
  duration = 0;

  isVideoVisible = false;
  isVideoPlaying = false;
  hasVideoEnded = false;
  hasUserAdvanced = false;
  hasVideoStartedAlready = false;

  updateTime(props: {
    seconds: number;
    percent: number;
    duration: number;
  }): void {
    this.seconds = props.seconds;
    this.percent = props.percent;
    this.duration = props.duration;
  }

  advanceVideo(): void {
    this.$emit("advance");
    this.hasUserAdvanced = true;
  }
}
</script>

<style scoped src="./Logger.css"></style>
