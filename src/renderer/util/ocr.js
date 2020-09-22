
function isImage(imgUrl) {
    let imageFormat = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
    imgUrl = imgUrl.toLowerCase();
    return imageFormat.some(ft => {
        return imgUrl.endsWith(ft);
    });
}

function isPdf(path) {
    let pdfFormat = '.pdf';
    return path.endsWith(pdfFormat);
}

function wordsHandler(words) {
    let text = '';
    for (let i = 0; i < words.length; i++) {
        text += words[i].words + '\n';
    }

    return text;
}

module.exports = {
    isImage,
    wordsHandler,
    isPdf
}