<template>
  <div>
    <div class="container">
      <div class="header"></div>
      <div v-if="!this.editPattern" class="info-group">
        <div class="info-item">
          <div class="key">昵称</div>
          <div class="val">{{info.name}}</div>
        </div>
        <div class="info-item">
          <div class="key">性别</div>
          <div class="val">{{info.sex || ""}}</div>
        </div>
        <div class="info-item">
          <div class="key">生日</div>
          <div class="val">{{info.birthday}}</div>
        </div>
      </div>
      <el-form v-else label-width="5rem">
        <el-form-item label="昵称">
          <el-input style="width:18.3rem"  v-model="info.name"></el-input>
        </el-form-item>
        <el-form-item label="生日">
         <el-date-picker v-model="info.birthday" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="info.sex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
            <el-option label="保密" value="保密"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div v-if="!this.editPattern">
        <button @click="editPattern=true" class="edit">编辑</button>
      </div>
      <div v-else>
        <button @click="submit" class="submit">完成</button>
        <button @click="editPattern=false" class="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/service/util/api";

export default {
  data() {
    return {
      info: {
        // openid: "oMI5zwbcRP0ipXiXyGlBS-DMBUo8",
        openid: this.openid,
        name: "",
        sex: "",
        birthday: ""
      },
      editPattern: false
    };
  },

  mounted() {
    this.getInfo();
  },

  computed: {
    openid() {
      return this.$store.state.openid;
    }
  },

  methods: {
    getInfo() {
      api(
        "relation/device_basic_info",
        {
          // openid: "oMI5zwbcRP0ipXiXyGlBS-DMBUo8"
          openid: this.openid
        },
        "GET"
      ).then(r => {
        this.info.name = r.data.data.name;
        this.info.sex = r.data.data.sex;
        this.info.birthday = r.data.data.birthday;
        console.log("this.info", this.info);
      });
    },

    submit() {
      api("base/set_baby_info", {...this.info, openid: this.openid}, "POST").then(r => {
        this.getInfo();
        this.editPattern = false;
      });
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 96vh;
  position: relative;
}

.header {
  min-height: 15rem;
  background-image: url(../../../../assets/img/fa-bg.png);
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 1rem;
}

.info-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.info-item .key,
.info-item .val {
  display: inline-block;
  padding: 1rem;
  font-size: 1.5rem;
}

.info-item .key {
}

.info-item .val {
  float: right;
  text-align: left;
}

.el-form {
  padding: 2rem 1rem;
}

.edit,
.submit,
.cancel {
  display: block;
  position: absolute;
  width: 90%;
  color: #fff;
  padding: 0.8rem 0;
  margin-bottom: 2rem;
  border-radius: 0.4rem;
  border: transparent;
  left: 5%;
  right: 5%;
}

.edit,
.submit {
  background: #41abf5;
}

.edit {
  bottom: 3%;
}

.submit {
  bottom: 10%;
}

.cancel {
  bottom: 3%;
  background: #ef4e4e;
}
</style>