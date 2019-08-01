<template>
  <section class="hero is-link is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-centered">
          <div v-if="walletCreated" class="column is-10" >

            <h1 class="title">{{ $t('msg.create.seedPhrase') }}</h1>

              <p class="animated bounce has-text-weight-semibold has-text-warning" style="animation-iteration-count:3">
                {{ $t('msg.create.backupNote') }}
              </p>

              <br/>
<!--              <div class="tags are-medium">-->
<!--                <span class="tag" v-for="seed in seeds">{{seed}}</span>-->
<!--              </div>-->
<!--              -->

            <ol>
              <li v-for="item in seeds">
                {{ item }}
              </li>
            </ol>

            <a class="button is-link is-inverted is-outlined" @click="finish">{{ $t('msg.create.backupFinish') }}</a>
          </div>

          <div v-else class="column is-8" >
            <img src="../assets/logo.png" style="width:64px" class="is-pulled-left">
            <h2 class="title" style="margin-top: 24px; margin-left:70px" >{{ $t("msg.title") }}
              <span style="font-size:0.75rem">v{{version}}</span>
            </h2>
            <div class="message is-warning is-small">
              <div class="message-header">
                <p>{{ $t("msg.welcome.title") }}</p>
              </div>
              <div class="message-body">
                <p>{{ $t("msg.create.toNewMsg") }}</p>
              </div>
            </div>

            <form class="box">
              <!--<div class="field has-text-centered">
                <img src="../assets/icon.png">
              </div>-->
              <div class="field">
                <label class="label">{{ $t('msg.Password') }}</label>
                  <div class="control">
                    <input class="input" type="password" placeholder="********" required
                      :class="{'is-warning': error}" v-model="password">
                  </div>
                </div>
                <div class="field">
                <label class="label">{{ $t('msg.passwordAgain') }}</label>
                  <div class="control">
                    <input class="input" type="password" placeholder="********" required
                      :class="{'is-warning': error}" v-model="password2">
                  </div>
                  <p class="help is-warning" v-if="error">{{errorInfo}}</p>
                </div>

                <div class="field">
                  <button class="button is-link" @click.prevent="create" v-bind:class="{'is-loading':walletCreating}">
                    {{ $t('msg.create.newWallet') }}
                  </button>
                  <button class="button is-text" @click="back">{{ $t("msg.back") }}</button>

                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { messageBus } from '@/messagebus'
const { exec } = require('child_process')
import {version} from '../../modules/config'

export default {
  name: "create",
  data() {
    return {
      password: "", 
      password2: "",

      walletCreated: false,
      walletCreating: false,
      error: false,
      errorInfo: '',
      seeds: [],
      version: version
    }
  },
  created(){
    messageBus.$on('walletCreated', (seed)=>{
      this.$log.debug('create.vue got walletCreated event.')
      this.$walletService.initClient()
      this.walletCreating= false
      this.walletCreated = true
      this.seeds = seed.split(' ')
    })
    messageBus.$on('walletCreateFailed', (err)=>{
      this.error = true
      this.errorInfo = this.$t('msg.create.errorCreateFailed')
      this.clearup()
    })
  },
  methods: {
    closeModal() {
      messageBus.$emit('close', 'windowCreate');
      this.clearup()
    },
    create(){
      if(this.walletCreating){
        return
      }
      this.resetErrors()
      if(this.password.length == 0 ){
        this.error = true
        this.errorInfo = this.$t('msg.create.errorPasswdEmpty')
        return
      }
      if(this.password != this.password2 ){
        this.error = true
        this.errorInfo = this.$t('msg.create.errorPasswdConsistency')
        return
      }
      this.walletCreating = true
      this.$walletService.new(this.password)
    },
    finish(){
      this.clearup()
      messageBus.$emit('walletCreateFinished')
      this.closeModal()
    },
    resetErrors(){
      this.error = false;
    },
    clearup(){
      this.password = ""
      this.password2 = ""
      this.walletCreating = false
      this.error = false,
      this.errorInfo = ''
    },
    back(){
      this.clearup()
      messageBus.$emit('backToNew')
    }
    
  }
}
</script>

<style>
  ol {
    list-style: none;
    counter-reset: my-awesome-counter;
  }
  ol li {
    counter-increment: my-awesome-counter;
  }
  ol li::before {
    content: counter(my-awesome-counter) ". ";
    color: red;
    font-weight: bold;
  }


  ol {
    margin: 0 0 30px 20px;
    columns: 4;
    -webkit-columns: 4;
    -moz-columns: 4;
    column-gap: 30px;
    -webkit-column-gap: 30px;
    -moz-column-gap: 30px;
  }

  ol li {
    margin: 0 0 10px 0;
  }
</style>
