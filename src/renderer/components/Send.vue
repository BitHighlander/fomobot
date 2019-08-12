<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head " style="background-color: #1e1e2f;">
				<p class="modal-card-title text-white">{{ $t("msg.sendTitle") }}</p>
				<button class="delete" aria-label="close" @click="closeModal" ></button>
			</header>
			<section class="modal-card-body" style="height:380px;background-color: darkslateblue;">

				<br/>
				<h2>Amount: </h2><input v-model="amount" placeholder="amount">
				<br/>
				<h2>Address: </h2><input v-model="address" placeholder="address">
				<br/>
				<br/>
				<br/>
				<br/>
				<button class="button is-medium is-success text-white" @click="send">
					{{ $t("msg.send") }}
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

						//alert on txid
						alert("Transaction sent! txid: "+res.transactionHash)

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
