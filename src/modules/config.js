let TAG = " | Config | "
const VERSION = 1.0
var fs = require('fs-extra');
import path from 'path';
import { app, remote } from 'electron';
import os from 'os'
const mkdirp = require('mkdirp');

let appRootDir = require('app-root-dir').get().replace('app.asar', '').replace(/(\s+)/g, '\\$1');
export const rootDir = require('app-root-dir').get()


function getPlatform(){
    switch (os.platform()) {
        case 'aix':
        case 'freebsd':
        case 'linux':
        case 'openbsd':
        case 'android':
            return 'linux';
        case 'darwin':
        case 'sunos':
            return 'mac';
        case 'win32':
            return 'win';
    }
}

export const platform = getPlatform()

const IS_PROD = process.env.NODE_ENV === 'production';
const root = process.cwd();
const APP = process.type === 'renderer' ? remote.app : app

const binariesPath =
    IS_PROD || APP.isPackaged
        ? path.join(process.resourcesPath, 'bin', platform)
        : path.join(root, 'resources', 'bin', platform);


//Language Settings

export const  languageList = [
    'English',
    '简体中文', //Mandrin
    'русский', //Russian
    'español'  //Spanish
]

export const  languages = [
    {
        name:'English',
        code:'en',
        english:'English'
    },
    {
        name:'简体中文',
        code:'zh',
        english:'Chinese'
    },
    {
        name:'русский',
        code:'ru',
        english:'russian'
    },
    {
        name:'español',
        code:'es',
        english:'Spanish'
    }
]

//configs config
export const fomoConfig = path.join(APP.getPath('home'), '.fomobro','fomobro.json')
export const configPath = path.join(APP.getPath('home'), '.fomobro','fomobro.json')
export const seedPath = path.join(APP.getPath('home'), '.fomobro', 'wallet_data/wallet.seed')
export const seedDir = path.join(APP.getPath('home'), '.fomobro', 'wallet_data')
export const fomoPath = path.join(APP.getPath('home'), '.fomobro')
export const modelfile = path.join(APP.getPath('home'), '.fomobro','temp.f31a7cc608612a8e910a666a94ae391023dd18d132d2d95ea39526fd0d5a7686-20190820_041537+0000.json')
export const logDir = path.join(fomoPath, 'log')

//ai dirs
export const fomoTrain = path.join(APP.getPath('home'), '.fomobro')

export const releaseUrl = 'https://api.github.com/repos/BitHighlander/fomobot/releases/latest'
export const downloadUrl = 'https://github.com/BitHighlander/fomobot/releases/latest'

//innit
export function innitConfig(languageSelected){
    let tag = TAG + " | importConfig | "
    try{
        let output = {}
        console.log(tag,"CHECKPOINT innitConfig")
        console.log(tag,"fomoPath: ",fomoPath)
        console.log(tag,"seedDir: ",seedDir)

        mkdirp(fomoPath, function (err) {
            if (err) console.error(err)
            else console.log('created: ',fomoPath)
        });

        mkdirp(logDir, function (err) {
            if (err) console.error(err)
            else console.log('created: ',logDir)
        });


        mkdirp(seedDir, function (err) {
            if (err) console.error(err)
            else console.log('seedDir: ',seedDir)
        });


        console.log(tag," innit config checkpiont 2")

        let config = {}
        config.locale = languageSelected.code
        config.localeSelected = true
        config.version = VERSION

        fs.writeFileSync(fomoConfig,JSON.stringify(config))

    }catch (e) {
        console.error(tag,"e: ",e)
        return {}
    }
}


//innit Wallet
export function initWallet(encryptedSeed,passwordHash){
    let tag = TAG + " | initWallet | "
    try{

        mkdirp(seedDir, function (err) {
            if (err) console.error(err)
            else console.log('seedDir: ',seedDir)

            let output = {}
            console.log(tag,"CHECKPOINT innitConfig")
            console.log(tag,"encryptedSeed: ",encryptedSeed)


            let wallet = {}
            wallet.hash = passwordHash
            wallet.version = 1
            wallet.type = "seedwords"
            wallet.vault = encryptedSeed

            let result = fs.writeFileSync(seedPath,JSON.stringify(wallet))
            console.log("result: ",result)
        });



    }catch (e) {
        console.error(tag,"e: ",e)
        return {}
    }
}

//check
export function checkConfigs(){
    let output = {}
    output.isConfigured = false
    output.isWallet = false
    output.isRegistered = false

    let fileFound = fs.existsSync(fomoConfig)?true:false
    if(fileFound){
        output.config = JSON.parse(fs.readFileSync(configPath))
        if(output.config.version) output.isConfigured = true
        if(output.config.username) output.isRegistered = true
    }

    if(output.config  && output.config.version )output.isConfigured = true

    //wallet found?
    let walletFound = fs.existsSync(seedPath)?true:false
    if(walletFound){
        output.isWallet = true
    }

    return output
}

export function getWallet(){
    try{
        return fs.readFileSync(seedPath)
    }catch (e) {
        return {}
    }
}

export function getConfig(){
    try{
        return JSON.parse(fs.readFileSync(configPath))
    }catch (e) {
        return {}
    }
}

export function setConfig(options){
    return fs.writeFileSync(configPath, JSON.stringify(options))
}

export function updateConfig(options){
    let options_ = getConfig()
    for(var key in options){
        options_[key] = options[key]
    }
    setConfig(options_)
}

//export const logLevel = getConfig()['debug']?'debug':'info'
export const logLevel = 'debug'

export function getLocale(){
    let locale = getConfig()['locale']
    if(locale)return locale
    locale = APP.getLocale().toLowerCase()
    if(locale.startsWith('zh'))return 'zh'
    if(locale.startsWith('ru'))return 'ru'
    return 'en'
}

export function setLocale(locale){
    updateConfig({'locale':locale})
}
export const locale = getLocale()

import pkg from '../../package.json'
export const version = pkg.version
