<template>
	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background"></div>
		<div class="modal-card" style="width:480px;height:380px;">
			<header class="modal-card-head" style="background-color: #1e1e2f;">
				<img src="../assets/icon.png" height="50" width="50"> <h1> {{ $t("msg.welcome.title") }}</h1>

			</header>
				<section class="modal-card-body" style="height:580px; background-color: darkslateblue;">

					<div v-if=isLauguageSelected>
						<h2>{{ $t("msg.welcome.welcomeNoWallet") }}</h2>

						<div class="column">
							<a class="button is-success is-large" @click="openCreateNew">
								{{ $t("msg.new_.create") }}</a>
						</div>
						<div class="column"><a class="button is-info is-large" @click="restoreSeed">
							{{ $t("msg.new_.restore") }}</a>
						</div>

					</div>

					<div v-else=isLauguageSelected>
						<h1>{{ $t("msg.welcome.selectLanguage") }}</h1>

						<div v-bind:class="{ 'is-active': isDropdownActive }" class="dropdown">
							<div class="dropdown-trigger" @click="isDropdownActive=!isDropdownActive">
								<button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
									<span>{{lauguageSelected.name}}</span>
									<span class="icon is-small">
										<i class="fas fa-angle-down" aria-hidden="true"></i>
									</span>
								</button>
							</div>

							<div class="dropdown-menu" id="dropdown-menu">
								<div class="dropdown-content">
									<div v-for="value in languageKeys">
										<a @click="selectLanguage(value)" class="button is-large is-fullwidth">
											{{value.name}}
											<country-flag :country='value.code' size='normal'/>
										</a>
									</div>
								</div>
							</div>
						</div>

					</div>

				</section>

			<footer v-if="!isLauguageSelected"  class="modal-card-foot is-primary is-right">
				<button class="button" @click="languageConfirmed">{{ $t("msg.welcome.continue") }}</button>
			</footer>

			<footer v-if=isSettingsAvailable class="modal-card-foot is-right">
				<button class="button" @click="isSettingsAvailable = false">{{ $t("msg.welcome.exit") }}</button>
			</footer>


		</div>
	</div>


</template>

<script>

    import { messageBus } from '@/messagebus'
    //import Create from '@/components/Create'
    //import Restore from '@/components/Restore'
    import {version, getLocale, innitConfig,locale,languages,getConfig,importConfig,checkConfigs} from '../../modules/config'
    import CountryFlag from 'vue-country-flag'
    const { app } = require('electron')

    export default {
        name: "Welcome",
        components: {
            //Create,
            //Restore,
            CountryFlag
        },
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isWalletImported:false,
                isSettingsAvailable:false,
                isDropdownActive: false,
                isLauguageSelected:true,
                availableSettings:[],
                lauguageSelected:languages[0],
                languages:languages,
                languageKeys:languages,
                current:'new',
                version: version,
            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
        mounted() {
            //innitConfig('en')
			this.getState()
        },
        methods: {

            getState(){
                this.$log.info("Checkpoint 1 getState ")
                //get config state
                let configStatus = checkConfigs()
                let config = getConfig()
                this.$log.info("config: ",config)
                this.$log.info("configStatus: ",configStatus)
				if(configStatus.isConfigured){
                    this.$log.info("Checkpoint 1 wallet is configured ")
				    //is wallet?
					if(configStatus.isWallet){
                        this.$log.info("Checkpoint 2 wallet is found! ")
                        //if username
						if(configStatus.isRegistered){
                            //if wallet
                            messageBus.$emit('open', 'windowPassword');
                            this.closeModal()
						}else{
                            //if wallet
                            messageBus.$emit('open', 'windowPassword');
							//nerf register
							//messageBus.$emit('open', 'windowRegister');
                            this.closeModal()
						}
					} else {
                        this.$log.info("Checkpoint 2 wallet is NOT found! ")

					    this.isSettingsAvailable = false
					    this.isLauguageSelected = true
					}

				} else {
					innitConfig('en')
                    this.$log.info("Checkpoint 1a wallet NOT configured ")
                    //get langs
                     this.languageKeys = languages
                     this.languages = Object.keys(languages)
                     this.$log.info("languageKeys: ",this.languageKeys)
                     this.$log.info("languages: ",this.languages)

                     //default
                     this.availableSettings = []

                     //if other wallet detected offer import settings
                     if(this.availableSettings.length > 0){
                         this.$log.info("WELCOME CHECKPOINT1 Settings available for import!")
                         this.isSettingsAvailable = true

                     } else {
                         this.$log.info("WELCOME CHECKPOINT1 No Settings available")
                         //guess local
                         let local = getLocale()
                         this.$log.info("local: ",local)
                         this.lauguageSelected = local
                         //confirm local

                     }
				}



                //if no config
                //offer language

                //save
            },
            async languageConfirmed(){
                this.$log.info("confirm selectLanguage ")

                //init config
                //await innitConfig(this.lauguageSelected)

                this.isDropdownActive = false
                //let local = getLocale()
                this.$log.info("locale: ",locale)
                this.$log.info("value: ",this.lauguageSelected.code)

                if(locale !== this.lauguageSelected.code){
                    alert( this.$t("msg.changeLanguage") )
                    process.exit(0)
                } else {
                    innitConfig('en')
                    this.lauguageSelected = true
                    this.getState()
				}
            },
            selectLanguage(value){
                this.$log.info("Checkpoint selectLanguage ")
                this.lauguageSelected = value
			},
            selectImport(item){
                this.$log.info("selected import: ",item)
				//
                let success = importConfig(item)
                this.$log.info("success import settings: ",success)
                this.isSettingsAvailable = false
				if(success.isWallet){
				    //imported wallet!
					alert("imported wallet from "+item+"!")
					this.getState()
				}
				// if(success){
				//     this.getState()
				// 	this.isSettingsAvailable = false
				// }
			},
            away() {
                this.isDropdownActive = false;
            },
            closeModal() {
                messageBus.$emit('close', 'windowWelcome');

            },
            restoreSeed() {
                messageBus.$emit('close', 'windowWelcome');
                messageBus.$emit('open', 'windowRestoreSeed');

            },
            openCreateNew() {
                messageBus.$emit('open', 'windowSetup');
                messageBus.$emit('close', 'windowWelcome');

            },
        }
    }
</script>
<style>
	.center{
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.dropdown-content {
		max-height: 13em;
		overflow: auto;
	}
</style>
