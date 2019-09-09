<template>
    <div>
        <div class="bg"></div>
        <div class="light-wrap">
            <div class="light-container">
              <div>
                <span>{{weekDay}}</span>
                <span>{{monthDay}}</span>
              </div>
              <div class="light-ctrl">
                <!-- <ul
                  class="calibration"
                  @touchstart="handleTouchStart"
                >
                  <li
                    v-for="i in total"
                    :key="i"
                    :data-percent.number="calcScaleValue(i / total * 100)"
                    :style="`transform: rotate(${calcDeg(i)}deg) translate(${translateX}rem, -50%)`"
                    :class="{ active: calcScaleValue(i / total * 100) == lightness }"
                  ></li>
                </ul> -->
                <div 
                  @click="changeLightness(i)"
                  v-for="i in 6"
                  :key="i"
                  :data-range.number="i"
                  :style="`transform: translate(-50%, -50%) rotate(${(i-1) * 60}deg) `"
                  :class="['range', {active: i <= lightness}]">
                </div>
                <div class="circle"></div>
                <div class="light-data">
                  <div class="data-item">
                    <div class="value">{{led_on_time}}H</div>
                    <div class="key">使用时间</div>
                  </div>
                  <span class="slash">
                    <svg width="10" height="40" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <line x1="10" x2="0" y1="0" y2="40" 
                        stroke="rgb(92, 190, 255)" 
                        fill="transparent" 
                        stroke-width="2"/>
                    </svg>
                  </span>
                  <div class="data-item">
                    <div class="value">{{lightness}}级</div>
                    <div class="key">亮度</div>
                  </div>
                </div>
              </div>
              <div class="mode-title">
                <span class="line"></span>
                <span class="title">
                  {{myMode}}
                </span>
                <span class="line"></span>
              </div>
            </div>

            <div class="light-attr-container">
              <div class="light-attr-item">
                  <div class="attr-value">
                    <span>{{ra.start.toFixed(0)}}</span><span v-if="ra.end">-{{ra.end.toFixed(0)}}</span>
                  </div>
                  <div class="attr-text">指数值（Ra）</div>
              </div>
              <div class="light-attr-item">
                  <div class="attr-value"><={{temp.toFixed(0)}}k</div>
                  <div class="attr-text">色温</div>
              </div>
              <div class="light-block-item">
                  <img :src="leftIcon" alt="左标签">
                <div class="text">
                  <div v-if="ra.end==100" class="attr-value">优秀(1A)</div>
                  <div class="attr-text">色温等级</div>
                </div>
                  <img :src="rightIcon" alt="右标签">
              </div>
            </div>

            <div class="light-mode-container">
              <div 
                @click="selectMode(mode)" 
                v-for="(mode, index) in modeList" 
                :class="['light-mode-item', {active: currentMode === mode.id}]" 
                :key="index">
                <div class="text">{{mode.name}}</div>
              </div>
            </div>

            <div class="set-wrap">
              <div class="set-attr-item">
                  <div class="set-attr-content">
                      <div  class="set-attr-sub-item">
                          <img :src="restTipsIcon" />
                      </div>
                      <div class="set-attr-sub-item">
                          <div class="set-attr-value">
                              <span>{{rest_remind_count}}次</span>
                          </div>
                          <div class="set-attr-text">
                              <span>休息提醒</span>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="set-attr-item">
                  <div class="set-attr-content">
                  <div class="set-attr-sub-item">
                      <img :src="setRightIcon"/>
                  </div>
                  <div class="set-attr-sub-item">
                      <div class="set-attr-value">
                          <span>{{sit_remind_count}}次</span>
                      </div>
                      <div class="set-attr-text">
                          <span>坐姿提醒</span>
                      </div>
                  </div>
                  </div>
              </div>
              <div class="set-attr-item">
                  <div class="set-attr-content">
                      <div class="set-attr-sub-item">
                          <img :src="setRightIcon"/>
                      </div>
                      <div class="set-attr-sub-item">
                          <div class="set-attr-value">
                              <span>{{sit_normal_time}}分钟</span>
                          </div>
                          <div class="set-attr-text">
                              <span>坐姿端正</span>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="set-attr-item">
                  <div class="set-attr-content">
                      <div class="set-attr-sub-item">
                          <img :src="setErrorIcon"/>
                      </div>
                      <div class="set-attr-sub-item">
                          <div class="set-attr-value">
                              <span>{{sit_error_time}}分钟</span>
                          </div>
                          <div class="set-attr-text">
                              <span>坐姿错误</span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>

            <p class="bottom-instruction">
                灯光模式，可根据场景进行切换
            </p>
        </div>
    </div/>
</template>

<script>
export default {
  data() {
    return {
      // /* 调光盘相关 */
      // total: 6, // 刻度总数
      // translateX: 6, // 刻度线在x轴方向的偏移量
      // isTouching: false, // 用户是否在更改刻度
      // hasChangeScale: false, // 当前事件是否滑动改变刻度 (touchmove)

      weekDay: "",
      monthDay: "",
      modeList: [{ id: 1, name: "学习模式" }, { id: 2, name: "睡眠模式" }],

      restTipsIcon: require("@/assets/img/rest_tips.png"),
      setRightIcon: require("@/assets/img/set_right.png"),
      setErrorIcon: require("@/assets/img/set_error.png"),
      leftIcon: require("@/assets/img/left.png"),
      rightIcon: require("@/assets/img/right.png")
    };
  },

  computed: {
    gap() {
      // 每个刻度的角度差值
      return 360 / this.total;
    },

    temp() {
      return this.$store.state.color_temp;
    },

    ra() {
      return this.$store.state.ra;
    },

    openid() {
      return this.$store.state.openid;
    },

    lightness() {
      return this.$store.state.lightness;
    },

    currentMode() {
      return this.$store.state.mode;
    },

    myMode() {
      switch (this.currentMode) {
        case 0:
          return "普通模式";
          break;
        case 1:
          return "学习模式";
          break;
        case 2:
          return "睡眠模式";
          break;
      }
    },

    led_on_time() {
      return this.$store.state.led_on_time;
    },

    sit_normal_time() {
      return this.$store.state.sit_normal_time;
    },

    sit_error_time() {
      return this.$store.state.sit_error_time;
    },

    sit_remind_count() {
      return this.$store.state.sit_remind_count;
    },

    rest_remind_count() {
      return this.$store.state.rest_remind_count;
    }
  },

  mounted() {
    this.websocket.init(this.openid);
    // this.websocket.init("oMI5zwbcRP0ipXiXyGlBS-DMBUo8");
    this.getDay();
    this.changeValue();
  },

  // beforeDestroy() {
  //   document.removeEventListener("touchmove", this.handleChangeBrightness);
  //   document.removeEventListener("touchend", this.handleTouchEnd);
  // },

  methods: {
    // getDegree() {
    //   let rect = document.querySelector("th").getBoundingClientRect();
    //   const width = rect.width;
    //   const height = rect.height;
    //   const tanValue = Math.round(width / height);
    // },

    getDay() {
      const date = new Date();
      let month = date.getMonth() + 1;
      let days = date.getDate();
      month = month < 10 ? `0${month}` : `${month}`;
      days = days < 10 ? `0${days}` : `${days}`;
      const han = ["日", "一", "二", "三", "四", "五", "六"];
      this.weekDay = `周${han[date.getDay()]}`;
      this.monthDay = `${month}.${days}`;
    },

    selectMode(item) {
      this.$store.commit("CHANGE_MODE", item.id);
      switch (item.name) {
        case "学习模式":
          this.$store.commit("CHANGE_LIGHTNESS", 4);
          break;
        case "睡眠模式":
          this.$store.commit("CHANGE_LIGHTNESS", 2);
          break;
      }
    },

    changeLightness(lightness) {
      this.$store.commit("CHANGE_MODE", 0);
      this.$store.commit("CHANGE_LIGHT_STATUS", 1);
      this.$store.commit("CHANGE_LIGHTNESS", lightness);
    },

    changeValue() {
      if (!this.$store.state.light_status) {
        return;
      }
      TweenLite.to(this.$store.state, 0.5, { color_temp: 4000 });
      TweenLite.to(this.$store.state.ra, 0.5, { start: 90, end: 100 });
    },

    sendLight(lightness) {
      console.log("lightness", lightness);
      this.websocket.sendMessage({
        action: "device_set",
        set_type: 32,
        lamp_mode: this.currentMode,
        brightness: parseInt(lightness)
      }); //与设备链接
      if (this.openid) {
      }
    }

    /**
     * 亮度调节函数
     */
    // handleChangeBrightness(e) {
    //   if (!this.isTouching) {
    //     return;
    //   }

    //   // 为了避免 touchend 的 setScale;
    //   this.hasChangeScale = true;

    //   const { clientX, clientY } = e.touches[0];
    //   const el = document.elementFromPoint(clientX, clientY);
    //   this.setScale(el);
    // },

    // setScale(el) {
    //   if (!el.dataset.percent) {
    //     return;
    //   }
    //   this.$store.commit("CHANGE_LIGHTNESS", el.dataset.percent);
    // },

    // handleTouchStart() {
    //   this.isTouching = true;
    //   document.addEventListener("touchmove", this.handleChangeBrightness);
    //   document.addEventListener("touchend", this.handleTouchEnd);
    // },

    // handleTouchEnd(e) {
    //   this.isTouching = false;
    //   if (!this.hasChangeScale) {
    //     const { target } = e;
    //     this.setScale(target);
    //   } else {
    //     this.hasChangeScale = false;
    //   }
    //   document.removeEventListener("touchmove", this.handleChangeBrightness);
    //   document.removeEventListener("touchend", this.handleTouchEnd);
    //   this.sendLight();
    // },

    // // 小于 10 - 1 不然最小是 1 没有 0 刻度
    // calcScaleValue(i) {
    //   i = parseInt(i);
    //   return i < 10 ? i - 1 : i;
    // },

    // // 让 0 刻度到最上方
    // calcDeg(i) {
    //   return i * this.gap - 90 - this.gap;
    // },
  },

  watch: {
    lightness: function(n) {
      this.sendLight(n);
    }
  }
};
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.bg {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgb(243, 248, 251);
  z-index: -1;
}

.light-wrap {
  padding: 0.5rem;
  max-height: 96vh;
  overflow: auto;
}

.light-container {
  background: white;
  position: relative;
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.light-ctrl {
  position: relative;
  margin: 10px auto;
  min-height: 12rem;
}

.range {
  display: block;
  position: absolute;
  width: 13.5rem;
  height: 13.5rem;
  border-radius: 50%;
  border: 10px solid #ccc;
  left: 50%;
  top: 50%;
  /* clip-path: inset(0 0 9rem 8.6rem); */
  clip: rect(0 13.5rem 4.5rem 8.6rem);
}

.range.active {
  border: 15px solid rgb(92, 190, 255);
}

/* .calibration {
  display: block;
  height: 12rem;
}

.calibration li {
  position: absolute;
  left: 50%;
  top: 49%;
  background-color: rgb(92, 190, 255);
  display: block;
  width: 12px;
  height: 3px;
}

.calibration li.active {
  background-color: red;
  width: 16px;
} */

.light-ctrl .circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10.5rem;
  height: 10.5rem;
  transform: translate(-50%, -50%);
  border: 0.3rem solid #aedaf7;
  border-radius: 50%;
}

.light-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.light-data .data-item {
  display: inline-block;
  text-align: center;
}

.light-data .data-item .key {
  font-size: 1rem;
  color: rgb(162, 162, 162);
}

.light-data .data-item .value {
  font-size: 1.7rem;
  color: rgb(92, 190, 255);
}

.mode-title {
  line-height: 4rem;
  text-align: center;
}

.mode-title .title {
  margin: 0 1rem;
}

.mode-title .line {
  display: inline-block;
  vertical-align: middle;
  width: 8rem;
  height: 0.1rem;
  background: rgb(92, 190, 253);
}

.light-attr-container {
  display: -webkit-flex;
  flex-flow: row wrap;
  padding: 0.5rem 0rem;
  background: white;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 1rem;
}

.light-block-item,
.light-attr-item {
  text-align: center;
  padding-bottom: 1rem;
}

.light-block-item {
  flex-basis: 100%;
}

.light-block-item img,
.light-block-item .text {
  display: inline-block;
  width: 30%;
}

.light-block-item * {
  vertical-align: bottom;
  margin-top: 0.5rem;
}

.light-block-item img {
  color: #edf8fe;
}

.light-attr-item {
  flex: 0 0 50%;
}

.light-attr-item:nth-child(1) {
  border-bottom: 1px solid rgb(188, 229, 249);
}

.light-attr-item:nth-child(2) {
  border-bottom: 1px solid rgb(188, 229, 249);
}

.light-attr-item:nth-child(2n + 1) {
  border-right: 0.2rem solid rgb(188, 229, 249);
}

.light-attr-item .attr-text,
.light-block-item .attr-text {
  color: rgb(162, 162, 162);
  font-size: 1.6rem;
  line-height: 1.6rem;
}

.light-attr-item .attr-value,
.light-block-item .attr-value {
  color: rgb(92, 190, 255);
  font-size: 2rem;
}

.light-mode-container {
  background: #fff;
  padding: 1rem 1.3rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-around;
}

.light-mode-item {
  background: #a1d7fd;
  border-radius: 8.5rem;
  width: 12.6rem;
  height: 4.5rem;
  text-align: center;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.light-mode-item.active {
  background-image: url(../../../../assets/img/mode_active.png);
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: cover;
}

.light-mode-item .text {
  text-align: center;
  font-size: 1.5rem;
}

.set-wrap {
  display: -webkit-flex;
  flex-flow: row wrap;
}

.set-attr-item {
  flex: 0 0 50%;
  text-align: center;
  background: white;
  margin-bottom: 0.5rem;
  padding: 0.4rem 0;
}

.set-attr-sub-item {
  vertical-align: middle;
  display: inline-block;
}

.set-attr-sub-item img {
  width: 3rem;
}

.set-attr-value span {
  font-size: 1.7rem;
}

.set-attr-text span {
  color: rgb(162, 162, 162);
}

.bottom-instruction {
  text-align: center;
  font-size: 1.3rem;
  color: rgb(217, 222, 225);
}

.set-attr-item:nth-child(2n + 1) .set-attr-content {
  padding: 0.5rem;
  border-right: 0.2rem solid #a1d7fd;
}
</style>