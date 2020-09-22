const fs = require('fs');
const path = require('path');
const client = require('./OcrClient');

// 通用文字识别（高精度版）     图片已经编码
function execOrc(image) {
    return new Promise((resolve, reject) => {
        client.accurateBasic(image).then(result = {
            return resolve(result);
        }).catch(err => {
            // 发生网络错误
            return reject(err);
        });
    });
}

// 通用文字识别（高精度版）     图片未编码，参数为图片地址
function exeOrcByImgPath(imgPath) {
    const image = fs.readFileSync(imgPath).toString('base64');
    return new Promise((resolve, reject) => {
        client.accurateBasic(image).then(result = {
            return resolve(result);
        }).catch(err = {
            // 发生网络错误
            return reject(err);
        });
    });
}

module.exports = {
    execOrc,
    exeOrcByImgPath
}