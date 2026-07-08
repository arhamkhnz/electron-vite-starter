import {
  app,
  BrowserWindow,
  ipcMain,
  type IpcMainInvokeEvent,
} from 'electron/main'
import squirrelStartup from 'electron-squirrel-startup'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  ipcChannels,
  type IpcContract,
} from '../shared/ipc.js'

if (squirrelStartup) {
  app.quit()
}

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const preloadPath = path.join(currentDirectory, '../preload/index.cjs')
const rendererPath = path.join(currentDirectory, '../renderer/index.html')
const rendererDevUrl = app.isPackaged
  ? undefined
  : process.env.VITE_DEV_SERVER_URL

type PingResult = IpcContract[typeof ipcChannels.ping]['result']

function isTrustedSender(event: IpcMainInvokeEvent) {
  const senderFrame = event.senderFrame

  if (!senderFrame || senderFrame !== event.sender.mainFrame) {
    return false
  }

  const senderUrl = new URL(senderFrame.url)

  if (rendererDevUrl) {
    return senderUrl.origin === new URL(rendererDevUrl).origin
  }

  senderUrl.hash = ''
  senderUrl.search = ''

  return senderUrl.href === pathToFileURL(rendererPath).href
}

function registerIpcHandlers() {
  ipcMain.handle(ipcChannels.ping, (event, ...args): PingResult => {
    if (!isTrustedSender(event)) {
      throw new Error('Blocked IPC request from an untrusted sender')
    }

    if (args.length !== 0) {
      throw new TypeError(`Invalid arguments for ${ipcChannels.ping}`)
    }

    return 'pong'
  })
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: preloadPath,
      sandbox: true,
    },
  })

  if (rendererDevUrl) {
    void window.loadURL(rendererDevUrl)
  } else {
    void window.loadFile(rendererPath)
  }
}

app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
