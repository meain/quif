const ipcRenderer = require('electron').ipcRenderer
const qrcode = require('qrcode-generator')

document.getElementById('file-input').addEventListener('change', () => {
  const path = document.getElementById('file-input').files[0].path
  ipcRenderer.send('start', {
    path: path,
  })
})

ipcRenderer.on('qr', (evt, msg) => {
  const qr = qrcode(4, 'L')
  qr.addData(msg.url)
  qr.make()
  document.getElementById('qrcode').innerHTML = qr.createImgTag(10)
  document.getElementById('link').href = msg.url
  document.getElementById('link').innerHTML = msg.url
})
