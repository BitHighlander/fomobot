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


    export default {
        name: "MinerTraderSelect",
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
