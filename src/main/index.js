import { app, BrowserWindow } from 'electron'
const PDFWindow = require('electron-pdf-window')

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

function PDFReader(url) {             // 打开 pdf read
  const win = new PDFWindow({
    width: 800,
    height: 600
  });
  win.loadURL(url)
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


const { ipcMain } = require('electron')
ipcMain.on('openPdfWindow', (e, arg) => {               // 监听打开pdf
  PDFReader(arg)
  e.sender.send('Readpdf_down', 'done');
}
)




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

