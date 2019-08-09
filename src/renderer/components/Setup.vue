<template>
	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background"></div>
		<div class="modal-card" style="height:840px; width:420px">
			<header class="modal-card-head" style="background-color: #1e1e2f;">
				{{ $t("msg.create.title") }}

			</header>
			<section class="modal-card-body" style="height:380px;background-color: darkslateblue;">

				<div class="columns is-mobile is-centered ">
					<div v-if="walletCreated" class="column is-10" >

						<p class="animated bounce has-text-weight-semibold has-text-warning" style="animation-iteration-count:3">
							{{ $t('msg.create.backupNote') }}
						</p>

						<br/>
<!--						<div class="tags are-medium">-->
<!--							<span class="tag" v-for="seed in seeds">{{seed}}</span>-->
<!--						</div>-->

						<h3>
						<ol class='rows'>
							<li v-for="item in seeds" >{{ item }}
<!--								<div class='row is-full '>{{ item }}</div>-->
							</li>
						</ol>
						</h3>
						<a class="button is-link text-white" @click="finish">{{ $t('msg.create.backupFinish') }}</a>
					</div>

					<div v-else>
						<h2 class="title text-white" style="" >{{ $t("msg.title") }}
							<span style="font-size:0.75rem">v{{version}}</span>
						</h2>

						<form>
							<!--<div class="field has-text-centered">
							  <img src="../assets/icon.png">
							</div>-->
							<div class="field">
								<label class="label text-white">{{ $t('msg.password') }}</label>
								<div class="control">
									<input class="input" type="password" placeholder="********" required
										   :class="{'is-warning': error}" v-model="password">
								</div>
							</div>
							<div class="field">
								<label class="label text-white">{{ $t('msg.passwordAgain') }}</label>
								<div class="control">
									<input class="input" type="password" placeholder="********" required
										   :class="{'is-warning': error}" v-model="password2">
								</div>
								<p class="help is-warning" v-if="error">{{errorInfo}}</p>
							</div>

							<div class="field">
								<button class="button is-link text-white" @click.prevent="create" v-bind:class="{'is-loading':walletCreating}">
									{{ $t('msg.create.newWallet') }}
								</button>
								<button class="button is-text" @click="back">{{ $t("msg.back") }}</button>

							</div>
						</form>
					</div>
				</div>


			</section>
		</div>
	</div>


</template>

<script>

    import { messageBus } from '@/messagebus'
    //import Create from '@/components/Create'
    //import Restore from '@/components/Restore'
    import {version,initWallet} from '../../modules/config'
    const { exec } = require('child_process')
    import btcTools from "../../modules/btc-tools.js"
    const Cryptr = require('cryptr');
    const bcrypt = require('bcryptjs');

    export default {
        name: "Setup",
        components: {
            //Create,
            //Restore
        },
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                current:'new',
                firstTime:false,
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

        },
        beforeDestroy: function(){
            this.showModal = false
        },
        mounted() {
            //this.checkRunning()
            //this.$log.info('isfirst(login.vue)? '+isFirstTime())
            //this.firstTime = isFirstTime()
        },
        methods: {
            closeModal() {
                messageBus.$emit('close', 'windowSetup');
                this.clearup()
            },
            async create(){
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


                let seeds = await btcTools.onGetNewSeed()
                this.seeds = seeds.seed.split(" ")
                this.$log.debug('seeds: ',seeds)

                const cryptr = new Cryptr(this.password);
                const hash = bcrypt.hashSync(this.password, 10);

                //encrypt seeds
                const encryptedString = cryptr.encrypt(this.seeds);
                this.$log.debug('encryptedString: ',encryptedString)

                await initWallet(encryptedString,hash)

                //save wallet
                this.walletCreated = true

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
                messageBus.$emit('close', 'windowSetup');
                messageBus.$emit('open', 'windowWelcome');
            },
            closeModal() {
                messageBus.$emit('close', 'windowSetup');
                this.clearup()
            },
            openCreateNew() {
                messageBus.$emit('open', 'windowSetup');
                messageBus.$emit('close', 'windowWelcome');

                //this.clearup()
            },
        }
    }
</script>
<style>

	.rows{
		display: flex;
		flex-direction: column;
	}

	#odd-fix ol li {
		display: inline-block;
		width: 100%;
	}

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


	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
