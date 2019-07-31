let TAG = " | Config | "
const VERSION = 1.0
var fs = require('fs');
import path from 'path';
import { app, remote } from 'electron';
import os from 'os'
const mkdirp = require('mkdirp');

let appRootDir = require('app-root-dir').get().replace('app.asar', '').replace(/(\s+)/g, '\\$1');
export const rootDir = require('app-root-dir').get()

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





export const releaseUrl = 'https://api.github.com/repos/BitHighlander/fomobot/releases/latest'
export const downloadUrl = 'https://github.com/BitHighlander/fomobot/releases/latest'

//innit


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



function getLocale(){
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
