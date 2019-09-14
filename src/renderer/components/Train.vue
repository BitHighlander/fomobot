<template>
	<div>
		<h2>Logs: {{logs}}</h2>
		<button class="button is-medium is-success text-white" @click="startTraining">
			{{ $t("msg.train") }}
		</button>

		<br/>

		<button class="button is-medium is-success text-white" @click="deleteSelected">
			{{ $t("msg.delete") }}
		</button>


		<br/>


		<h2>Bot profiles made: </h2>

		<div class="card-body all-icons">
			<div class="row">

				<div v-for="bot in bots">
					<td>

					</td>
					<div class="font-icon-list col-lg-2 col-md-3 col-sm-4 col-xs-6 col-xs-6">
						<div class="font-icon-detail text-white">
							profile: {{ bot.name }}
							<img :src=bot.icon height="5000" width="5000">
						</div>
					</div>

				</div>
			</div>
		</div>


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
    import {getConfig,getModels} from '../../modules/config'



    const tableColumns = ["blockNumber", "amount", "to", "from","txid"];
    const tableData = [];

    export default {
        name: "Train",
        data() {
            return {
				logs:"",
				bots:[
				]
            }
        },
        async created() {

            ipcRenderer.on('bot', (work,data2,data3) => {
                this.$log.info("IPC MESSAGE! ")
                //this.$log.info("work: ",work)
                this.$log.info("data2: ",data2)
                this.$log.info("data3: ",data3)
            })

            let models = await getModels()
            this.$log.info("models: ",models)
            this.$log.info("models: ",models.length)
            this.$log.info("models: ",typeof(models))
			this.bots = models


            // messageBus.$on('update', () => {
            //     this.$log.info("Update detected! ")
            //     this.getSummaryinfo()
            // })
        },
        mounted() {
            //this.startTraining()
        },
        methods:{
            deleteSelected: function () {
				//delete files
            },
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
