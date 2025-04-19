const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-video', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: '動画ファイル', extensions: ['mp4', 'mov', 'avi'] }],
    properties: ['openFile']
  });
  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('compress-video', async (event, inputPath) => {
  const outputPath = inputPath.replace(/\.(mp4|mov|avi)$/i, '_compressed.mp4');

  const command = `ffmpeg -i "${inputPath}" -vf scale=-2:360 -vcodec libx264 -crf 34 -preset veryslow -acodec aac -ac 1 -b:a 32k "${outputPath}"`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(outputPath);
      }
    });
  });
});