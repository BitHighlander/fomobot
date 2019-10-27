<template>
	<b-container class="bv-example-row">
		<b-row>
			<b-col>
				<button class="button is-medium is-success text-white" @click="getBalances">
					{{ $t("msg.refresh") }}
				</button>
				<div v-if="isBull">
					<h2>Is Bull</h2>
				</div>

				<div v-if="isBear">
					<h2>Is Bear</h2>
				</div>
				<h2>leverage: {{leverage}}</h2>
				<h2>pctAvaible: {{pctAvaible}}</h2>

			</b-col>
			<b-col>
				<h2>Balance BitMex(BTC): {{balance}}</h2>
				<h2>unrealisedGrossPnl: {{unrealisedGrossPnl}}</h2>
				<h2>lastValue: {{lastValue}}</h2>
				<h2>currentQty: {{currentQty}}</h2>
				<h2>markPrice: {{markPrice}}</h2>
				<h2>marginCallPrice: {{marginCallPrice}}</h2>
				<h2>lastPrice: {{lastPrice}}</h2>


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
                isBull:false,
				isBear:false,
				lastPrice:0,
                balance:0,
                unrealisedGrossPnl:0,
                lastValue:0,
                currentQty:0,
                markPrice:0,
                marginCallPrice:0,
                pctAvaible:0,
                leverage:0,
                bitmexTestPub:"",
                bitMexTestPriv:""
            }
        },
        created() {

        },
        mounted() {
            this.getSummaryinfo()
			this.getBalances()
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


                    let positions = await bitmex.Position.get()

                    //log.info("positions: ",positions[0])

                    // log.info("unrealized profit: ",positions[0].unrealisedGrossPnl)
                    // log.info("currentQty: ",positions[0].lastValue)
                    // log.info("currentQty: ",positions[0].currentQty)
                    // log.info("markPrice: ",positions[0].markPrice)
                    // log.info("marginCallPrice: ",positions[0].marginCallPrice)
                    // log.info("lastPrice: ",positions[0].lastPrice)
                    // log.info("leverage: ",positions[0].leverage)
					this.unrealisedGrossPnl = positions[0].unrealisedGrossPnl /100000000
                    this.lastValue = positions[0].lastValue / 100000000
                    this.currentQty = positions[0].currentQty
                    this.markPrice = positions[0].markPrice
                    this.marginCallPrice = positions[0].marginCallPrice
                    this.lastPrice = positions[0].lastPrice
                    this.leverage = positions[0].leverage

                    let pctAvaible = wallet.amount / Math.abs(positions[0].lastValue)
                    pctAvaible =pctAvaible * 100
                    this.pctAvaible = pctAvaible

                    //isBull
                    if(positions[0].lastValue > 0){
                        this.isBull = true
                    }

                    //isBear
                    if(positions[0].lastValue  < 0){
                        this.isBear = true
                    }


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
