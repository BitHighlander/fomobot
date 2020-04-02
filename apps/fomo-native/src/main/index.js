/**
 * Fomobot Main Process
 *
 * @Author Highlander (GitHub: BitHighlander)
 */
let TAG = " | MAIN | "
import log from '../modules/logger'
import {exec} from "child_process";
import {app, BrowserWindow} from 'electron'

const BitmexAPIPublicClient = require('bitmex-websocket');
const {ipcMain} = require('electron')
const io = require('socket.io-client');
let wait = require('wait-promise');
let sleep = wait.sleep;

//
let bot = require("@fomobro/fomobot")

const db = require('monk')('localhost/zenbot4')
const tradesDB = db.get('trades')

console.log("**** NODE VERSION: ", process.version);

//import train from "../modules/train"
// import simulate from "../modules/simulations"
// import backfill from "../modules/backfill"

//run as node.js
//let train = require("../modules/train")
//let backfill = require("../modules/backfill")

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

function createWindow() {
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

ipcMain.on('quit', (event) => {
    app.quit()
});

// Subscribe to FomoBro IPC
ipcMain.on('sub-fomo-ws', async (event, arg) => {
    let tag = TAG + " | sub-fomo-ws | ";
    event.returnValue = 'pong';

    try {
        let engine = await bot.init("ta_ultosc");
        await sleep(4000);

        // Load Historical Trades
        //let allTrades = await tradesDB.find({selector:"bitmex.BTC-USD"},{limit:200,sort:{time:-1}})
        //bot.load(allTrades)

        // Send a BuySignal
        let message = { signal: "buy" };
        event.sender.send("signal", message)

        engine.on('events', function (message) {
            event.sender.send("trades", message)
        });

        BitmexAPIPublicClient((socket) => {
            console.log("Initializing BitmexAPIPublic WebSocket...")
            socket.send('{"op": "subscribe", "args": ["trade:XBTUSD"]}');

            socket.on('message', function(message) {
                const obj = JSON.parse(message);
                console.log('Message received:', obj);
                bot.load(obj.trades);
                event.sender.send("trades", obj);
            });
        });
    } catch (e) {
        log.error(tag, e)
    }
});

ipcMain.on('bot', async (event, type, payload) => {
    try {
        log.debug("Checkpoint IPC: ")
        log.debug("event: ", event)
        log.debug("type: ", type)
        log.debug("payload: ", payload)

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
                log.error("Unknown event! ", type)
                break
        }
        log.debug("work: ", work)

        //let work = await train.train(event)
        //let work = await simulate.simulate(event)
        //log.debug("work: ",work)

        //TODO update results!
        //event.sender.send("bot",work)

    } catch (e) {
        log.error(e)
    }
})
