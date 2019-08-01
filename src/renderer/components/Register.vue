<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head">

				<p class="modal-card-title ">{{ $t("msg.register.title") }}</p>

			</header>
			<section class="modal-card-body" style="height:380px;background-color: whitesmoke;">
			<div v-if="isPromptedVerify">
				<div v-if="isWalletVerified">

					<div class="rows">
						<div class='row is-full'>
						</div>
						<div class='row is-full'>
							{{ $t("msg.register.keypair") }}
						</div>
						<div class='row is-full'>
							<div class="control">
								<input class="input" title="signingPub: " type="text" placeholder="Text input" v-model="signingPub">
								<input class="input" title="signingPub: " type="password" placeholder="signingPub" v-model="signingPriv">
							</div>
						</div>
						<div class='row is-full'>
							{{ $t("msg.register.keypair2") }}
						</div>
						<div class='row is-full'>

						</div>
						<div class='row is-full'>
							{{ $t("msg.register.keypair3") }}
						</div>
						<div class='row is-full'>

						</div>
						<div class='row is-full'>
							<div class="field">
								<label class="label">Register Username!</label>
								<div class="control has-icons-left has-icons-right">
									<input class="input is-success" type="text" v-model="username" placeholder="Text input">
									<span class="icon is-small is-left">
						  <i class="fas fa-user"></i>
						</span>
									<span class="icon is-small is-right">
						  <i class="fas fa-check"></i>
						</span>
								</div>
								<p v-if="isAvailable" class="help is-success">This username is available</p>
								<p v-if="error" class="help is-danger">{{error}}</p>
							</div>
							<a class="button" @click="randomUsername">Random Username</a>
							<a class="button" @click="submitForm">Submit</a>
						</div>
					</div>










				</div>
				<div v-else="isWalletVerified">
					{{ $t("msg.register.verifyWallet") }}

					<textarea class="textarea" readonly>{{rawWallet}}</textarea>

					<form>
						<div class="field">
							<label class="label">{{ $t("msg.password") }}</label>
							<div class="control">
								<input class="input" type="password" placeholder="********" required
									   :class="{'is-warning': error}" v-model="password">
							</div>
							<p class="help is-warning" v-if="error">{{ $t("msg.wrongPassword") }}</p>
						</div>

						<div class="field">
							<button class="button is-link" @click.prevent="tryLogin">
								{{ $t("msg.login_") }}
							</button>
						</div>
					</form>
				</div>
			</div>
			<div v-else="isPromptedVerify">

				<div class="row is-centered">
					<div class='row is-full is-centered'>
						<div class="column is-narrow is-centered">
							<img src="../assets/icon.png" height="50" width="50" class="is-centered"> <h1> {{ $t("msg.register.found") }}</h1>

							<p class="modal-card-title ">{{ $t("msg.register.verifyWallet") }}</p>
						</div>
					</div>
					<div class='row is-full is-centered'>

					</div>
					<div class='row is-full is-centered'>
						<button class="button is-link is-centered" @click="verifyAccepted">
							{{ $t("msg.continue") }}
						</button>
					</div>
				</div>

			</div>


			</section>
		</div>
	</div>

</template>
<script>
    import service from "../../modules/diagonService.js"
    import { messageBus } from '@/messagebus'
    const harryPotterNames = require('harry-potter-names')
    import {version, grinNode, gnodeOption, getConfig, updateConfig,getWallet} from '../../modules/config'
    import btcTools from "../../modules/btc-tools.js"
    const delay = require('delay');

    export default {
        name: "Register",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isPromptedVerify:false,
                showSeed:false,
                password:'',
				seeds:[],
                rawWallet:'',
                isWalletVerified:false,
                username:'Harry Potter',
                isAvailable:false,
                signingPub:"",
                signingPriv:"",
				error:'',
				errors:[]
            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
        async mounted() {
			//wait 2 seconds for file to write


            //check config file has keys
			let config = getConfig()
            this.$log.info('config: ',config)
            this.$log.info('config: ',typeof(config))
            this.$log.info('config: ',config.username)

			if(config.username){
			    this.closeModal()
			}
        },
        methods: {
            verifyAccepted(){
                this.rawWallet = getWallet()
                this.$log.info('rawWallet: ',this.rawWallet)
                this.isPromptedVerify = true
			},
            async tryLogin(){
                this.$log.info('password: ',this.password)

				//get seed from password
                let seed = await this.$walletService.displaySeed(this.password,grinNode)
                this.$log.info('seed: ',seed)
				this.seeds = seed.seed
				//use seed to build keypair
                let btcKeys = await btcTools.onBuildWallet(seed.toString())
				console.log("btcKeys:  ",btcKeys)
				let signingPub  = btcKeys.signingPub
				let signingPriv = btcKeys.signingPriv
				console.log("signingPub:  ",signingPub)
				console.log("signingPriv:  ",signingPriv)

				this.signingPub = btcKeys.signingPub
                this.signingPriv = btcKeys.signingPriv

				//save keypair to config
				updateConfig({signingPub})
                updateConfig({signingPriv})

                this.isWalletVerified = true
            },
            closeModal() {
                messageBus.$emit('close', 'windowRegister');
            },
            randomUsername() {
                let newUser = harryPotterNames.random()
                newUser = newUser.replace(/ /g, '_');
                this.username = newUser
            },
            async checkForm(){

                //validate username
                let isValidUser = await service.isValid(this.username)
                this.$log.info('isValidUsername? ',isValidUser)
				//isTaken
				let isAvailable = isValidUser.isAvailable

                this.errors = []
				if(!isAvailable){
                    this.errors.push(this.$t('msg.register.unavailable'));
                }
                if (!this.account) {
                    this.errors.push(this.$t('msg.register.missing'));
                }
                if (!this.errors.length) {
                    return true;
                }
            },
            async submitForm() {
                let isValid = this.checkForm()
				if(isValid){
                    this.$log.info('Checkpoint register ',isValid)

				    //validate remotely
					let success = await service.register(this.username,this.signingPub,this.signingPriv)
                    this.$log.info('success register ',success)
					//if valid
					if(success.success){
                        this.$log.info('success registered! ')

						//save username to config
                        updateConfig({'username':this.username})

						//push username to messageBus
                        messageBus.$emit('successRegister');

						this.closeModal()
					} else {
                        this.$log.info('FAILED! to registered! ')
						this.username = ""
						this.error = this.$t('msg.register.fail')
					}
				}
            },
        }
    }
</script>
<style>

	.is-vertical-center {
		display: flex;
		align-items: center;
	}

	.rows{
		display: flex;
		align-items: center;
		flex-direction: column;
		position: relative;
	}

	.field-icon {
		float: right;
		margin-left: -25px;
		margin-top: -25px;
		position: relative;
		z-index: 2;
	}

	.container{
		padding-top:50px;
		margin: auto;
	}

	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
