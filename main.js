const { app, BrowserWindow, ipcMain } = require('electron')
const spawn = require('child_process').spawn
const eapp = require('express')()
const ip = require('ip')

const port = 7878
let win
let server

function createWindow() {
  win = new BrowserWindow({ width: 500, height: 630 })
  win.loadFile('index.html')
  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

const createListener = () => {
  if (server) server.close()
  server = eapp.listen(port, () => {
    const url = `http://${ip.address()}:${port}`
    console.log('url:', url)
    win.webContents.send('qr', { url })
  })
}

const routeHandler = path => {
  eapp.get('*', (req, res) => {
    res.set('Content-Disposition', `attachment;filename=${path}`)
    res.set('Content-Type', 'application/octet-stream')
    res.download(path)
  })

  createListener()
}

ipcMain.on('start', (evt, msg) => {
  routeHandler(msg.path)
})
