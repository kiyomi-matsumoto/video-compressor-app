const { ipcRenderer } = require('electron');

const selectBtn = document.getElementById('selectBtn');
const compressBtn = document.getElementById('compressBtn');
const selectedPath = document.getElementById('selectedPath');
const result = document.getElementById('result');

let videoPath = '';

selectBtn.addEventListener('click', async () => {
  const path = await ipcRenderer.invoke('select-video');
  if (path) {
    videoPath = path;
    selectedPath.textContent = `選択された動画: ${path}`;
    compressBtn.disabled = false;
  }
});

compressBtn.addEventListener('click', async () => {
  result.textContent = '圧縮中...しばらくお待ちください';
  try {
    const outputPath = await ipcRenderer.invoke('compress-video', videoPath);
    result.textContent = `圧縮完了: ${outputPath}`;
  } catch (error) {
    result.textContent = `エラー: ${error}`;
  }
});