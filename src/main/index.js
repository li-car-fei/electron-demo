import { app, BrowserWindow } from 'electron'
import path

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      //preload: __dirname + '/preload.js'
    }
  })

  // 然后加载应用初始url
  mainWindow.loadURL(winURL)

  // 打开开发者工具
  //win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 初始化后创建window
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


// // 定义pdfRead窗体
// let PdfWindow
// // 创建calendar窗口方法
// function openPdfWindow(url) {
//   PdfWindow = new BrowserWindow({
//     width: 400,
//     height: 550,
//     parent: mainWindow, // 主窗口
//     webPreferences: {
//       nodeIntegration: true
//     }
//   })
//   PdfWindow.loadURL(winURL + '#/Calendar')
//   PdfWindow.on('closed', () => { PdfWindow = null })
// }
// ipcMain.on('openPdfWindow', (e, arg) => {
//   console.log(arg)
//   //openPdfWindow(arg);
//   e.sender.send('Readpdf_down', 'done');
//   //openPdfWindow()
// }
// )


// 监听获取viewer.html文件位置、
function getUrl(win) {
  const filePath = process.env.NODE_ENV === 'development' ? `${__static}\\pdfjs\\web\\viewer.html` : path.resolve(__dirname, '../../../static/pdfjs/web/viewer.html')
  win.webContents.send('recieve', filePath)
}
// pdf预览获取viewer.html文件位置
ipcMain.on('getUrl', () => getUrl(win))




/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


// import { autoUpdater } from 'electron-updater'

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })

