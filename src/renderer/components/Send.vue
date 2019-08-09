<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head " style="background-color: #1e1e2f;">
				<p class="modal-card-title">{{ $t("msg.seedTitle") }}</p>
				<button class="delete" aria-label="close" @click="closeModal" ></button>
			</header>
			<section class="modal-card-body" style="height:380px;background-color: darkslateblue;">

				<br/>
				<input v-model="amount" placeholder="amount">
				<br/>
				<input class="text-white" v-model="address" placeholder="address">
				<br/>
				<button class="button is-large text-white" @click="send">
					{{ $t("msg.update") }}
				</button>


			</section>
		</div>
	</div>

</template>
<script>

    import { messageBus } from '@/messagebus'

    const fs = require('fs');

    export default {
        name: "Send",
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
            send: function () {
                if (!this.address) throw Error("address required! ")
                if (!this.amount) throw Error("amount required! ")
                this.$walletService.send(this.address, this.amount)
                    .then((res) => {
                        this.$log.info("res: ", res)
                        this.total = res.balance
                    }).catch((error) => {
                    this.$log.error('getSummaryinfo error:' + error)
                    if (error.response) {
                        let resp = error.response
                        this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
                    }
                })
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
