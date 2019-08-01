<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head">
				<img src="../assets/icon.png" height="50" width="50">{{ $t("msg.passwordTitle") }}
			</header>
			<section class="modal-card-body" style="height:380px;background-color: whitesmoke;">
				<div class="column">
					<div class="message is-warning is-small">
						<div class="message-header">
							<p>{{ $t("msg.welcome.title") }}</p>
						</div>
						<div class="message-body">
							<p>{{ $t("msg.login.walletExist") }}</p>
						</div>
					</div>

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
			</section>
		</div>
	</div>

</template>
<script>

    import {messageBus} from '@/messagebus'
    import {setTimeout} from 'timers';
    import {version, grinNode, gnodeOption} from '../../modules/config'

    const fs = require('fs');
    const publicIp = require('public-ip');
    const externalip = require('externalip')

    function isValidIP(str) {
        const octet = '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)';
        const regex = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}$`);
        return regex.test(str);
    }

    export default {
        name: "password",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                firstTime: false,
                password: '',
                error: false,
                openRemove: false,
                version: version,
                errors: [],
                starting: false,
                started: false,
                localReachable: false,
                running: false,
                ip: this.$t('msg.httpReceive.ip')
            }
        },
        beforeDestroy: function () {
            this.showModal = false
        },
        mounted() {
            //this.checkRunning()
            //this.$log.info('isfirst(login.vue)? '+isFirstTime())
            //NERF
            //this.firstTime = isFirstTime()
        },
        methods: {
            tryLogin() {

                let setPassword = this.$walletService.setPassword
                let password = this.password

                this.resetErrors()
                this.$walletService.initClient()
                this.$walletService.startOwnerApi(this.password, grinNode)
                setTimeout(() => {
                    this.$walletService.getNodeHeight().then(
                        (res) => {
                            setPassword(password)
                            messageBus.$emit('logined')
                            if (gnodeOption.type != 'remoteAllTime') messageBus.$emit('gnodeStarting')

                            messageBus.$emit('close', 'windowPassword');
                        }).catch((error) => {
                        this.$log.error('Failed to start wallet! ',error)
                        return this.error = true
                    })
                }, 800)
                this.resetErrors()
            },
            resetErrors() {
                this.error = false;
            },
            start() {
                if ((!this.starting) && (!this.running)) {
                    this.starting = true
                    this.checklocalReachable().catch((error) => {
                        if (!error.response) {
                            this.$walletService.startListen()
                        }
                        this.$log.debug('Http listen is locally reachable.')
                        this.$log.debug('checkRunning right now.')
                        setTimeout(() => this.checkRunning(), 1.5 * 1000)
                    })
                }
            },
            stop() {
                this.$walletService.stopProcess('listen')
                this.running = false
                this.closeModal()
            },
            closeModal() {
                messageBus.$emit('close', 'windowPassword');
                this.clearup()
            },

            clearup() {
                this.errors = []
                this.starting = false
                this.started = false
            },

            getIP(log) {
                return new Promise(function (resolve, reject) {
                    publicIp.v4().then((ip) => {
                        return resolve(ip)
                    }).catch((err) => {
                        log.error('Failed to get ip use publicIp: ' + err)
                        externalip(function (err, ip) {
                            if (ip) {
                                return resolve(ip)
                            } else {
                                log.error('Failed to get ip use externalip: ' + err)
                                return reject(err)
                            }
                        })
                    })
                })
            },

            checklocalReachable() {
                const url = 'http://127.0.0.1:3415'
                this.$log.debug('Try to test if http listen locally reachable?')
                return this.$http.get(url, {timeout: 5000})
            },

            checkRunning() {
                this.checklocalReachable().catch((err) => {
                    if (err.response) {
                        this.localReachable = true
                    }
                })
                this.getIP(this.$log).then((ip) => {
                    this.ip = ip
                    this.$log.debug('Get ip: ' + ip)
                    const url = `http://${ip}:3415`
                    this.$log.debug(`Try to test ${url} ?`)
                    this.$http.get(url, {timeout: 4000}).catch((error) => {
                        if (error.response) {
                            this.running = true
                            if (this.starting) {
                                this.started = true
                                this.starting = false
                            }
                            this.$log.debug('wallet HTTP listen works.')
                        } else {
                            if (this.starting) {
                                this.starting = false
                                if (this.localReachable) {
                                    this.errors.push(this.$t('msg.httpReceive.failed4'))
                                } else {
                                    this.errors.push(this.$t('msg.httpReceive.failed2'))
                                }
                            }
                            this.running = false
                            this.$log.debug('Failed to connect ', url)
                        }
                    })
                }).catch(
                    (err) => {
                        this.$log.error('Error when try to get ip: ' + err)
                        this.errors.push(this.$t('msg.httpReceive.failed3'))
                        this.starting = false
                        this.running = false
                    }
                )
            }
        }
    }
</script>
<style>
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
