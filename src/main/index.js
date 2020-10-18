import { app, BrowserWindow, globalShortcut } from 'electron'
const { ipcMain } = require('electron')

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

function createWindow() {                 // 新建窗口并且打开
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + '/preload.js'
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


/**
 * 调用第三方exe实现截图功能
 */
const path = require('path');
const fs = require("fs");
const { execFile } = require('child_process');
const { clipboard, dialog, shell } = require('electron');
const isDevelopment = process.env.NODE_ENV !== "production";
let screenWindow = () => {
  //console.log('__dirname', __dirname)
  let url = path.resolve(__dirname, "../extraResources/PrintScr.exe");    // 打包后的第三方exe存放地址
  if (isDevelopment && !process.env.IS_TEST) {
    // 生产环境
    url = path.join(__dirname, '../../extraresource/PrintScr.exe');        // 生产环境的 __dirname 是 src\main
  }
  let screen_window = execFile(url);
  screen_window.on('exit', async (e) => {
    if (e) {
      console.log(e);
      const result = await dialog.showOpenDialog({
        // 选择保存截图的文件夹
        properties: ["openFile", "openDirectory"],
        title: "请选择保存截图的位置",
      });
      if (!result) {
        return console.log("cancel");
      }
      let screenshotPath = result[0];         // 存截图的地址
      screenshotPath = path.join(screenshotPath, "screenshot.png");
      fs.writeFile(screenshotPath, clipboard.readImage().toPNG(), function (      // 从剪贴板把数据写入截图地址
        error
      ) {
        if (error) return console.log(error);
        shell.openExternal("file://" + screenshotPath);             // 打开截图
      });
    }
  })

}
function pluginScreenShots() {        // 触发截图工具以及相关快捷键
  globalShortcut.register('ctrl+shift+a', () => {     // 快捷键绑定
    screenWindow()
  });
  ipcMain.on('Capture', () => {       // 监听组件
    screenWindow()
  })
}


/**
 * 打开pdf信号的监听        以及打开pdf
 */
const PDFWindow = require('electron-pdf-window')
function PDFReader(url) {             // 打开 pdf read
  const win = new PDFWindow({
    width: 800,
    height: 600
  });
  win.loadURL(url)
}
function PDFReady() {
  ipcMain.on('openPdfWindow', (e, arg) => {               // 监听打开pdf
    PDFReader(arg)
    e.sender.send('Readpdf_down', 'done');
  }
  )
}






// 初始化后创建window       绑定快捷键等
app.on('ready', () => {
  createWindow();        // 创建window
  pluginScreenShots();     // 截图监听
  PDFReady();           // 监听pdf打开信号
})

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

