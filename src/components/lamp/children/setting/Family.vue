<template>
  <div>
    <div class="container">
      <div class="header"></div>
      <div class="family-group">
        <div 
          class="family"
          v-for="(item, index) in familyList" 
          :key="index">
          <div class="avatar">
            <img :src="item.headimgurl" :alt="item.nickname">
          </div>
          <div class="nickname">{{item.nickname}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/service/util/api";

export default {
  data() {
    return {
      familyList: [],
      url: ""
    };
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    }
  },

  mounted() {
    this.getFamily();
  },

  methods: {
    getFamily() {
      api(
        "relation/get_member_list",
        {
          // openid: this.openid
          openid: "oMI5zwbcRP0ipXiXyGlBS-DMBUo8"
        },
        "GET"
      ).then(r => {
        this.familyList = r.data.data;
      });
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
  background-image: url(../../../../assets/img/fa-bg.png);
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 1rem;
}

.family-group {
  display: flex;
}

.family {
  flex-basis: 33.33333%;
  text-align: center;
  margin-bottom: 1rem;
}

.family .avatar img {
  width: 5rem;
  border-radius: 50%;
  margin-bottom: 0.3rem;
}

.family .nickname {
  font-size: 1.3rem;
}
</style>