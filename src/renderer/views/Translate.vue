<template>
  <div>
    <div>
      <el-autocomplete
        class="inline-input"
        v-model="searchWords"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        @select="handleSelect"
      ></el-autocomplete>
    </div>
  </div>
</template>

<script>
//const Translator = require("../module/trans/translator");
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
    if (this.from == "zh" || this.from == "zh-CHS") {
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
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    // 选择历史记录
    handleSelect(item) {
      console.log(item);
    },

    async translateString(str, translator) {
      let resultStr = await translator.translate(str);
      console.log(resultStr);
    },
  },
  mounted() {
    let translator = new Translator(1, "zh", "en");
    this.translateString("城市", translator);
  },
};
</script>

<style>
</style>