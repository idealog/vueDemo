<template>
    <div>
        <div class="bg"></div>
        <div class="title">
            <p>开启智慧台灯</p>
            <div>
                <img :src="lampIcon" alt="灯泡"><span>科学保护你的眼睛</span>
            </div>
        </div>
        <div @click="toggle" class="switch-box">
            <div class="inner-box">                
            </div>
              <div>
                <img v-if="this.status" class="inner-bg-box" :src="toggleIcon1" alt="开">
                <img v-else class="inner-bg-box" :src="toggleIcon0" alt="关">
              </div>            
        </div>
    </div/>
</template>
<script>
import { api } from "@/service/util/api";

export default {
  data() {
    return {
      lampIcon: require("@/assets/img/lamp.png"),
      toggleIcon0: require("@/assets/img/toggle0.png"),
      toggleIcon1: require("@/assets/img/toggle1.png")
    };
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    },

    status() {
      return this.$store.state.light_status;
    }
  },

  mounted() {
    console.log("this.$route.query.openid", this.$route.query.openid);
    this.websocket.init(this.$route.query.openid);
    this.$store.commit("CHANGE_OPENID", this.$route.query.openid);
    this.$parent.activeItemId = -1; //初始化 最初激活的tab
  },

  methods: {
    toggle() {
      this.$store.commit("CHANGE_LIGHT_STATUS", 1 - this.status);

      if (!this.status) {
        this.$store.commit("CHANGE_LIGHTNESS", 0);
        this.$store.commit("CHANGE_RA", { start: 0, end: 0 });
      }

      console.log("this.status", this.status);

      this.websocket.sendMessage({
        action: "device_ctrl",
        ctrl_type: 1,
        led: this.status.toString()
      }); // 与设备链接
    }
  }
};
</script>

<style scoped>
.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(183, 231, 243, 0.9);
  z-index: -1;
}

.title p {
  color: white;
  font-size: 2rem;
  padding: 3rem 3rem 0 3rem;
  letter-spacing: 0.05rem;
}

.title div {
  color: white;
  font-size: 2rem;
  padding: 0 2rem 0 3rem;
}

.title div > img {
  width: 3.7rem;
}

.title div > span {
  letter-spacing: 0.05rem;
}

.switch-box {
  position: relative;
  overflow: hidden;
  width: 33vw;
  height: 33vw;
  margin: 0 auto;
  margin-top: 40vh;
  background: transparent;
  /* border: 1px dashed rgba(46, 176, 238); */
  box-sizing: border-box;
}

.inner-bg-box {
  position: absolute;
  box-sizing: border-box;
  width: 35vw;
  height: 35vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>