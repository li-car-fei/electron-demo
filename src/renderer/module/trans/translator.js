const request = require('request-promise');
var crypto = require('crypto');
const config = require('../Tran_config');
//const md5 = require('./md5')


class Translator {
    // type: 1：百度翻译，0：有道翻译
    constructor(type, from, to) {
        this.type = type;
        this.from = from;
        this.to = to;
        this.url = type ? config.url : config.youHost;                  // url
        this.secretKey = type ? config.secret_key : config.secretKey;       // 密钥
        this.appKey = type ? config.appid : config.appKey;              // 应用id
        this.salt = config.salt;                                // 随机数
    }

    // url拼接处理
    generateUrlParams(_params) {
        let paramsData = []
        for (const key in _params) {
            if (_params.hasOwnProperty(key)) {
                paramsData.push(key + '=' + _params[key]);
            }
        }
        const result = paramsData.join('&');
        return result;
    }


    // md5 加密
    md5(str) {
        var crypto_md5 = crypto.createHash("md5");
        crypto_md5.update(str);
        return crypto_md5.digest('hex');
    }

    async translate(word) {
        let encodeURIWord = word;
        if (this.from == 'zh' || this.from == 'zh-CHS') {
            // 中文需要进行uri编码
            encodeURIWord = encodeURI(word)
        }
        let sign = this.md5(this.appKey + word + this.salt + this.secretKey);
        let params = {
            q: encodeURIWord,        // 中文或英文
            from: this.from,
            to: this.to,
            salt: this.salt,
            sign: sign
        }
        if (this.type) {
            params.appid = this.appKey;
        } else {
            params.appKey = this.appKey;
        }
        const url = this.url + '?' + this.generateUrlParams(params);
        const result = await request.get({
            url
        });
        return result
    }

}

module.exports = Translator;
//export default Translator