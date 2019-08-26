<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head text-white" style="background-color: #1e1e2f;">
				<img src="../assets/icon.png" height="50" width="50">{{ $t("msg.passwordTitle") }}
			</header>
			<section class="modal-card-body" style="height:180px; background-color: darkslateblue;">
				<div class="column">
					<form>
						<div class="field">
							<label class="label text-white">{{ $t("msg.password") }}</label>
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
            }
        },
        beforeDestroy: function () {
            this.showModal = false
        },
        mounted() {

        },
        methods: {
            async tryLogin() {

                let password = this.password

                this.resetErrors()

                let isValid = await this.$walletService.initClient(password)
                this.$log.info('isValid: ',isValid)

				if(isValid){
				    this.$walletService.setPassword(password)
                    this.closeModal()
                    setTimeout(() => messageBus.$emit('update'), 1 * 1000)

				}else{
				    this.error = true
					this.errors['Invalid Password!']
				}
            },
            resetErrors() {
                this.error = false;
            },
            closeModal() {
                messageBus.$emit('close', 'windowPassword');
                this.clearup()
            },

            clearup() {
                this.errors = []
                this.starting = false
                this.started = false
            }
        }
    }
</script>
<style>
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: transparent;
	}
</style>
