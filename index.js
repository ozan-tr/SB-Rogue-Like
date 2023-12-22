
const { app, BrowserWindow ,ipcMain} = require('electron')
const fs = require("fs/promises");
const path = require('node:path')
const {glob} = require("glob");

const date = formatDate(new Date())
const logFile = path.join(__dirname, '/logs/'+date+".log")



fs.writeFile(logFile,"").catch((err) => {
  if (err.code !== "EEXIST") throw err;
});

console.log("logging under "+logFile)

app.commandLine.appendSwitch('log-file', logFile);
app.commandLine.appendSwitch('enable-logging');


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    name: 'SBRogueLıke',
    autoHideMenuBar: true,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
  })

  mainWindow.loadFile("index.html")

}
async function getScripts(){
  return await glob('assets/js/**/*.js', { ignore: ['assets/js/loader.js',"assets/js/debugMode.js"] })
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
  ipcMain.handle('getVersion', () => app.getVersion());

  createWindow()



})

app.on('activate', () => {  
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}



