const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const log = require('electron-log');
const squirrelStartup = require('electron-squirrel-startup');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrelStartup) {
    app.quit();
}

let nestServer;

function createWindow() {

  log.info("Creating Window")
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = path.join(__dirname, '..', 'public', 'index.html');
  mainWindow.loadFile(startUrl);

  mainWindow.show()

  // Open the DevTools (optional)
  // mainWindow.webContents.openDevTools();
}

async function startNestServer(callback) {
  const backendUrl = path.join(__dirname, '..', 'backend', 'dist', 'main.js');
  const nodePath = '/Program Files/nodejs/node';
  log.info(nodePath)
    
  exec(`pkill -f '${backendUrl}'`)
    nestServer = exec(`"${nodePath}" "${backendUrl}"`, (err, stdout, stderr) => {
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
