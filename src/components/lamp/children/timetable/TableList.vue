<template>
  <div>
    <div class="container">
      <div class="title">
        <h1>{{schedule.title}}</h1>
      </div>
      <div class="content">
        <div class="item">
          <span class="key">课程内容：</span>
          <span class="value">{{schedule.content}}</span>
        </div>
        <div class="item">
          <span class="key">上课时间：</span>
          <span class="value">{{schedule.weekDate}} {{schedule.time}}</span>
        </div>
        <div class="item">
          <span class="key">是否提醒：</span>
          <span class="value">{{schedule.is_remind ? "是" : "否"}}</span>
        </div>
      </div>
      <div class="tool-bar">
        <button @click="del" class="del">删除</button>
        <button @click="edit" class="upd">编辑</button>
      </div>
    </div>    
  </div>
</template>

<script>
import { api } from "@/service/util/api";

export default {
  data() {
    return {
      schedule: {},
      week: "",
      time: ""
    };
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    }
  },

  mounted() {
    this.getSchedule();
    this.websocket.init(this.openid);
  },

  methods: {
    getSchedule() {
      this.schedule = Object.assign({}, this.schedule, this.$store.state.table);
    },

    edit() {
      this.$store.state.table = Object.assign({}, this.schedule);
      this.$router.push({ path: "/lamp/tableedit" });
    },

    del() {
      if (!confirm("确认删除？")) {
        return;
      }
      console.log("this.schedule", this.schedule);
      api(`userCourse/${this.schedule.id}`, "", "DELETE").then(r => {
        this.websocket.sendMessage({
          begin_time: this.schedule.date,
          week_date: this.schedule.weekDate,
          action: "schedule"
        });
        this.$router.push({ path: "/lamp/timetable" });
      });
    }
  }
};
</script>

<style scoped>
.container {
  background: rgb(243, 248, 251);
  min-height: 100vh;
  z-index: -1;
}

.title {
  padding: 1.5rem 1rem;
  background: #fff;
  margin-bottom: 0.9rem;
  font-weight: 900;
}

.content {
  padding: 10px;
  background: #fff;
}

.item {
  padding: 0 1rem;
  /* border-bottom: 1px solid rgb(216, 238, 252); */
  line-height: 3rem;
  color: #696969;
  font-size: 1.5rem;
}

button {
  background: transparent;
  padding: 1rem;
  outline: none;
  font-size: 1.7rem;
}

.del {
  color: #db506d;
  border: 0;
  margin-left: 1rem;
}

.upd {
  color: #76d5f3;
  border: 1px solid #76d5f3;
  border-radius: 5px;
  padding: 0.4rem;
  float: right;
  margin-right: 1.7rem;
  margin-top: 0.5rem;
}
</style>