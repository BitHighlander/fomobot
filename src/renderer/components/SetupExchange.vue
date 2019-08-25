<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head " style="background-color: #1e1e2f;">
				<p class="modal-card-title text-white">{{ $t("msg.sendTitle") }}</p>
				<button class="delete" aria-label="close" @click="closeModal" ></button>
			</header>
			<section class="modal-card-body" style="height:380px;background-color: darkslateblue;">

				<h2>Setup Exchange</h2>
				<button class="button is-info" @click="openLink('https://testnet.bitmex.com/login')">
					Open signup
				</button>

				<button class="button is-info" @click="getSummaryinfo">
					View Instructions
				</button>

				<br/>

				<br/>
				<h2>Public: </h2><input v-model="public" placeholder="public">
				<br/>
				<h2>Private: </h2><input v-model="private" placeholder="private">

			</section>
		</div>
	</div>

</template>
<script>
    const { shell } = require('electron')
    import { messageBus } from '@/messagebus'

    const fs = require('fs');

    export default {
        name: "SetupExchange",
        props: {
            showModal: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                amount: 0,
                address: '',
            }
        },
        beforeDestroy: function(){
            this.showModal = false
        },
        mounted() {

        },
        methods: {
            openLink: function (link) {
                this.$log.info("link: ", link)
                shell.openExternal(link)
            },
            send: function () {

            },
            closeModal() {
                messageBus.$emit('close', 'windowSend');
                this.clearup()
            }
        }
    }
</script>
<style>
	.center{
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: transparent;
	}
</style>
