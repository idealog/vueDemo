<template>
  <div>
    <div class="container">
      <div class="header"></div>
      <div class="content">
        <div @click="playSong(item)" class="song" v-for="(item, index) in songList" :key="index">
          <div :class="{pause: item.song_name == playingSong.song_name, play: !(item.song_name == playingSong.song_name)}"></div>
          <div class="info">
            <div class="name">{{item.song_name}}</div>
            <div class="time">{{secondToMin(item.duration)}}</div>
          </div>
          <div class="del"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/service/util/api";
import { secondToMin } from "@/service/util/mUtils";

export default {
  data() {
    return {
      songList: [],
      secondToMin
    };
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    },

    playingSong() {
      return this.$store.state.playing_song;
    }
  },

  mounted() {
    this.websocket.init(this.openid);
    this.getList();
  },

  methods: {
    getList() {
      api(
        "music/local/list",
        {
          openid: this.openid,
          category: 0
        },
        "GET"
      ).then(r => {
        this.songList = r.data.data;
      });
    },

    playSong(song) {
      let play_ctrl;

      if (this.playingSong.song_name == song.song_name) {
        this.$store.commit("CHANGE_PLAYING_SONG", {});
        play_ctrl = "pause";
      } else {
        this.$store.commit("CHANGE_PLAYING_SONG", song);
        play_ctrl = "play";
      }

      const song_id = song.id.toString();
      const song_name = song.song_title;
      const song_url = song.song_url;
      const category = song.category;
      const source = 1;
      const action = "device_play";
      const duration = song.duration;
      const data = {
        song_id,
        song_name,
        song_url,
        category,
        source,
        action,
        play_ctrl,
        duration
      };
      this.websocket.sendMessage(data);
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 96vh;
}

.header {
  min-height: 15rem;
  background-image: url(../../../../assets/img/co-bg.jpg);
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 1rem;
}

.content {
  overflow: auto;
  height: 64vh;
}

.song {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.pause,
.play {
  flex-basis: 15%;
}

.info {
  font-size: 1.2rem;
}

.info .name {
  font-size: 1.5rem;
  color: #333;
  padding-bottom: 0.4rem;
}

.info .time {
  font-size: 1.1rem;
  padding-left: 0.2rem;
  opacity: 0.7;
}

.player {
  position: absolute;
  /* width: 100%; */
  left: 0;
  right: 0;
  bottom: 5%;
}
</style>