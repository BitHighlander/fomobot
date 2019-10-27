<template>
	<div>
		<h2>Logs: {{logs}}</h2>
		<button class="button is-medium is-success text-white" @click="startTraining">
			{{ $t("msg.train") }}
		</button>

		<br/>




		<br/>


		<h2>Bot profiles made: </h2>

		<div class="card-body all-icons">
			<div class="row">

				<div v-for="bot in bots">

					<div class="font-icon-list col-lg-2 col-md-3 col-sm-4 col-xs-6 col-xs-6">
						<div class="font-icon-detail text-white">
							profile: {{ bot.name }}
							<img :src=bot.icon height="5000" width="5000">
							<button class="button is-medium is-success text-white" @click="deleteBot(bot.name)">
								{{ $t("msg.delete") }}
							</button>

							<button class="button is-medium is-success text-white" @click="editBot(bot.name)">
								{{ $t("msg.edit") }}
							</button>

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

		<div v-for="result in results">

			<div class="font-icon-list col-lg-2 col-md-3 col-sm-4 col-xs-6 col-xs-6">
				<div class="font-icon-detail text-white">
					{{result.name}}
					<button class="button is-medium is-success text-white" @click="openResult(result.name)">
						{{ $t("msg.open") }}
					</button>



				</div>
			</div>

		</div>

		<br/>
		<h2>Paper trade: </h2>

		<h2>Live trade: </h2>
		<button class="button is-medium is-success text-white" @click="startTrading">
			{{ $t("msg.trade") }}
		</button>
	</div>
</template>

<script>
    const {ipcRenderer,shell} = require('electron')
    import { messageBus } from '@/messagebus'
    import {getConfig,getModels,deleteModel,getModel,getSimResults,backtestDir} from '../../modules/config'



    const tableColumns = ["blockNumber", "amount", "to", "from","txid"];
    const tableData = [];

    export default {
        name: "Train",
        data() {
            return {
                status: 'not_accepted',
				logs:"",
                results:[],
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

			//get results
            let results = await getSimResults()
            this.$log.info("results: ",results)
            this.$log.info("results: ",results.length)
            this.$log.info("results: ",typeof(results))
            this.results = results

            // messageBus.$on('update', () => {
            //     this.$log.info("Update detected! ")
            //     this.getSummaryinfo()
            // })
        },
        mounted() {
            //this.startTraining()
        },
        methods:{
            openResult: async function (name) {
                let path = "file://"+backtestDir+"/"+name
                this.$log.info("path: ", path)
                shell.openExternal(path)
            },
            editBot: async function (name) {
                this.$log.info("editBot bot name: ",name)
                messageBus.$emit('open', 'windowEditBot');
                messageBus.$emit('SelectBot', name);

            },
            deleteBot: async function (name) {
                this.$log.info("delete bot name: ",name)
                //delete files
                let result = await deleteModel(name)
                this.$log.info("delete bot result: ",result)

                let models = await getModels()
                this.$log.info("models: ",models)
                //this.$log.info("models: ",models.length)
                //this.$log.info("models: ",typeof(models))
                this.bots = models

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
