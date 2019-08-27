<template>
	<b-container class="bv-example-row">
		<b-row>
			<b-col>
				<h2>Balance BitMex(BTC): {{balance}}</h2>
			</b-col>
			<b-col>

				<button class="button is-medium is-success text-white" @click="getBalances">
					{{ $t("msg.refresh") }}
				</button>

			</b-col>

		</b-row>
	</b-container>
</template>

<script>
    const { shell } = require('electron')
    import { messageBus } from '@/messagebus'
    const Cryptr = require('cryptr');
    import { BitmexAPI } from "bitmex-node";

    import {
        getConfig
    } from '../../modules/config'

    export default {
        name: "Balances",
        data() {
            return {
                balance:0,
                bitmexTestPub:"",
                bitMexTestPriv:""
            }
        },
        created() {

        },
        mounted() {
            this.getSummaryinfo()
        },
        methods:{
            getBalances: async function () {
                try{
                    this.$log.info("Get Bitmex Balances!!!")
                    let config = getConfig()
                    this.bitMexTestPub = config.bitMexTestPub
                    let password = this.$walletService.getPassword()
                    this.$log.info("password: ", password)
                    //decrypt priv
                    let encryptedPriv = config.bitMexTestPriv
                    const cryptr = new Cryptr(password);
                    this.bitMexTestPriv = cryptr.decrypt(encryptedPriv)

                    this.$log.info("bitmexTestPub: ", this.bitMexTestPub)
                    this.$log.info("bitMexTestPriv: ", this.bitMexTestPriv)

                    const bitmex = new BitmexAPI({
                        "apiKeyID": this.bitMexTestPub,
                        "apiKeySecret": this.bitMexTestPriv,
                        "testnet":true
                        // "proxy": "https://cors-anywhere.herokuapp.com/"
                    })
                    this.bitmex = bitmex

                    let wallet = await bitmex.User.getWallet()
                    this.$log.info("wallet: ", wallet)

                    this.balance = wallet.amount/100000000

                }catch(e){
                    this.$log.error("e: ", e)
                }
            },
            openLink: function (link) {
                this.$log.info("link: ", link)
                shell.openExternal(link)
            },
            onCopy: function (e) {
                alert('You just copied: ' + e.text)
            },
            onError: function (e) {
                alert('Failed to copy texts')
            },
            getSummaryinfo: async function () {
                //let summary = this.$fomoService.getSummaryInfo(10)
                //this.$log.info("summary: ",summary)

            },
            openSend: function () {
                this.$log.info("openSend: ")
                messageBus.$emit('open', 'windowSend');
            },
            openReceive: function () {
                this.$log.info("openReceive: ")
                messageBus.$emit('open', 'windowReceive');
            },
        }
    }
</script>

<style scoped>

</style>
