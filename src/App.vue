<template>
  <div id="app">
    <div @click="viewImage($event)">
      <img v-for="(item, index) in imglist" class="image" :key="index" :idx="index" :src="item.thumnbnail" />
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      imglist: [
        {
          thumnbnail: "https://gdttest.wqc.so/uploads/designCenter/mainImage/dumbo-005_15832913844641_15911871057978.jpg!250-250",
          naturalsrc: "https://gdttest.wqc.so/uploads/designCenter/mainImage/dumbo-005_15832913844641_15911871057978.jpg",
          name: "测试图片一.jpg"
        },
        {
          thumnbnail: "https://gdttest.wqc.so/uploads/designCenter/mainImage/hahahahahahahhahahhahahahahha_15915763141386.jpg!250-250",
          naturalsrc: "https://gdttest.wqc.so/uploads/designCenter/mainImage/hahahahahahahhahahhahahahahha_15915763141386.jpg",
          name: "测试图片二.jpg"
        },
        {
          thumnbnail: "https://gdttest.wqc.so/uploads/designCenter/mainImage/%E5%B8%8C%E7%B2%89%E8%8A%82_15899665366964_15911727718771.jpg!250-250",
          naturalsrc: "https://gdttest.wqc.so/uploads/designCenter/mainImage/%E5%B8%8C%E7%B2%89%E8%8A%82_15899665366964_15911727718771.jpg",
          name: "测试图片三.jpg"
        },
      ]
    };
  },
  methods: {
    viewImage(e) {
      this.$imageViewer(e, this.imglist);
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
}
/* 修改原生的滚动条 */
::-webkit-scrollbar {
  /* 血槽宽度 */
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  /* 拖动条 */
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  /* 背景槽 */
  background: #ddd;
  border-radius: 6px;
}
.image {
  height: 200px;
  margin: 20px 10px;
}
</style>