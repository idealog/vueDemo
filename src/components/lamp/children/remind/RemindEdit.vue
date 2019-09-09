<template>
  <div>
    <div>
      <h3>
        标题：{{eventName}}
      </h3>
    </div>
  </div>
</template>

<script>
//事件列表子组件
export default {
  data() {
    return {
      eventName: "上培训课"
    };
  }
};
</script>