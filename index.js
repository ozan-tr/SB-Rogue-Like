
const { app, BrowserWindow ,ipcMain} = require('electron')
const fs = require("fs/promises");
const path = require('node:path')

const {glob} = require("glob");

// Process the CSS content with PostCSS plugins

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    name: 'SBRogueLıke',
    autoHideMenuBar: true,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
  })

  mainWindow.loadFile("index.html")

}
async function getScripts(){
  return await glob('assets/js/**/*.js', { ignore: 'assets/js/loader.js' })
}

async function getCharacters(){
  return await glob('assets/img/characters/**/*.png')
}

async function getMaps(){
  return await glob('assets/img/maps/**/*.png')
}

async function getMobs(){
  return await glob('assets/img/mobs/**/*.png')
}

async function getProjectiles(){
  return await glob('assets/img/projectiles/**/*.png')
}
async function getDrops(){
  return await glob('assets/img/drops/**/*.png')
}


app.whenReady().then(() => {
  ipcMain.handle('getScripts', () => getScripts());
  ipcMain.handle('getCharacters', () => getCharacters());
  ipcMain.handle('getMaps', () => getMaps());
  ipcMain.handle('getMobs', () => getMobs());
  ipcMain.handle('getProjectiles', () => getProjectiles());
  ipcMain.handle('getDrops', () => getDrops());
  createWindow()
  app.on('activate', () => {  
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})



