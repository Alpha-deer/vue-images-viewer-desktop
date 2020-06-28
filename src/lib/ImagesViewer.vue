<template>
    <div v-if="visible" class="unselect">

      <div class="tooltip" v-if="show_tooltip">120%</div>

      <div class="see-image" :style="{ backgroundColor: background }">
          <img
            id="drag"
            class="showed-image"
            :src="imgObj.naturalsrc"
            alt="找不到图片"
            ref="user_image"
            v-drag="greet"
            @mousewheel.prevent.stop="wheel"
            @load="loadImg($event)"
            @error="imgError($event)"
          />
      </div>
      <div class="close" @click.stop="close" v-show="closeButtonVisible">
        <img src="../../assets/images/close.png" />
      </div>
      <div class="back" @click.stop="back" v-show="closeButtonVisible">
        <img src="../../assets/images/arrow-left.png" />
      </div>
      <div class="forward" @click.stop="forward" v-show="closeButtonVisible">
        <img src="../../assets/images/arrow-right.png" />
      </div>
      <div class="footer-bar">
        <div class="image-info flex-box ">
          <div class="image-name single-text-ellipsis">{{imgObj.name}}</div>
          <div class="image-size">&nbsp;({{imgHeight+'*'+imgWidth}})</div>
        </div>
        <div class="image-oprate-bar flex-box flex-space-between">
            <!-- 下载 -->
            <img @click.stop="download" src="../../assets/images/download.png" />
            <!-- 复制共享地址 -->
            <img @click.stop="copylink" src="../../assets/images/copy.png" />
            <!-- 缩小20% -->
            <img @click.stop="shrink" src="../../assets/images/shrink.png" />
            <!-- 放大20% -->
            <img @click.stop="enlarge" src="../../assets/images/enlarge.png" />
            <!-- 原始比例 -->
            <img @click.stop="rotateReset" src="../../assets/images/percent_100.png" />
        </div>
        <!-- <i @click.stop="rotateReset" v-show="!showFull" class="reset_size_icon">1 : 1</i>
        <Icon @click.stop="rotateBack" v-show="showFull" type="ios-expand" style="font-size:24px" /> -->
        <!-- <Icon @click.stop="rotateAntiClock" v-show="rotateButtonVisible" type="ios-refresh" class="rotate_icon" />
        <Icon @click.stop="rotateClock" v-show="rotateButtonVisible" type="ios-refresh" />-->
      </div>
    </div>
  <!-- </div> -->
</template>

<script>
import config from "./config";

const {
  modalOpacity,
  canClickModalHide,
  rotateButtonVisible,
  closeButtonVisible
} = config;
export default {
  // props: {
  //   image_list: {
  //     type: Array,
  //     default() {
  //       return [];
  //     }
  //   }
  // },
  data() {
    return {
      image_list: [],
      current_index: 0,
      imgObj: {
        thumnbnail: '',
        naturalsrc: '',
        name: ''
      },
      loading_img: true, 
      visible: false,
      background:
        modalOpacity > 1 ||
        modalOpacity <= 0 ||
        typeof modalOpacity !== "number"
          ? null
          : "rgba(0,0,0," + modalOpacity + ")",
      rotateButtonVisible,
      closeButtonVisible,
      imgHeight: 0,
      imgWidth: 0,
    
      show_tooltip: false,
    };
  },
  updated() {
    if(this.image_list.length > 0) {
      this.imgObj = this.image_list[this.current_index]
    } 
    this.$nextTick(() => {
      if (this.visible === true) {
        if (this.$refs.user_image) {
          this.imgHeight = this.$refs.user_image.naturalHeight;
          this.imgWidth = this.$refs.user_image.naturalWidth;
          this.$refs.user_image.onload = () => {
            this.loading_img = false
          }
           this.$refs.user_image.onerror = () => {
            this.loading_img = false
          }
        }
      }
    });
  },
  beforeDestroy() {
    if(this.timer) {
      clearInterval(this.timer)
    }
  },
  watch: {
    current_index(val) {
      this.imgObj = this.image_list[val]
      this.resetImg();
    }
  },
  methods: {
    // 点击图片预览图片
    viewImage(e) {
      // if (!this.visible || (!canClickModalHide && closeButtonVisible)) return;
      // document.addEventListener("click", e => {
      //   if (e.target.nodeName !== "IMG" && e.target.nodeName !== "BUTTON") {
      //     this.clearImg();
      //   }
      // });
    },

    loadImg(e) {
      this.loading_img = false
    },
    imgError(e) {
      this.loading_img = false
    },

    //接受传来的位置数据，并将数据绑定给data下的val
    greet(val) {
        this.val = val;
    },

    close() {
      this.clearImg();
    },

    back() {
      // this.currentSrc = ''
      // this.loading_img = true
      let prev = this.current_index - 1;
      if (prev < 0) {
        prev = this.image_list.length - 1;
      }
      // this.currentSrc = this.image_list[prev].picture_address;
      // this.image_name = this.image_list[prev].name;
      // this.url = this.image_list[prev].url;
      // this.share_address = this.image_list[prev].share_address;
      this.current_index = prev;
      // this.resetImg();
    },

    forward() {
      // this.loading_img = true
      let next = this.current_index + 1;
      if (next == this.image_list.length) {
        next = 0;
      }
      // this.currentSrc = this.image_list[next].picture_address;
      // this.image_name = this.image_list[next].name;
      // this.url = this.image_list[next].url;
      // this.share_address = this.image_list[next].share_address;
      this.current_index = next;
      // this.resetImg();
    },

    //旋转图片
    rotateClock(e) {
      let fromRotateDeg = this.$refs.user_image.style.transform.split(" ");
      switch (fromRotateDeg[0]) {
        case "rotate(0deg)":
          fromRotateDeg[0] = "rotate(90deg)";
          break;
        case "rotate(90deg)":
          fromRotateDeg[0] = "rotate(180deg)";
          break;
        case "rotate(180deg)":
          fromRotateDeg[0] = "rotate(270deg)";
          break;
        case "rotate(270deg)":
          fromRotateDeg[0] = "rotate(360deg)";
          break;
        default:
          fromRotateDeg[0] = "rotate(90deg)";
          break;
      }
      this.$refs.user_image.style.transform = fromRotateDeg.join(" ");
    },

    rotateAntiClock(e) {
      let fromRotateDeg = this.$refs.user_image.style.transform.split(" ");
      switch (fromRotateDeg[0]) {
        case "rotate(0deg)":
          fromRotateDeg[0] = "rotate(90deg)";
          break;
        case "rotate(-90deg)":
          fromRotateDeg[0] = "rotate(-180deg)";
          break;
        case "rotate(-180deg)":
          fromRotateDeg[0] = "rotate(-270deg)";
          break;
        case "rotate(-270deg)":
          fromRotateDeg[0] = "rotate(-360deg)";
          break;
        default:
          fromRotateDeg[0] = "rotate(-90deg)";
          break;
      }
      this.$refs.user_image.style.transform = fromRotateDeg.join(" ");
    },

    // 放大图片
    enlarge(e) {
      this.$refs.user_image.style.transform =
        this.$refs.user_image.style.transform + " scale(1.2)";
    },

    // 缩小图片
    shrink(e) {
      this.$refs.user_image.style.transform =
        this.$refs.user_image.style.transform + " scale(0.8)";
    },

    //滚轮缩放
    wheel(e) {
      if (e.wheelDelta) {
        //判断浏览器IE，谷歌滑轮事件
        if (e.wheelDelta > 0) {
          //当滑轮向上滚动时
          this.$refs.user_image.style.transform =
            this.$refs.user_image.style.transform + " scale(1.2)";
        }
        if (e.wheelDelta < 0) {
          //当滑轮向下滚动时
          this.$refs.user_image.style.transform =
            this.$refs.user_image.style.transform + " scale(0.8)";
        }
      } else if (e.detail) {
        //Firefox滑轮事件
        if (e.detail > 0) {
          //当滑轮向上滚动时
          this.$refs.user_image.style.transform =
            this.$refs.user_image.style.transform + " scale(1.2)";
        }
        if (e.detail < 0) {
          //当滑轮向下滚动时
          this.$refs.user_image.style.transform =
            this.$refs.user_image.style.transform + " scale(0.8)";
        }
      }
    },

    rotateReset() {
      this.$refs.user_image.style.height = this.imgHeight + "px";
      this.$refs.user_image.style.transform = "scale(1.0)";
      this.showFull = true;
    },

    rotateBack() {
      this.$refs.user_image.style.height = "700px";
      this.$refs.user_image.style.transform = "scale(1.0)";
      this.showFull = false;
    },

    //当图片隐藏时候的回调
    clearImg() {
      this.visible = false;
      this.loading_img = true
      this.valCache = null
      document.removeEventListener("click", null);
      setTimeout(() => {
        if (this.$refs.user_image) {
          this.$refs.user_image.style.transform = "rotate(0deg)";
          this.$refs.user_image.style.left = "";
          this.$refs.user_image.style.top = "";
        }
      }, 100);
    },

    resetImg() {
      if (this.$refs.user_image) {
        this.$refs.user_image.style.transform = "rotate(0deg)";
        this.$refs.user_image.style.left = "";
        this.$refs.user_image.style.top = "";
        this.imgHeight = this.$refs.user_image.naturalHeight;
        this.imgWidth = this.$refs.user_image.naturalWidth;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import url("./index.less");
</style>