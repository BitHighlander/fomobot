<template>
	<div>
		<h2>Logs: {{logs}}</h2>
		<button class="button is-medium is-success text-white" @click="startTraining">
			{{ $t("msg.train") }}
		</button>

		<br/>
		<h2>Bot profiles made: </h2>

		<br/>
		<h2>Fitness Tests: </h2>

		<br/>
		<h2>Backtest: </h2>
		<button class="button is-medium is-success text-white" @click="startBacktest">
			{{ $t("msg.backtest") }}
		</button>
		<br/>
		<h2>Paper trade: </h2>

		<h2>Live trade: </h2>
		<button class="button is-medium is-success text-white" @click="startTrading">
			{{ $t("msg.trade") }}
		</button>
	</div>
</template>

<script>
    const {ipcRenderer} = require('electron')
    import { messageBus } from '@/messagebus'
    const tableColumns = ["blockNumber", "amount", "to", "from","txid"];
    const tableData = [];

    export default {
        name: "Train",
        data() {
            return {
				logs:""
            }
        },
        created() {

            ipcRenderer.on('bot', (work,data2,data3) => {
                this.$log.info("IPC MESSAGE! ")
                //this.$log.info("work: ",work)
                this.$log.info("data2: ",data2)
                this.$log.info("data3: ",data3)
            })

            // messageBus.$on('update', () => {
            //     this.$log.info("Update detected! ")
            //     this.getSummaryinfo()
            // })
        },
        mounted() {
            //this.startTraining()
        },
        methods:{
            startTraining: function () {
                this.$log.info("Start training!! ")
				let settings = {
                    foo:"bar"
				}
                ipcRenderer.send("bot","train",settings)
            },
            startBacktest: function () {
                this.$log.info("Start training!! ")
                let settings = {
                    foo:"bar"
                }
				ipcRenderer.send("bot","simulate",settings)
            },
            startTrading: function () {
                this.$log.info("Start trading!! ")
                let settings = {
                    foo:"bar"
                }

                //TODO warning?
				//Will I loose all your monies?

                ipcRenderer.send("bot","trade",settings)
            },
            startPaperTrading: function () {
                // this.$log.info("Start training!! ")
                // ipcRenderer.send("bot","train")
            },
            getBots: function () {
                //read bot dir


            },
            backtestBot: function () {
                //


            },
        }
    }
</script>

<style scoped>

</style>
