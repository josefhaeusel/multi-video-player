const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { killPortProcess } = require('kill-port-process');

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

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  const startUrl = path.join(app.getAppPath(), 'public', 'index.html');
  mainWindow.loadFile(startUrl);
  mainWindow.show()

  // Open the DevTools (optional)
  // mainWindow.webContents.openDevTools();
}

async function startNestServer(callback) {
  const backendUrl = path.join(app.getAppPath(), 'backend', 'dist', 'main.js');
  let nodePath = '/Program Files/nodejs/node';
  
  if (process.platform == 'darwin') {
    nodePath = 'node';
  }
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

app.on('before-quit', async () => {
  await killPortProcess(3000)
  console.log("Killed Backend Port 3000 before quit.")
})