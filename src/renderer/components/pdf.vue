<template>
  <el-dialog
    :visible.sync="pdfjsView"
    title
    width="55%"
    class="cpdf"
    append-to-body
    @close="pdfurl = null"
  >
    <div v-loading="loading" v-if="pdfurl" class="center" style="height:600px">
      <canvas v-for="data in canvasData" :key="data" :id="'the-canvas-'+data" class="canvasstyle"></canvas>
    </div>
    <div v-else style="font-size:18px;text-align:center;font-weight:900">没有PDF文件可以预览</div>
    <span slot="footer">
      <el-button @click="pdfjsView = false">取 消</el-button>
      <el-button type="primary" @click="pdfjsView = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
//import PDFJS from "pdfjs-dist";
const PDFJS = require("pdfjs-dist");

export default {
  name: "CPdf",
  props: ["url"], // 解耦
  components: {},
  data() {
    return {
      pdfDoc: null, // pdfjs 生成的对象
      pageNum: 1, //
      pageRendering: false,
      pageNumPending: null,
      scale: 1.2, // 放大倍数
      page_num: 0, // 当前页数
      page_count: 0, // 总页数
      maxscale: 2, // 最大放大倍数
      minscale: 0.8, // 最小放大倍数
      canvasData: [],
      pdfjsView: false,
      pdfurl: this.url, // 路由解耦参数
      loading: false,
    };
  },
  methods: {
    renderPage(num) {
      // 渲染pdf
      const vm = this;
      this.pageRendering = true;
      const canvas = document.getElementById(`the-canvas-${num}`);
      // Using promise to fetch the page
      this.pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport(vm.scale);
        // alert(vm.canvas.height)
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        const renderContext = {
          //   canvasContext: vm.ctx,
          canvasContext: canvas.getContext("2d"),
          viewport,
        };
        const renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(() => {
          vm.pageRendering = false;
          if (vm.pageNumPending !== null) {
            // New page rendering is pending
            vm.renderPage(vm.pageNumPending);
            vm.pageNumPending = null;
          }
        });
      });
      vm.page_num = vm.pageNum;
    },
    getUrl(url) {
      console.log(url);
      this.pdfurl = url;
      this.pdfjsView = true;
      this.showPDf();
    },
    showPDf() {
      const vm = this;
      this.loading = true;
      vm.canvasData = [];
      //PDFJS.workerSrc = "../../../static/PDF/pdf.worker.min.js";
      console.log(PDFJS);
      PDFJS.getDocument(vm.pdfurl)
        .then((pdfDoc_) => {
          // 初始化pdf
          vm.pdfDoc = pdfDoc_;
          vm.page_count = vm.pdfDoc.numPages;
          for (let i = 0; i < vm.page_count; i += 1) {
            vm.canvasData.push(i + 1);
          }
          return pdfDoc_;
        })
        .then((pdfDoc_) => {
          // 初始化pdf
          vm.pdfDoc = pdfDoc_;
          vm.page_count = vm.pdfDoc.numPages;
          for (let i = 0; i < vm.page_count; i += 1) {
            vm.renderPage(i + 1);
          }
          vm.loading = false;
        });
    },
  },
  computed: {},
  mounted() {
    this.getUrl(this.url);
  },
};
</script>

<style lang="scss" scoped type="text/css">
.cpdf {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  .center {
    text-align: center;
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    .contor {
      margin-bottom: 10px;
    }
  }
  .page-foot {
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 56px;
    line-height: 56px;
    background-color: #fff;
    text-align: center;
    z-index: 10;
    .foot-button {
      display: inline-block;
      height: 56px;
      position: relative;
      top: -22px;
      left: 20px;
    }
  }
}
</style>
