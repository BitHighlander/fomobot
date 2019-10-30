
import { app, BrowserWindow } from 'electron'
const {ipcMain} = require('electron')


//import train from "../modules/train"
// import simulate from "../modules/simulations"
// import backfill from "../modules/backfill"

//run as node.js
//let train = require("../modules/train")
//let backfill = require("../modules/backfill")

//TODO Start influxDB

//TODO get db size

//get hdd space

import log from '../modules/logger'
import {exec} from "child_process";




/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)
  mainWindow.openDevTools({mode: 'detach'})
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

function createMenu() {
  const application = {
    label: "Application",
    submenu: [
      {
        label: "About Application",
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        type: "separator"
      },
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo:"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo:"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit()
        }
      }
    ]
  }

  const template = [
    application,
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

/*
    Bot tools

    Training
    Trading


 */

ipcMain.on('quit', (event) => {
  app.quit()
})

ipcMain.on('start-bitmex-sockets', (event, arg) => {
  let tag = TAG + " | start-bitmex-sockets | "
  try{
    //
    log.info(tag,"********************* START")


    // client.addStream('XBTUSD', 'trade', function (data, symbol, tableName) {
    //   // Do something with the table data...
    //   console.log(data, symbol, tableName)
    //
    //
    //   //console.log("data: ",data)
    //   //console.log("tableName: ",tableName)
    //   //console.log("data: ",data.length)
    //
    //   let clean = []
    //   for(let i = 0; i < data.length; i++){
    //     let tradeInfo = data[i]
    //
    //     //console.log("tradeInto: ",tradeInfo)
    //
    //     //let price
    //     let price = tradeInfo.price
    //     let amount = tradeInfo.size
    //     // console.log("price: ",price)
    //     // console.log("amount: ",amount)
    //
    //     let normalized = {}
    //     normalized.trade_id = tradeInfo.trdMatchID
    //     normalized.time = new Date(tradeInfo.timestamp).getTime()
    //     normalized.unix = new Date(tradeInfo.timestamp).getTime()
    //     normalized.size = tradeInfo.size
    //     normalized.side = tradeInfo.side
    //     normalized.price = tradeInfo.price
    //     clean.push(normalized)
    //     event.returnValue = normalized
    //   }
    //
    // });



  }catch(e){
    console.error(e)
  }
})


ipcMain.on('bot', async (event,type,payload) => {
  try{
    log.debug("Checkpoint IPC: ")

    log.debug("event: ",event)
    log.debug("type: ",type)
    log.debug("payload: ",payload)

    let work
    switch (type) {
      case "trade":
        log.info("checkpoint TRADE ***** ")
        //work = await train.train(event)

        //TODO save results

        break;
      case "backfill":
        // log.info("checkpoint BACKFILL ***** ")
        // work = await backfill.backfill(event)
        // log.info("result work ***** ",work)
        //TODO save results

        break;
      case "train":
        log.info("checkpoint TRAIN ***** ")
        //work = await train.train(event)

        //TODO save results

        break;
      case "simulate":
        log.info("checkpoint SIMULATE ***** ")
        //work = await simulate.simulate(event)

        break;
      default:
        log.error("Unknown event! ",type)
        break
    }
    log.debug("work: ",work)

    //let work = await train.train(event)
    //let work = await simulate.simulate(event)
    //log.debug("work: ",work)

    //TODO update results!
    //event.sender.send("bot",work)

  }catch(e){
    log.error(e)
  }
})
