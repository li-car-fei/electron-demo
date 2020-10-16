<template>
  <div>
    <div>
      <el-autocomplete
        class="inline-input"
        v-model="searchWords"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        @select="handleSelect"
        @keydown.enter.native="search"
      ></el-autocomplete>
    </div>
    <el-input
      v-model="search_result"
      placeholder="result..."
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 16 }"
    ></el-input>
  </div>
</template>

<script>
import { Trans_history } from "../util/local_data";
const request = require("request-promise");
var crypto = require("crypto");
const config = require("../module/Tran_config");
//const md5 = require('./md5')

class Translator {
  // type: 1：百度翻译，0：有道翻译
  constructor(type, from, to) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.url = type ? config.url : config.youHost; // url
    this.secretKey = type ? config.secret_key : config.secretKey; // 密钥
    this.appKey = type ? config.appid : config.appKey; // 应用id
    this.salt = config.salt; // 随机数
  }

  // url拼接处理
  generateUrlParams(_params) {
    let paramsData = [];
    for (const key in _params) {
      if (_params.hasOwnProperty(key)) {
        paramsData.push(key + "=" + _params[key]);
      }
    }
    const result = paramsData.join("&");
    return result;
  }

  // md5 加密
  md5(str) {
    var crypto_md5 = crypto.createHash("md5");
    crypto_md5.update(str);
    return crypto_md5.digest("hex");
  }

  async translate(word) {
    let encodeURIWord = word;
    if (this.from == "zh" || this.from == "zh-CHS" || this.from == "auto") {
      // 中文需要进行uri编码
      encodeURIWord = encodeURI(word);
    }
    let sign = this.md5(this.appKey + word + this.salt + this.secretKey);
    let params = {
      q: encodeURIWord, // 中文或英文
      from: this.from,
      to: this.to,
      salt: this.salt,
      sign: sign,
    };
    if (this.type) {
      params.appid = this.appKey;
    } else {
      params.appKey = this.appKey;
    }
    const url = this.url + "?" + this.generateUrlParams(params);
    const result = await request.get({
      url,
    });
    return result;
  }
}
export default {
  data() {
    return {
      history: [],
      searchWords: "",
      search_result: "",
    };
  },
  methods: {
    // 筛选历史，与输入的内容有相似
    querySearch(queryString, cb) {
      var history = this.history;
      var results = queryString
        ? history.filter(this.createFilter(queryString))
        : history;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (history_item) => {
        return history_item.value.indexOf(queryString) == 0;
      };
    },

    // 选择历史记录
    async handleSelect(item) {
      //console.log(item.value);
      const result = await this.translateString(item.value, this.translator);
      this.search_result = result;
    },

    async search() {
      const result = await this.translateString(
        this.searchWords,
        this.translator
      );
      this.search_result = result;
      this.history.push({
        value: this.searchWords,
      });
      this.searchWords = "";
      Trans_history.set(this.history);
    },

    async translateString(str, translator) {
      let resultStr = await translator.translate(str);
      return resultStr;
    },
  },
  mounted() {
    this.history = Trans_history.get();
    //this.translator = new Translator(0, "zh-CHS", "en");
    this.translator = new Translator(0, "auto", "en");
    this.translateString("中国", this.translator);
  },
};
</script>

<style>
</style>