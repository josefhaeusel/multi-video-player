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
  log.info("Creating Window");
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hidden',
  
  });

  mainWindow.setAlwaysOnTop(true, 'normal');
  mainWindow.setMenuBarVisibility(false)

  const startUrl = path.join(app.getAppPath(), 'public', 'index.html');
  mainWindow.loadFile(startUrl);
  mainWindow.show();

  // Open the DevTools (optional)
  // mainWindow.webContents.openDevTools();
}

async function startNestServer(callback) {
  const backendUrl = path.join(app.getAppPath(), 'backend', 'dist', 'main.js');
  let nodePath = '/Program Files/nodejs/node';

  if (process.platform == 'darwin') {
    nodePath = 'node';
  }
  log.info(nodePath);

  // Kill existing process using backendUrl
  exec(`pkill -f '${backendUrl}'`);

  nestServer = exec(`"${nodePath}" "${backendUrl}"`, (err, stdout, stderr) => {
    if (err) {
      log.info(`Error: ${err}`);
      return;
    }
    log.info(`stdout: ${stdout}`);
    log.error(`stderr: ${stderr}`);
  });

  nestServer.stdout.on('data', (data) => {
    log.info(data);

    if (data.includes('Nest application successfully started')) {
      callback();
    }
  });
}

app.whenReady().then(() => {
  startNestServer(createWindow);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async (event) => {
  event.preventDefault();

  exec('netstat -ano | findstr :3000', (err, stdout, stderr) => {
    if (err) {
      log.error(`Error executing command: ${err}`);
      app.quit();  // Ensure the app quits even if the command fails
      return;
    }

    const lines = stdout.trim().split('\n');
    const pids = new Set();

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 4) {
        const pid = parts[4];
        pids.add(pid);
      }
    });

    if (pids.size === 0) {
      log.info("No processes found on port 3000.");
      app.quit();
      return;
    }

    let killCount = 0;

    pids.forEach(pid => {
      exec(`taskkill /PID ${pid} /F`, (killErr, killStdout, killStderr) => {
        if (killErr) {
          log.error(`Error killing process ${pid}: ${killErr}`);
        } else {
          log.info(`Killed process with PID: ${pid}`);
        }

        killCount++;
        log.warn("killCount", killCount, "pids.size", pids.size)
        if (killCount == pids.size) {
          log.info("QUITTING APP")
          app.exit();
        }
      });
    });
  });

  log.info("Attempted to kill processes on port 3000 before quitting.");
});
