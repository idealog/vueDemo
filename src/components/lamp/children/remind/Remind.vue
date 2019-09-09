<template>
  <div>
    <ul class="container">
      <li v-for="item in list">
        <div @click="addType(item)">
          <img :src="item.icon"/>
          <div>{{item.text}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          icon: require("@/assets/img/get_up.png"),
          text: "起床",
          type: 1
        },
        {
          icon: require("@/assets/img/weather_report.png"),
          text: "天气预报",
          type: 7
        },
        {
          icon: require("@/assets/img/course_remind.png"),
          text: "上课培训",
          type: 2
        },
        {
          icon: require("@/assets/img/school_remind.png"),
          text: "上学",
          type: 2
        },
        {
          icon: require("@/assets/img/drink_remind.png"),
          text: "喝水",
          type: 5
        },
        {
          icon: require("@/assets/img/color_pen.png"),
          text: "带画笔",
          type: 5
        },
        {
          icon: require("@/assets/img/sleep_remind.png"),
          text: "睡觉",
          type: 0
        },
        {
          icon: require("@/assets/img/self_define.png"),
          text: "自定义",
          type: 8
        }
      ]
    };
  },

  mounted() {},

  methods: {
    addType(item) {
      this.$store.state.alarm_type = item.type;
      this.$router.push({
        path: "/lamp/planedit",
        query: { title: item.text }
      });
    }
  }
};
</script>

<style scoped>
.container {
  display: -webkit-flex;
  flex-flow: row wrap;
  margin-top: 2rem;
}

.container li {
  text-align: center;
  flex: 0 0 33.33%;
  margin-bottom: 1rem;
}

.container li > div {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  color: rgb(103, 103, 103);
}

.container img {
  width: 4rem;
}
</style>