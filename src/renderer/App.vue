<template>
	<div id="app">

		<div class="container">
			<div class="columns">
				<div class="column is-12">
					<div class="tabs help-tabs">
						<ul>
							<li :class="[ tabOpen === 'wallet' ? 'is-active' : '']"><a @click="tabOpen='wallet'">Wallet</a></li>
							<li :class="[ tabOpen === 'exchanges' ? 'is-active' : 'is-disabled']"><a @click="tabOpen='exchanges'">Exchanges</a></li>
							<li :class="[ tabOpen === 'balances' ? 'is-active' : 'is-disabled']"><a @click="tabOpen='balances'">Balances</a></li>
							<li :class="[ tabOpen === 'train' ? 'is-active' : 'is-disabled']"><a @click="tabOpen='train'">Train</a></li>
							<li :class="[ tabOpen === 'subscribe' ? 'is-active' : 'is-disabled']"><a @click="tabOpen='subscribe'">Subscribe</a></li>
							<li :class="[ tabOpen === 'settings' ? 'is-active' : 'is-disabled']"><a @click="tabOpen='settings'">Settings</a></li>
						</ul>
					</div>
					<div class="box help-content">
						<code v-if="tabOpen ==='wallet'">
							<Wallet></Wallet>
						</code>
						<code v-if="tabOpen ==='exchanges'">
							<exchanges></exchanges>
						</code>
						<code v-if="tabOpen ==='balances'">
							<p text-white>Coming Soon! </p>
						</code>
						<code v-if="tabOpen ==='train'">
							<Train></Train>
						</code>
						<code v-if="tabOpen ==='subscribe'">
							<p text-white>Coming Soon! </p>
						</code>
						<code v-if="tabOpen ==='settings'">
							<settings></settings>
						</code>
					</div>
				</div>
			</div>
		</div>

		<password :showModal="openPassword"></password>
		<welcome :showModal="openWelcome"></welcome>
		<Setup :showModal="openSetup"></Setup>
		<RestoreSeed :showModal="openRestoreSeed"></RestoreSeed>
		<Configuration :showModal="openConfiguration"></Configuration>
		<Register :showModal="openRegister"></Register>
		<Send :showModal="openSend"></Send>
		<DisplaySeed :showModal="openDisplaySeed"></DisplaySeed>
		<SetupExchange :showModal="openSetupExchange"></SetupExchange>

<!--		<div v-if="isWalletLocked">-->
<!--		<password :showModal="openPassword"></password>-->
<!--		<welcome :showModal="openWelcome"></welcome>-->
<!--		<Setup :showModal="openSetup"></Setup>-->
<!--		<RestoreSeed :showModal="openRestoreSeed"></RestoreSeed>-->
<!--		<Configuration :showModal="openConfiguration"></Configuration>-->
<!--		<Register :showModal="openRegister"></Register>-->
<!--		</div>-->

<!--		<div v-else="isWalletLocked">-->
<!--			<Send :showModal="openSend"></Send>-->
<!--		</div>-->
	</div>
</template>

<script>

    import {messageBus} from '@/messagebus'
    import checkUpdate from '../modules/updateChecker'
    import {
        downloadUrl,
        locale,
        gnodeOption,
        getConfig,
        setConfig,
        updateConfig,
        apiSecretPath,
        checkConfigs
    } from '../modules/config'
    //modules

    //modals
    import Setup from '@/components/Setup'
    import Welcome from '@/components/Welcome'
    import DisplaySeed from '@/components/DisplaySeed'
    import RestoreSeed from '@/components/RestoreSeed'
    import Configuration from '@/components/Configuration'
    import Register from "@/components/Register";
    import Password from '@/components/Password'
    import Send from '@/components/Send'
    import Receive from '@/components/Receive'
    import Train from '@/components/Train'
    import SetupExchange from '@/components/SetupExchange'

	//pages
    import Wallet from '@/components/Wallet'
    import Settings from '@/components/Settings'
    import Exchanges from '@/components/Exchanges'

    //
	import {BaseTable} from "@/components/BaseTable";

    //nav
    import Nav from '@/components/Setup'
    import Exhcnages from "./components/Exchanges";
    //pages

    //require
    const {ipcRenderer} = require('electron')

    export default {
        name: 'fomobot',
        components: {
            SetupExchange,
            Exchanges,
            Train,
            Settings,
            Wallet,
            Send,
            Receive,
            BaseTable,
            Setup,
            Welcome,
            Configuration,
            RestoreSeed,
            DisplaySeed,
            Register,
            Password,
        },
        data() {
            return {
                monitor: {
                    schedule: '* * * * *',
                    url_code: 'https://cronhub.io/random_uuid',
                },
                tabOpen: 'wallet',
                isWalletLocked: true,
                openSetupExchange: false,
				openSend: false,
                openConfiguration: false,
                openDisplaySeed: false,
                openRestoreSeed: false,
                openWelcome: false,
                openCheckPublic: false,
                openSetup: false,
                openCheckPrivate: false,
                openRegister: false,
                openPassword: false,
                openReceive: false,
                openHttpReceive: false,
                openFileSend: false,
                openFinalize: false,
                openHedwigV1: false,
                openCheck: false,
                openLang: false,
                openGnode: false,
            }
        },
        mounted() {

            /*
				Setup stages

				isRightVersion?

				do I have a grin wallet already?
				  if not, setup(welcome componiant)

				verifyPassword
				  else offer new wallet

				do I have a config file?
				  Should always

				does config file have a username?
				  else register



			 */

            this.$log.info("checkpoint 1 mounted")

            //this.checkNewVersion()
            //this.$log.info("checkpoint 2 passed version check")

            //detect configs
            this.loadConfig()

        },
        created() {
            try {

                //Modals

                //open
                messageBus.$on('open', (window) => {
                    if (window == 'windowSetupExchange') {
                        this.openSetupExchange = true
                    }
                    if (window == 'windowSend') {
                        this.openSend = true
                    }
                    if (window == 'windowConfiguration') {
                        this.openConfiguration = true
                    }
                    if (window == 'windowDisplaySeed') {
                        this.openDisplaySeed = true
                    }
                    if (window == 'windowRestoreSeed') {
                        this.openRestoreSeed = true
                    }
                    if (window == 'windowPassword') {
                        this.openPassword = true
                    }
                    if (window == 'windowSetup') {
                        this.openSetup = true
                    }
                    if (window == 'windowWelcome') {
                        this.openWelcome = true
                    }
                    if (window == 'windowReceive') {
                        this.openReceive = true
                    }
                    if (window == 'windowRegister') {
                        this.openRegister = true
                    }
                    if (window == 'windowCheckPrivate') {
                        this.openCheckPrivate = true
                    }
                    if (window == 'windowCheckPrivate') {
                        this.openCheckPublic = true
                    }
                    if (window == 'windowFileSend') {
                        this.openFileSend = true
                    }
                    if (window == 'windowFinalize') {
                        this.openFinalize = true
                    }
                    if (window == 'windowHttpReceive') {
                        this.openHttpReceive = true
                    }
                    if (window == 'windowHedwigV1') {
                        this.openHedwigV1 = true
                    }
                    if (window == 'windowCheck') {
                        this.openCheck = true
                    }
                    if (window == 'windowLang') {
                        this.openLang = true
                    }
                    if (window == 'windowGnode') {
                        this.openGnode = true
                    }
                })

                //close
                messageBus.$on('close', (window) => {
                    if (window == 'windowSetupExchange') {
                        this.openSetupExchange = false
                    }
                    if (window == 'windowSend') {
                        this.openSend = false
                    }
                    if (window == 'windowDisplaySeed') {
                        this.openDisplaySeed = false
                    }
                    if (window == 'windowConfiguration') {
                        this.openConfiguration = false
                    }
                    if (window == 'windowRestoreSeed') {
                        this.openRestoreSeed = false
                    }
                    if (window == 'windowPassword') {
                        this.openPassword = false
                    }
                    if (window == 'windowSetup') {
                        this.openSetup = false
                    }
                    if (window == 'windowWelcome') {
                        this.openWelcome = false
                    }
                    if (window == 'windowReceive') {
                        this.openReceive = false
                    }
                    if (window == 'windowRegister') {
                        this.openRegister = false
                    }
                    if (window == 'windowCheckPrivate') {
                        this.openCheckPrivate = false
                    }
                    if (window == 'windowCheckPrivate') {
                        this.openCheckPublic = false
                    }
                    if (window == 'windowFileSend') {
                        this.openFileSend = false
                    }
                    if (window == 'windowFinalize') {
                        this.openFinalize = false
                    }
                    if (window == 'windowHttpReceive') {
                        this.openHttpReceive = false
                    }
                    if (window == 'windowHedwigV1') {
                        this.openHedwigV1 = false
                    }
                    if (window == 'windowCheck') {
                        this.openCheck = false
                    }
                    if (window == 'windowLang') {
                        this.openLang = false
                    }
                    if (window == 'windowGnode') {
                        this.openGnode = false
                    }
                })

            } catch (e) {
                this.$log.error(e)
            }
        },
        methods: {
            loadConfig: function () {
                let configStatus = checkConfigs()
                let config = getConfig()
                this.$log.info("config: ", config)
                if (!configStatus.isConfigured) {
                    this.$log.info("checkpoint 3 No config found!")
                    //open settings modal
                    this.openWelcome = true
                } else {
                    this.$log.info("checkpoint 3a config found!")
                    //isRegistered?
                    if (configStatus.isRegistered) {
                        this.$log.info("checkpoint 4a username found!")
                        //startup
                        //isPassword
                        let password = this.$walletService.getPassword()
                        if (password) {
                            if (!this.username) {
                                this.username = config.username
                            }
                            if (!this.signingPub) {
                                this.signingPub = config.signingPub
                            }
                            if (!this.signingPriv) {
                                this.signingPriv = config.signingPriv
                            }
                            // if (!this.signingPub || !this.signingPriv) {
                            //     this.openRegister = true
                            // }
                        } else {
                            this.openPassword = true
                        }


                    } else {
                        //if wallet
                        if (configStatus.isWallet) {
                            this.$log.info("checkpoint 4b no username found!")
                            //nerf register
							this.openPassword = true
							//this.openRegister = true
                        } else {
                            this.openWelcome = true
                        }
                    }
                }
            },
            getUsers: function () {
                this.$http
                    .get(domain + "/online")
                    .then(response => {
                        this.$log.info("response: ", response.data)
                        this.$log.info("response: ", typeof (response.data))
                        let users = Object.keys(response.data)
                        this.$log.info("users: ", users)

                        //TODO remove yourself
                        let members = []
                        for (let i = 0; i < users.length; i++) {
                            //
                            let member = {}
                            member.username = users[i]
                            member.avatar = "http://api.adorable.io/avatars/30/" + users[i] + '.png'
                            members.push(member)
                        }

                        this.online = users
                        this.members = members
                    })
                    .catch((e) => {
                        this.error = true;
                        this.error = e;
                    });
            },
            displaySeed: function () {
                this.openDisplaySeed = true
            },
            update: function () {
                messageBus.$emit('update')
            },
            async announce() {
                //await this.get
                let joinEvent = {
                    event: "announce",
                    account: this.signingPub,
                    username: this.username,
                    status: "live",
                    message: "user " + this.username + " is online! ready to accept payments."
                }
                let signature = await service.signMessage(this.signingPub, JSON.stringify(joinEvent), this.signingPriv)
                this.$log.info("signature: ", signature)
                joinEvent.signature = signature
                socket.emit('join', JSON.stringify(joinEvent))
            },
            tabOpen() {
                this.$i18n.locale = 'en'
            },
            logout() {
                this.$log.debug('logout')
                ipcRenderer.send('quit')
            },
            autoRefresh(interval) {
                setInterval(() => {
                    if (this.ownerApiRunning) {
                        messageBus.$emit('update')
                    }
                }, interval)
            },
            async checkNewVersion() {
                let toUpdate = await checkUpdate()

                let message = this.$t('msg.app.available') + ": " + toUpdate.latest + "\n" + this.$t('msg.app.current') + ": " + toUpdate.current + "\n" + this.$t('msg.app.updateMsg')
                if (toUpdate && toUpdate.isUpdate) {
                    this.$electron.remote.dialog.showMessageBox({
                        type: 'info',
                        title: this.$t('msg.app.updateTitle'),
                        buttons: [this.$t('msg.app.yes'), this.$t('msg.app.no')],
                        message: message,
                    }, (res, checkboxChecked) => {
                        if (res === 0) {
                            this.$electron.shell.openExternal(downloadUrl)
                            this.$log.debug('User choose to update. now quit app.')
                            ipcRenderer.send('quit')
                        } else {
                            this.$log.info('User chose not to update.')
                        }
                    })
                }
            }
        }
    }
</script>

<style>
	/* CSS */
	.help-content {
		background-color: darkslateblue !important;
	}
	.help-tabs {
		margin-bottom: 10px !important;
	}
	.tabs li.is-active a {
		border-bottom-color: #000000;
		color: #7763A9;
		border-bottom: 3px solid;
		font-weight: bold;
	}
	code, pre {
		color: #1b1e21 !important;
		background-color: darkslateblue !important;
	}
</style>
