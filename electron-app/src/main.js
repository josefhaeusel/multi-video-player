const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const log = require('electron-log');
const { create } = require('domain');


let nestServer;

function createWindow() {

  log.info("Creating Window")
  const mainWindow = new BrowserWindow({
    // // fullscreen: true,
    width: 800,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = path.join(__dirname, '..', 'public', 'index.html');
  // const startUrl = "http://localhost:3000"
  mainWindow.loadFile(startUrl);

  // mainWindow.once('ready-to-show', () => {
  mainWindow.show()
  // })

  // Open the DevTools (optional)
  mainWindow.webContents.openDevTools();
}

async function startNestServer(callback) {
  const backendUrl = path.join(__dirname, '..', 'backend', 'dist', 'main.js');
  const nodePath = '/usr/local/bin/node';
  log.info(nodePath)

  exec(`pkill -f '${backendUrl}'`)
  nestServer = exec(`'${nodePath}' '${backendUrl}'`, (err, stdout, stderr) => {
    if (err) {
      log.info(`Error: ${err}`);
      return;
    }
    log.info(`stdout: ${stdout}`);
    log.error(`stderr: ${stderr}`);
  });

  nestServer.stdout.on('data', (data) => {
    log.info(data)

    if (data.includes('Nest application successfully started')) {
      callback()
    }

  });

}


app.whenReady().then(() => {
  startNestServer(createWindow);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
