<template>
  <div class="content">
    <div align="center">
      <div v-if="ifShowPath">
        <li v-for="(path, index) in fileList">
          <span :style="{ color: index == chooseIndex ? '#03a9f4' : 'grey' }">{{
            path
          }}</span>
          <el-button size="mini" circle v-on:click="choosePath(index)"
            >choose</el-button
          >
          <el-button size="mini" circle v-on:click="deletePath(index)"
            >delete</el-button
          >
        </li>
      </div>
    </div>

    <div align="center">
      <el-button type="primary" size="small" v-on:click="openFile()" round
        >选择文件</el-button
      >
      <el-button type="primary" size="small" v-on:click="showRealPath()" round
        >显示路径</el-button
      >
      <input
        type="file"
        multiple="multiple"
        name="filename"
        id="open"
        style="display: none"
        @change="fileListChange()"
        ref="fileList"
      />
    </div>

    <div class="selected">
      <span id="selected-file">Ocr解析</span>
      <el-button type="primary" size="small" v-on:click="OcrGet()" round
        >Ocr</el-button
      >
    </div>
    <div class="selected">
      <span id="selected-file">截图</span>
      <el-button type="primary" size="small" v-on:click="cut()" round
        >Cut</el-button
      >
    </div>
    <div class="selected">
      <span id="selected-file">查看pdf</span>
      <el-button type="primary" size="small" v-on:click="ReadPdf()" round
        >Read</el-button
      >
    </div>
    <div class="ocr-content">
      <h4>OCR结果</h4>
      <el-input
        v-model="ocr_result"
        placeholder="result..."
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 16 }"
      ></el-input>
    </div>
  </div>
</template>

<script>
const ipcRenderer = require("electron").ipcRenderer;
const { dialog } = require("electron").remote;
const ocr = require("../util/ocr");
const client = require("../module/ocr/OcrClient");

// 截图功能所需库
const desktopCapturer = require("electron").desktopCapturer;
const electronScreen = require("electron").screen;
const shell = require("electron").shell;
const fs = require("fs");
const os = require("os");
const path = require("path");

export default {
  name: "landing-page",
  data() {
    return {
      textarea: "",
      ocr_result: "",
      ocr_url: "",
      ifShowPath: false,
      chooseIndex: 0,
      fileList: [],
    };
  },
  components: {},
  mounted() {},
  methods: {
    // determineScreenShotSize: function () {
    //   // 确定截图尺寸
    //   const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
    //   const maxDimension = Math.max(screenSize.width, screenSize.height);
    //   return {
    //     width: maxDimension * window.devicePixelRatio,
    //     height: maxDimension * window.devicePixelRatio,
    //   };
    // },
    // cut: async function () {
    //   // 截图
    //   const that = this;
    //   const thumbSize = this.determineScreenShotSize();
    //   let options = { types: ["screen", "window"], thumbnailSize: thumbSize };
    //   desktopCapturer.getSources(options, async function (error, sources) {
    //     if (error) return console.log(error);
    //     const result = await dialog.showOpenDialog({
    //       // 选择保存截图的文件夹
    //       properties: ["openFile", "openDirectory"],
    //       title: "请选择保存截图的位置",
    //     });
    //     if (!result) {
    //       return console.log("cancel");
    //     }
    //     let screenshotPath = result[0];
    //     console.log(sources);
    //     sources.forEach(function (source) {
    //       if (source.name === "Entire screen" || source.name === "Screen 1") {
    //         // 截取整个屏幕
    //         //if (source.name.endsWith("pdf")) { // 找到窗口名称含有 pdf 的截图数据
    //         //const screenshotPath = path.join(os.tmpdir(), "screenshot.png");
    //         screenshotPath = path.join(screenshotPath, "screenshot.png");
    //         fs.writeFile(screenshotPath, source.thumbnail.toPNG(), function (
    //           error
    //         ) {
    //           if (error) return console.log(error);
    //           shell.openExternal("file://" + screenshotPath);
    //           //that.fileList.push(`file://${screenshotPath}`);
    //           that.fileList.push(screenshotPath);
    //           that.ocr_url = that.fileList[that.chooseIndex];
    //           that.showRealPath();
    //         });
    //       }
    //     });
    //   });
    // },

    // 通知主进程截图
    cut: function () {
      ipcRenderer.send("Capture");
    },

    // 选择文件
    openFile: function () {
      this.$refs.fileList.click();
    },

    // 监听 file input 变化
    fileListChange(e) {
      //console.log(this.$refs.fileList.files);
      const files = this.$refs.fileList.files;
      for (let i = 0; i < files.length; i++) {
        this.fileList.push(files[i].path);
      }
      this.ifShowPath = true;
      this.ocr_url = this.fileList[this.chooseIndex];
    },
    choosePath(index) {
      this.ocr_url = this.fileList[index];
      this.chooseIndex = index;
    },
    deletePath(index) {
      this.fileList.splice(index, 1);
      this.ocr_url = this.fileList[this.chooseIndex];
    },
    showRealPath: function () {
      this.ifShowPath = !this.ifShowPath;
    },

    // ocr 调用
    async OcrGet() {
      const result = await this.fileHandler(this.ocr_url);
      this.ocr_result = result;
    },

    // 检验图片url并处理ocr结果
    async fileHandler(path) {
      if (ocr.isImage(path)) {
        const image = fs.readFileSync(path).toString("base64");
        const words = await client.accurateBasic(image);
        //console.log(words);
        return ocr.wordsHandler(words.words_result);
      }
      dialog.showMessageBox(
        null,
        {
          type: "error",
          message: "OCR只支持 图片 文件类型！",
        },
        () => {
          this.ocr_result = "";
        }
      );
    },

    // 打开pdf
    ReadPdf() {
      const url = this.ocr_url;
      if (url && ocr.isPdf(url)) {
        //通知主进程打开子页面
        ipcRenderer.send("openPdfWindow", url);
        // ipcRenderer.on("Readpdf_down", function (event, info) {
        //   console.log(info);
        // });
      } else {
        this.showMessage("请选择 .pdf 文件", () => {});
      }
    },

    // 通用提示函数
    showMessage(message, backfun, type = "error") {
      dialog.showMessageBox(
        null,
        {
          type: type,
          message: message,
        },
        backfun
      );
    },
  },
};
</script>

<style>
@import "../css/index.css";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
