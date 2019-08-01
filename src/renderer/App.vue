<template>
  <div id="app">
    <router-view></router-view>

<!--    <div v-if="isWalletLocked">-->
<!--      &lt;!&ndash; Unprotected &ndash;&gt;-->
<!--      <password :showModal="openPassword"></password>-->
<!--      <welcome :showModal="openWelcome"></welcome>-->
<!--      <Setup :showModal="openSetup"></Setup>-->
<!--      <RestoreSeed :showModal="openRestoreSeed"></RestoreSeed>-->
<!--      <Configuration :showModal="openConfiguration"></Configuration>-->
<!--      <Register :showModal="openRegister"></Register>-->
<!--    </div>-->

    <password :showModal="openPassword"></password>
    <welcome :showModal="openWelcome"></welcome>
    <Setup :showModal="openSetup"></Setup>
    <RestoreSeed :showModal="openRestoreSeed"></RestoreSeed>
    <Configuration :showModal="openConfiguration"></Configuration>
    <Register :showModal="openRegister"></Register>

  </div>
</template>

<script>
  import { messageBus } from '@/messagebus'

  //modules

  import Setup from '@/components/Setup'
  import Welcome from '@/components/Welcome'
  import DisplaySeed from '@/components/DisplaySeed'
  import RestoreSeed from '@/components/RestoreSeed'
  import Configuration from '@/components/Configuration'
  import Register from "@/components/Register";
  import Password from '@/components/Password'

  //require
  const {ipcRenderer} = require('electron')

  export default {
    name: 'fomobot',
    components: {
      Setup,
      Welcome,
      Configuration,
      RestoreSeed,
      DisplaySeed,
      Register,
      Password,
    },
    data(){
      return {
        isWalletLocked:true,
        openConfiguration: true,
        openDisplaySeed: false,
        openRestoreSeed: false,
        openWelcome: false,
        openCheckPublic: false,
        openSetup: false,
        openCheckPrivate: false,
        openRegister: false,
        openPassword: false,
        openReceive: false,
        openHttpReceive:false,
        openFileSend: false,
        openFinalize: false,
        openHedwigV1: false,
        openCheck: false,
        openLang:false,
        openGnode:false,
      }
    },
    created () {
      try{
        //Modals

        //open
        messageBus.$on('open', (window)=>{
          if(window =='windowConfiguration'){
            this.openConfiguration = true
          }
        })

        //close
        messageBus.$on('close', (window)=>{
          if(window =='windowDisplaySeed'){
            this.openConfiguration = false
          }
        })

      }catch(e){
        this.$log.error(e)
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
