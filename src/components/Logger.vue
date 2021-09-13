<template>
  <div class="logger">
    <div class="logger__close" @click="$emit('close')">Fechar</div>
    <div class="logger__user">
      Seu nome de usuário agora é: {{ login }}
      <a class="button" @click="logout">sair</a>
    </div>
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
      <li :class="{ active: !!hasVideoEnded }">
        Dados da API
        <a
          :class="{ button: true, hidden: !hasVideoEnded || !!showApi }"
          @click="getUsers"
          >obter</a
        >
      </li>
    </ul>
    <div class="logger__api" v-if="!!showApi">
      <header class="logger__api__header">/api/user@getAll</header>
      <div class="logger__api__users">
        <div
          class="logger__api__user"
          v-for="(user, index) in users"
          :key="`user-${index}`"
        >
          <div class="user__name">ID: {{ user.login }}</div>
          <div class="user__status">
            status: {{ user.viewedVideos[0]?.status || "undef" }}
          </div>
          <div class="user__mark">
            mark: {{ user.viewedVideos[0]?.mark || "0" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import http from "@/http";

@Options({
  computed: {
    time() {
      return Math.floor(this.percent * 100);
    },
    login() {
      return localStorage.getItem("login");
    },
  },
})
export default class CLogger extends Vue {
  users: any = [];

  seconds = 0;
  percent = 0;
  duration = 0;

  isVideoVisible = false;
  isVideoPlaying = false;
  hasVideoEnded = false;
  hasUserAdvanced = false;
  hasVideoStartedAlready = false;
  showApi = false;

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

  logout(): void {
    localStorage.removeItem("login");
    window.location.reload();
  }

  getUsers(): void {
    http.get("/api/user@getAll").then(({ data }) => {
      this.users = data.result;
      this.showApi = true;
    });
  }
}
</script>

<style scoped src="./Logger.css"></style>
