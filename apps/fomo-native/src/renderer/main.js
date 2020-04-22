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
import fomoService from '../modules/fomo'
import dbService from '@/db'
import VueClipboard from 'vue-clipboard2'
import Echarts from 'vue-echarts';
import BootstrapVue from 'bootstrap-vue'
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';
import Toasted from 'vue-toasted';

//charts
import 'echarts/lib/chart/bar';
// If you want to use ECharts extensions, just import the extension package and it will work
// Taking ECharts-GL as an example:
// You only need to install the package with `npm install --save echarts-gl` and import it as follows
import 'echarts-gl'

//Vue.use(BootstrapVue)
//css assets
// app.js
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import "@/assets/sass/black-dashboard.scss";
import "@/assets/css/nucleo-icons.css";
import "@/assets/demo/demo.css";

//tabOpen
import en from '../lang/en'
import zh from '../lang/zh'
import ru from '../lang/ru'
import es from '../lang/es'

//require
//let nalytics = require('forex-analytics-fomo')
let VueTruncate = require('vue-truncate-filter')

let Options = {
  // or you can pass an object
  icon : {
    name : 'watch',
    after : true // this will append the icon to the end of content
  }
}

Vue.use(Toasted, Options)

import Card from './components/Cards/Card.vue';

//Super
Vue.use(BootstrapVue)
Vue.component('chart', Echarts);
Vue.component('card', Card);
Vue.use(VueClipboard)
Vue.use(Donut);
Vue.botService = Vue.prototype.$botService = botService
Vue.walletService = Vue.prototype.$walletService = walletService
Vue.fomoService = Vue.prototype.fomoService = fomoService
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
