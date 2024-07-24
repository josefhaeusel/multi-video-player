const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let nestServer;

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = path.join(__dirname, '..', 'public', 'index.html');
  mainWindow.loadFile(startUrl);

  // Open the DevTools (optional)
  // mainWindow.webContents.openDevTools();
}

function startNestServer(callback) {
  nestServer = exec('node ../backend/dist/main.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  nestServer.stdout.on('data', (data) => {
    if (data.includes('Nest application successfully started')) {
      setTimeout(callback, 5000); // Wait 5 seconds before calling the callback to ensure the server is fully ready
    }
  });
}

startNestServer(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    if (nestServer) nestServer.kill(); // Ensure the server is stopped when the app quits
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});