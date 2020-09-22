<template>
  <div class="content">
    <div align="center">
      <!-- <el-input
        id="input01"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 10}"
        placeholder="请选择文件"
        v-model="textarea"
      ></el-input>-->
      <div v-if="ifShowPath">
        <li v-for="(path,index) in fileList">
          <span :style="{color:(index==chooseIndex?'#03a9f4':'grey')}">{{path}}</span>
          <el-button size="mini" circle v-on:click="choosePath(index)">choose</el-button>
          <el-button size="mini" circle v-on:click="deletePath(index)">delete</el-button>
        </li>
      </div>
    </div>

    <div align="center">
      <el-button type="primary" v-on:click="openFile()" round>选择文件</el-button>
      <el-button type="primary" v-on:click="showRealPath()" round>显示路径</el-button>
      <el-button type="primary" v-on:click="OcrGet()" round>Ocr</el-button>
      <input
        type="file"
        multiple="multiple"
        name="filename"
        id="open"
        style="display:none"
        @change="fileListChange()"
        ref="fileList"
      />
    </div>

    <div class="selected">
      <span id="selected-file">解析pdf</span>
      <el-button type="primary" size="small" v-on:click="runPy()" round>run python</el-button>
    </div>
    <div class="selected">
      <span id="selected-file">查看pdf</span>
      <el-button type="primary" size="small" v-on:click="ReadPdf()" round>查看pdf</el-button>
    </div>
    <div class="ocr-content">
      <h4>OCR结果</h4>
      <el-input
        v-model="ocr_result"
        placeholder="result..."
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 16}"
      ></el-input>
    </div>
  </div>
</template>

<script>
const exec = require("child_process").exec;
const ipcRenderer = require("electron").ipcRenderer;
const { dialog } = require("electron").remote;
const ocr = require("../util/ocr");
const fs = require("fs");
const client = require("../module/ocr/OcrClient");
//const { imgOcr } = require("../API/OCR");
//const sendToPython = require("../API/processpy");
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
    openFile: function () {
      document.getElementById("open").click();
    },
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
      // document.getElementById("input01").value = document.getElementById(
      //   "open"
      // ).files[0].path;
      //console.log(document.getElementById("open").files);
    },
    async OcrGet() {
      const result = await this.fileHandler(
        //document.getElementById("open").files[0].path
        this.ocr_url
      );
      //console.log(result);
      //console.log("out" + words);
      this.ocr_result = result;
    },
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
    runPy() {
      //sendToPython();
      const path = this.ocr_url;
      //const path = document.getElementById("open").files[0].path;
      if (path && ocr.isPdf(path)) {
        var python = require("child_process").spawn("python", [
          "./python/pdfUdit.py",
          path,
        ]);
        python.stdout.on("data", function (data) {
          console.log("Python response: ", data.toString("utf8"));
        });

        python.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
        });

        python.on("close", (code) => {
          console.log(`child process exited with code ${code}`);
        });
      } else {
        this.showMessage("请选择 .pdf 文件", () => {});
      }
    },
    ReadPdf() {
      //const url = document.getElementById("open").files[0].path;
      const url = this.ocr_url;
      if (url && ocr.isPdf(url)) {
        this.$router.push({ name: "ReadPdf", params: { url: url } });
        // 通知主进程打开子页面
        // ipcRenderer.send("openPdfWindow", url);
        // ipcRenderer.on("Readpdf_down", function (event, info) {
        //   console.log(info);
        // });
      } else {
        this.showMessage("请选择 .pdf 文件", () => {});
      }
    },
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
    // runPy() {
    //   const path = document.getElementById("open").files[0].path;
    //   this.pyShell("./python/pdfUdit.py", { path: path }).then((res) => {
    //     console.log(res);
    //   });
    // },
  },
};
</script>

<style>
/*@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');*/
@import "../css/index.css";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
