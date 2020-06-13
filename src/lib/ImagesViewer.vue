<template>
    <div v-if="visible" class="unselect">
      <transition name="fade">
        <div class="tooltip" v-if="show_tooltip">已复制到剪切板</div>
      </transition>

        <div class="tooltip2" v-if="loading_img">
          <div class="demo-spin-col" >
                <div>图片加载中...</div>
          </div>
        </div>

      <div class="see-image" :style="{ backgroundColor:background }">
          <img
            id="drag"
            class="showed-image"
            :src="currentSrc"
            alt="找不到图片"
            ref="user_image"
            @mousewheel.prevent.stop="wheel"
            v-drag="greet"
            v-show="!loading_img"
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
          <div class="image-name single-text-ellipsis">{{image_name}}</div>
          <div class="image-size">&nbsp;({{imgHeight+'*'+imgWidth}})</div>
        </div>
        <div class="image-oprate-bar flex-box flex-space-between">
          <Tooltip content="下载" placement="top">
            <img @click.stop="download" src="../../assets/images/download.png" />
          </Tooltip>
          <Tooltip content="复制共享地址" placement="top">
            <img @click.stop="copylink" src="../../assets/images/copy.png" />
          </Tooltip>
          <Tooltip content="缩小20%" placement="top">
            <img @click.stop="shrink" src="../../assets/images/shrink.png" />
          </Tooltip>
          <Tooltip content="放大20%" placement="top">
            <img @click.stop="enlarge" src="../../assets/images/enlarge.png" />
          </Tooltip>
          <Tooltip content="原始比例" placement="top">
            <img @click.stop="rotateReset" src="../../assets/images/percent_100.png" />
          </Tooltip>
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
  props: {
    image_list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      current_index: 0,
      currentSrc: "",
      loading_img: true,
      image_name: '',
      url: '',
      share_address: '',
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
      showFull: false,
      valCache: null,
      show_tooltip: false,
    };
  },
  updated() {
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
  watch: {

  },
  mounted() {

  },
  beforeDestroy() {
    if(this.timer) {
      clearInterval(this.timer)
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
      this.loading_img = true
      let prev = this.current_index - 1;
      if (prev < 0) {
        prev = this.image_list.length - 1;
      }
      this.currentSrc = this.image_list[prev].picture_address;
      this.image_name = this.image_list[prev].name;
      this.url = this.image_list[prev].url;
      this.share_address = this.image_list[prev].share_address;
      this.current_index = prev;
      this.resetImg();
    },

    forward() {
      this.loading_img = true
      let next = this.current_index + 1;
      if (next == this.image_list.length) {
        next = 0;
      }
      this.currentSrc = this.image_list[next].picture_address;
      this.image_name = this.image_list[next].name;
      this.url = this.image_list[next].url;
      this.share_address = this.image_list[next].share_address;
      this.current_index = next;
      this.resetImg();
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

    download() {
      let url = this.url;
      window.open(url);
    },

    copylink() {
      var aux = document.createElement("input");
      aux.setAttribute("value", this.share_address);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      this.show_tooltip = true
      this.timer = setTimeout(() => {
        this.show_tooltip = false
      }, 2000)
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
.unselect {
  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}
.slide-leave-to,
.slide-enter {
  transform: scaleY(0);
}
.see-image {
  width: 100%;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: 0.25s showAimation ease;
}
@keyframes showAimation {
  from {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}
.showed-image {
  height: 100vh;
  // height: 400px;
  position: absolute;
  // top: 0;
  cursor: move;
  transition: 0.3s;
}
.tooltip {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -45px;
  z-index: 3000;
  width: 120px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border-radius: 4px;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
}
.tooltip2 {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -100px;
  z-index: 4000;
  width: 200px;
  height: 200px;
  background-color: transparent;
}
.footer-bar{
  position: fixed;
  z-index: 999;
  bottom: 60px;
  left: 50%;
  margin-left: -220px;
  width:440px;
  height:88px;
  color: #333;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 16px rgba(0,36,70,0.15);
  opacity:1;
  border-radius:8px;
  .image-info {
    height: 36px;
    line-height: 36px;
    padding: 0 24px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    border-bottom: solid 1px rgba(221,221,221,1);
    .image-name{
      max-width: 300px;
    }
  }
  .image-oprate-bar {
    height: 50px;
    padding: 0 56px;
    align-items: center;
    img{
      cursor: pointer;
    }
  }
}
.close {
  position: fixed;
  right: 0;
  top: 0;
  cursor: pointer;
  z-index: 999;
}
.back,
.forward {
  position: fixed;
  top: 50%;
  margin-top: 28px;
  cursor: pointer;
  z-index: 999;
}
.back {
  left: 80px;
}
.forward {
  right: 80px;
}
.demo-spin-col{
  height: 200px;
  width: 200px;
  position: relative;
  background: transparent;
   border: none;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
</style>