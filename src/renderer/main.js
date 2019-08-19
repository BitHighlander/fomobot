import Vue from 'vue'
import axios from 'axios'
import 'bulma/css/bulma.css'
import 'animate.css/animate.css'
import { remote, ipcRenderer} from 'electron'
import VueI18n from 'vue-i18n'
import log from '../modules/logger'
import App from './App'
import store from './store'
import walletService from '../modules/wallet'
import botService from '../modules/fomobot'
import SortedTablePlugin from "vue-sorted-table";
//import fomoService from '../modules/fomo'
import dbService from '@/db'
import VueClipboard from 'vue-clipboard2'
import BootstrapVue from 'bootstrap-vue'

//Vue.use(BootstrapVue)
//css assets
// app.js
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import "@/assets/sass/black-dashboard.scss";
import "@/assets/css/nucleo-icons.css";
import "@/assets/demo/demo.css";

//tabOpen
import en from '../lang/en'
import zh from '../lang/zh'
import ru from '../lang/ru'
import es from '../lang/es'

//require
let nalytics = require('forex-analytics-fomo')
let VueTruncate = require('vue-truncate-filter')

Vue.use(VueClipboard)
Vue.botService = Vue.prototype.$botService = botService
Vue.walletService = Vue.prototype.$walletService = walletService
//Vue.walletService = Vue.prototype.fomoService = fomoService
Vue.dbService = Vue.prototype.$dbService = dbService
Vue.use(VueI18n)
Vue.log = Vue.prototype.$log = log
Vue.use(SortedTablePlugin, {
  ascIcon: '<i class="material-icons">arrow_drop_up</i>',
  descIcon: '<i class="material-icons">arrow_drop_down</i>'
});

const messages = {
  en,
  ru,
  zh,
  es,
}

import {locale} from '../modules/config'
const i18n = new VueI18n({
  locale: locale,
  //locale: 'es',
  messages
})

remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})

Vue.use(VueTruncate)
Vue.use(require('vue-moment'))

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>',
  i18n
}).$mount('#app')

import { messageBus } from '@/messagebus'

ipcRenderer.on('before-quit', ()=>{
  log.debug('Render got msg is about to quit.')
  messageBus.$emit('quit')
  walletService.stopAll()
})
