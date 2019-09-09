<template>
  <div class="container">
    <table border="1" class="tb">
      <tr>
        <th>
          <div class="date-title">日期</div>
          <div class="time-title">时间</div>
          <div 
            class="bias" 
            :style="{'transform': 'rotateZ('+degree+'deg)','width': xieLength + 'px'}">
          </div>
        </th>
        <th 
          v-for="(item, index) in tableHeaderDate" 
          :key="index">
            <span>{{weekDate[index+1]}}</span>
            <span class="date">{{item}}</span>
        </th>
      </tr>
      <tr 
        v-for="(val, key) in schedule" 
        :key="key">
        <th>
          <div>{{key}}</div>
        </th>
        <td 
          @click="editTable(row)" 
          v-for="row,index in val" 
          :key="index">
          {{row.title}}
        </td>
      </tr>
    </table>

    <div class="plan-wrap">
      <div class="plan-title">
          <v-touch> <span>添加计划</span></v-touch>
          <v-touch v-on:tap="showPlanList"> <span>计划详情</span></v-touch>
      </div>
      <div class="plan-items">
        <v-touch v-on:tap="editPlan(item)" v-for="(item, index) in plan" :key="index">
          <div>
            <img :src="item.icon"/>
            <div class="homework">{{item.title}}</div>
          </div>
        </v-touch>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/service/util/api";
import { getWeek } from "@/service/util/mUtils";

export default {
  data() {
    return {
      plan: [
        {
          title: "写作业",
          icon: require("@/assets/img/homework.png"),
          type: 3
        },
        {
          title: "预习",
          icon: require("@/assets/img/preparation.png"),
          type: 3
        },
        {
          title: "收拾书包",
          icon: require("@/assets/img/packup.png"),
          type: 3
        }
      ],
      degree: "",
      xieLength: "",
      rawSchedule: [
        /* { title: "", data: "2018-09-11 第一节" } */
      ], // 原生表格数据
      schedule: {}, // 格式化后的表单数据
      resData: [], // 后台获取的数据
      startTime: [
        "第一节",
        "第二节",
        "第三节",
        "第四节",
        "第五节",
        "第六节",
        "第七节"
      ],
      tableHeaderDate: [], // 表头日期数据
      weekDate: {
        0: "周日",
        1: "周一",
        2: "周二",
        3: "周三",
        4: "周四",
        5: "周五",
        6: "周六",
        7: "周日" //修复日期显示bug
      }
    };
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    }
  },

  mounted() {
    this.getHeaderDate();
    this.initTableData();
    this.formatData();
    this.getData();
    const vm = this;
    this.$nextTick(function() {
      vm.getDegree();
    });
  },

  methods: {
    /**
     * 获取数据
     */
    getData() {
      api(
        "userCourse",
        {
          open_id: this.openid
          // open_id: "oMI5zwbcRP0ipXiXyGlBS-DMBUo8"
        },
        "GET"
      ).then(r => {
        //过滤不要的数据
        if (!r.data.data) {
          return;
        }
        for (let i = 0; i < r.data.data.length; i++) {
          let raw = {};
          const item = r.data.data[i];

          this.$set(raw, "date", item.begin_time);
          this.$set(raw, "id", item.id);
          this.$set(raw, "title", item.title);
          this.$set(raw, "content", item.content);
          this.$set(raw, "is_remind", item.is_remind);
          this.resData.push(raw);
        }
        this.initTableData();
        this.slotData();
        this.formatData();
      });
    },

    /**
     * 将服务器的数据插入到表格中
     */
    slotData() {
      for (let i = 0; i < this.rawSchedule.length; i++) {
        for (let j = 0; j < this.resData.length; j++) {
          let raw = this.rawSchedule[i].date.split(" ");
          let res = this.resData[j].date.split(" ");
          if (
            new Date(raw[0]).getDay() == new Date(res[0]).getDay() &&
            raw[1] == res[1]
          ) {
            this.rawSchedule[i] = Object.assign({}, this.resData[j]);
          }
        }
      }
    },

    /**
     * 获取表头的渲染数据
     */
    getHeaderDate() {
      for (let i = 0; i < 7; i++) {
        this.tableHeaderDate.push(getWeek(i));
      }

      this.initTableData();
    },

    /**
     * 初始化默认数据
     */
    initTableData() {
      for (let i = 0; i < this.startTime.length; i++) {
        for (let j = 0; j < this.tableHeaderDate.length; j++) {
          this.rawSchedule[i * 7 + j] = {
            title: "",
            date:
              new Date().getFullYear() +
              "-" +
              this.tableHeaderDate[j] +
              " " +
              this.startTime[i]
          };
        }
      }
    },

    /**
     * 将原始数据转化为课表渲染用的数据结构
     * {
     *  "9:00": [
     *    { title: "数学", date: "2018-10-11", time: "9:00", weekDate: "周四" },
     *    { title: "生物", date: "2018-10-13", time: "9:00", weekDate: "周五"}
     *  ],
     *  "10:00": ...
     * }
     */
    formatData() {
      const result = {};
      this.rawSchedule.forEach(data => {
        const time = data.date.split(" ");
        const obj = {
          ...data,
          time: time[1],
          weekDate: this.weekDate[new Date(time[0]).getDay()]
        };
        result[time[1]] ? result[time[1]].push(obj) : (result[time[1]] = [obj]);
      });
      this.schedule = Object.assign({}, result);
    },

    editTable(data) {
      this.$store.state.table = data;

      // 点击有内容的格子 去详情页
      if (data.title) {
        this.$router.push({ path: "/lamp/tablelist" });
        return;
      }

      // 点击空白格 去编辑页
      this.$router.push({ path: "/lamp/tableedit" });
    },

    editPlan(item) {
      this.$store.state.alarm_type = item.type;
      this.$router.push({
        path: "/lamp/planedit",
        query: { title: item.title }
      });
    },

    showPlanList() {
      this.$router.push({ path: "/lamp/planlist" });
    },

    getDegree() {
      const rect = document.querySelector("th").getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const tanValue = width / height;
      this.degree =
        0 - (180 - Math.round(90 - Math.atan(tanValue) / (Math.PI / 180)));
      this.degree = Math.round(90 - Math.atan(tanValue) / (Math.PI / 180));
      this.xieLength = Math.sqrt(width * width + height * height);
    }
  }
};
</script>

<style scoped>
.title {
  background: white;
}

.date-title {
  position: absolute;
  top: 0;
  right: 0;
}

.time-title {
  position: absolute;
  bottom: 0;
  left: 0;
}

.bias {
  position: absolute;
  width: 16rem;
  top: 0;
  height: 0.2rem;
  background: rgb(144, 213, 254);
  transform: rotateZ(-123deg) translateX(-45%);
  transform-origin: 0% 0%;
}

.container {
  padding: 0 0.5rem;
  background: rgb(243, 248, 251);
}

.tb {
  width: 100%;
  border-collapse: collapse;
  border: none;
  background: white;
}

.date {
  color: rgb(103, 103, 103);
}

tr {
  min-height: 5rem;
}

th > span {
  display: block;
  font-size: 1.2rem;
}

th,
td {
  position: relative;
  width: calc(100% / 8);
  height: 6rem;
  border: none;
  text-align: center;
  color: rgb(84, 84, 84);
  font-weight: normal;
}

tr:nth-child(1) > th {
  border-bottom: 0.2rem solid rgb(221, 239, 251);
}

/*表头设置偶数行为**/
tr:nth-child(2n) > th > div {
  padding-top: 1rem;
  height: 96%;
  background: rgb(145, 214, 255);
  border-radius: 0.3rem;
  line-height: 3.6rem;
}

/*设置偶数行 td单元格底部边框*/
tr:nth-child(2n) > td {
  border-bottom: 0.2rem solid rgb(221, 239, 251);
}

tr:nth-child(2n) > td:nth-child(2n) {
  border-right: 0.2rem solid rgb(253, 235, 223);
}

tr:nth-child(2n) > td:nth-child(2n + 1) {
  border-right: 0.2rem solid rgb(221, 239, 253);
}

tr:nth-child(1) > th:nth-child(2n + 1) {
  border-right: 0.2rem solid rgb(221, 239, 251);
}

tr:nth-child(1) > th:last-child {
  border-right: none;
}

th:nth-child(2n) {
  border-right: 0.15rem solid rgb(253, 235, 223);
}

/*设置奇数行 td单元格底部边框*/
tr:nth-child(2n + 3) > th > div {
  height: 96%;
  line-height: 5.5rem;
  background: rgb(251, 186, 146);
  border-radius: 0.3rem;
}

tr:nth-child(2n + 1) > td {
  border-bottom: 0.2rem solid rgb(253, 215, 194);
}

tr:nth-child(2n + 1) > td:nth-child(2n) {
  border-right: 0.2rem solid rgb(253, 235, 223);
}

tr:nth-child(2n + 1) > td:nth-child(2n + 1) {
  border-right: 0.2rem solid rgb(221, 239, 253);
}

tr > td:last-child {
  border-right: none !important;
}

.plan-wrap {
  margin-bottom: 5rem;
}

.plan-items {
  display: -webkit-flex;
  background: white;
  padding: 1rem 0;
  border-bottom: 1rem solid rgb(243, 248, 251);
}

.plan-items img {
  width: 6rem;
}

.plan-items div {
  flex: 1;
  text-align: center;
  font-size: 1.5rem;
  margin-top: 0.2rem;
}

.homework {
  color: rgb(76, 178, 250);
}

.preparation {
  color: rgb(255, 130, 54);
}

.plan-items div:nth-child(3) {
  color: rgb(204, 76, 251);
}

.plan-title {
  margin-top: 1rem;
  height: 4.5rem;
  line-height: 4.5rem;
  margin-bottom: 0.5rem;
  padding: 0 1rem;
  background: white;
}

.plan-title div {
  display: inline-block;
}

.plan-title span {
  font-size: 1.6rem;
  vertical-align: middle;
}

.plan-title > span:first-child {
  display: inline-block;
  height: 2rem;
  width: 0.3rem;
  background: rgb(76, 178, 250);
  margin-right: 0.8rem;
}

.plan-title > div:last-child {
  float: right;
  color: rgb(137, 210, 251);
}
</style>