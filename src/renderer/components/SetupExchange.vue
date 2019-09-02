<template>

	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-card" style="width:480px">
			<header class="modal-card-head " style="background-color: #1e1e2f;">
				<p class="modal-card-title text-white">{{ $t("msg.setup") }}</p>
				<button class="delete" aria-label="close" @click="closeModal" ></button>
			</header>
			<section class="modal-card-body" style="height:380px;background-color: darkslateblue;">

				<h2>Setup Exchange</h2>
				<button class="button is-info" @click="openLink('https://testnet.bitmex.com/login')">
					Open signup
				</button>

				<button class="button is-info" @click="openLink('https://testnet.bitmex.com/login')">
					View Instructions
				</button>

				<br/>

				<br/>
				<h2>Public: </h2><input v-model="public" placeholder="public">
				<br/>
				<h2>Private: </h2><input v-model="private" placeholder="private">

				<button class="button is-medium is-success text-white" @click="onSubmit">
					{{ $t("msg.send") }}
				</button>
			</section>
		</div>
	</div>

</template>
<script>
    import { BitmexAPI } from "bitmex-node";
    const { shell } = require('electron')
    import { messageBus } from '@/messagebus'
    const Cryptr = require('cryptr');
    import {updateConfig} from '../../modules/config'

    const fs = require('fs');

    export default {
        name: "SetupExchange",
        props: {
            showModal: {
                type: Boolean,
            }
        },
        data() {
            return {
                success:false,
                public: "",
                private: "",
                error:false,
                errorMessage:''
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
            closeModal() {
                messageBus.$emit('close', 'windowSetupExchange');

            },
            onSubmit: async function () {
				try{
                    //if undefined
                    if(!this.private) {
                        this.error = true
                        this.errorMessage = "Missing Private key!"
                    }
                    if(!this.public) {
                        this.error = true
                        this.errorMessage = "Missing Public key!"
                    }

                    //attempt submit
                    const bitmex = new BitmexAPI({
                        "apiKeyID": this.public,
                        "apiKeySecret": this.private,
                        "testnet":true
                        // "proxy": "https://cors-anywhere.herokuapp.com/"
                    })

                    //tests
                    this.$log.info("bitmex: ", bitmex)

                    // let funding = await bitmex.Funding.get()
                    // this.$log.info("funding: ", funding)

                    let wallet = await bitmex.User.getWallet()
                    this.$log.info("wallet: ", wallet)

					//get password
                    let password = await this.$walletService.getPassword()
                    this.$log.info("password: ", password)

					//encrypt keys
                    const cryptr = new Cryptr(password);

                    //encrpy
					let encryptedPriv = cryptr.encrypt(this.private);

                    //save to config
                    updateConfig({
						bitmexTest:true,
						bitMexTestPub:this.public,
                        bitMexTestPriv:encryptedPriv,
					})
					//if(wallet && wallet.)

				}catch(e){
                    this.public = ""
                    this.private = ""
                    this.error = true
                    this.errorMessage = "Invalid Api Keys!"
				}
            },
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
