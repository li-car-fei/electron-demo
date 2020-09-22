<template>
  <iframe :src="base + '?file=' + url" :width="width" :height="height" class="iframe-placeholder"></iframe>
</template>
<script>
import { ipcRenderer } from "electron"; // eslint-disable-line

export default {
  name: "pdfRead",
  props: {
    url: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 750,
    },
    height: {
      type: Number,
      default: 600,
    },
  },
  data() {
    return {
      preview: false,
      base: "",
    };
  },
  computed: {
    // 讲义文件名
    name() {
      const uri = decodeURI(this.url);
      const arr = uri.split("/");
      const len = arr.length;
      return arr[len - 1];
    },
  },
  created() {
    // 获取viewer.html的位置
    ipcRenderer.send("getUrl");
  },
  mounted() {
    ipcRenderer.on("recieve", (e, arg) => {
      console.log("文件路径", arg);
      this.base = arg;
    });
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  .info {
    width: 200px;
  }
}
</style>

