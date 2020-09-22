require('es6-promise');
const fs = require('fs');
const client = require('../module/ocr/OcrClient');

const timeout = (promise, ms) => new Promise((resolve, reject) => {
    setTimeout(() => {
        promise.then(resolve, reject);
    }, ms);
});


const imgOcr = imgPath => {
    const image = fs.readFileSync(imgPath).toString('base64');
    return new Promise((resolve, reject) => {
        client.accurateBasic(image).then(function (result) {
            if (result.words_result) {
                return resolve(wordsHandler(result.words_result))
            }
            return reject('OCR 失败！');
        }).catch(function (err) {
            // 如果发生网络错误
            return reject(err);
        });
    })
};

// async function imgOcr(imgPath) {
//     const image = fs.readFileSync(path).toString("base64");
//     const words = await client.accurateBasic(image);
//     return wordsHandler(words);
// }

module.exports = {
    imgOcr
}


