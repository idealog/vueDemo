<template>
  <div>
    <div @click="hide" class="container">
      <router-link class="header" to="/lamp/mine">
        <div class="avatar">
          <img :src="avatar" alt="头像">
        </div>
        <div class="username">智能护眼台灯</div>
        <div class="online">{{this.deviceId ? "设备在线" : "设备离线"}}</div>
      </router-link>
      <div class="content">
        <div 
          @click.stop="setting(item)"
          class="setting-item"
          v-for="(item, index) in settingList" 
          :key="index">
          <div class="setting-icon">
            <img :src="item.icon" :alt="item.name">
          </div>
          <div class="setting-name">{{item.name}}</div>
        </div>
      </div>

      <!-- 二维码 -->
      <div 
        @click.stop 
        v-if="this.qrcode" 
        class="qrcode">
        <qrcode-vue :value="qrcode" size="150" level="M"></qrcode-vue>
      </div>
      
      <!-- 音量 -->
      <div 
        v-if="this.showVolume" 
        @click.stop 
        class="volume">
        <img src="../../../../assets/img/volume2.png" alt="音量调整">
        <div class="slider">
          <el-slider @change="change" v-model="volumeRange"></el-slider>
        </div>
        <span class="value">{{volumeRange}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/service/util/api";
import { configWXDevice } from "@/service/util/wx_config";

import wx from "weixin-js-sdk";
import QrcodeVue from "qrcode.vue";

export default {
  components: { QrcodeVue },

  data() {
    return {
      settingList: [
        // {
        //   id: 0,
        //   name: "萌宝说",
        //   icon: require("@/assets/img/talk.png")
        // },
        {
          name: "收藏",
          icon: require("@/assets/img/collection.png")
        },
        {
          name: "家庭成员",
          icon: require("@/assets/img/family.png")
        },
        {
          name: "童锁",
          icon: require("@/assets/img/lock-off.png"),
          icon1: require("@/assets/img/lock-on.png")
          // status: false
        },
        {
          name: "分享设备",
          icon: require("@/assets/img/share.png")
        },
        {
          name: "音量调整",
          icon: require("@/assets/img/volume.png")
        },
        {
          name: "恢复出厂设置",
          icon: require("@/assets/img/reset.png")
        }
      ],

      avatar: require("@/assets/img/avatar.png"),
      qrcode: "",
      volumeRange: this.myVolume,
      showVolume: false
    };
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    },

    myVolume() {
      return this.$store.state.volume;
    },

    childlock() {
      return this.$store.state.childlock;
    },

    deviceId() {
      return this.$store.state.device_id;
    }
  },

  beforeMount() {
    this.initLock();
  },

  mounted() {
    this.websocket.init(this.openid);

    this.url = location.href.split("#")[0];
  },

  methods: {
    setting(item) {
      switch (item.name) {
        case "萌宝说":
          this.talk();
          break;
        case "收藏":
          this.collection();
          break;
        case "家庭成员":
          this.family();
          break;
        case "童锁":
          this.lock(item);
          break;
        case "分享设备":
          this.share();
          break;
        case "音量调整":
          this.volume();
          break;
        case "恢复出厂设置":
          this.reset();
          break;
        default:
          break;
      }
    },

    talk() {
      this.$router.push({ path: "/lamp/talk" });
    },

    collection() {
      this.$router.push({ path: "/lamp/collection" });
    },

    family() {
      this.$router.push({ path: "/lamp/family" });
    },

    lock(item) {
      let childlock = 1 - this.childlock;

      this.$store.commit("CHANGE_STATE_CHILDLOCK", childlock);

      if (childlock) {
        this.$set(item, "icon", require("@/assets/img/lock-on.png"));
      } else {
        this.$set(item, "icon", require("@/assets/img/lock-off.png"));
      }

      this.websocket.sendMessage({
        action: "device_ctrl",
        ctrl_type: 4,
        childlock: childlock.toString()
      });
    },

    initLock() {
      this.childlock
        ? this.$set(
            this.settingList[2],
            "icon",
            require("@/assets/img/lock-on.png")
          )
        : this.$set(
            this.settingList[2],
            "icon",
            require("@/assets/img/lock-off.png")
          );
    },

    share() {
      api(
        "relation/get_qrcode",
        {
          openid: this.openid
        },
        "GET"
      ).then(r => {
        this.qrcode = r.data.data;
      });
    },

    volume() {
      this.showVolume = !this.showVolume;
    },

    reset() {
      if (confirm("恢复出厂设置您的数据都会删除，您确定恢复出厂设置？")) {
        alert("设备已恢复出厂设置");
      }
    },

    change() {
      this.websocket.sendMessage({
        action: "device_set",
        set_type: 1,
        volume: this.volumeRange
      });
    },

    hide() {
      this.qrcode = "";
      this.showVolume = false;
    },

    getSign() {
      api("wechat/jssdk", { url: this.url }, "POST");
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 96vh;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 15rem;
  background: #5ebdff;
  padding: 1.5rem;
  margin-bottom: 3rem;
}

.avatar img {
  height: 7.5rem;
  margin-bottom: 0.5rem;
}

.username,
.online {
  color: #fffefe;
}

.username {
  font-size: 1.8rem;
}

.online {
  font-size: 1.4rem;
}

.content {
  display: flex;
  flex-wrap: wrap;
  padding: 0 1.1rem;
}

.setting-item {
  flex-basis: 33.33333333%;
  text-align: center;
  margin-bottom: 4.5rem;
}

.setting-icon {
  margin-bottom: 8px;
}

.setting-icon img {
  width: 3.5rem;
  height: 3.5rem;
}

.setting-name {
  font-size: 15px;
  color: #000;
}

.qrcode {
  position: fixed;
  background: #ededed;
  padding: 2.1rem;
  text-align: center;
  top: 30%;
  left: 23%;
  right: 23%;
  border-radius: 1rem;
}

.volume {
  position: fixed;
  background: #eff1f3;
  padding: 1rem;
  text-align: center;
  top: 18%;
  left: 15%;
  right: 15%;
  border-radius: 1rem;
}

.volume * {
  vertical-align: middle;
}

.volume img {
  display: inline-block;
  width: 3rem;
  margin-right: 1.5rem;
}

.volume .slider {
  width: 13rem;
  display: inline-block;
  margin-right: 1rem;
}

.volume .value {
  font-size: 1.6rem;
  color: #5ebdff;
}
</style>