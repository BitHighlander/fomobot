<template>
	<div class="box help-content">
		<h2>Backfill database with historical data!</h2>
		<h3>total records: {{total}}</h3>
		<h3>oldest record: {{oldest}}</h3>
		<h3>newest record: {{newest}}</h3>
		<button class="button is-medium is-success text-white" @click="backfill">
			{{ $t("msg.backfill") }}
		</button>
<!--		<chart :options="trade_chart" class="text-white"></chart>-->

	</div>
</template>

<script>
    import { messageBus } from '@/messagebus'
    const {ipcRenderer,shell} = require('electron')

    export default {
        name: "Backfill",
        data() {
            return {
                total: '',
                exchange: 'Bitmex',
                market: 'BTC-USD',
				oldest:"",
				newest:"",
                trade_chart:{},
                chartOptionsBar: {
                    xAxis: {
                        data: ['Q1', 'Q2', 'Q3', 'Q4']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            type: 'bar',
                            data: [63, 75, 24, 92]
                        }
                    ]
                }
            }
        },
        created() {
            ipcRenderer.on('bot', (work,data2,data3) => {
                this.$log.info("IPC MESSAGE! ")
                //this.$log.info("work: ",work)
                this.$log.info("data2: ",data2)
                this.$log.info("data3: ",data3)
            })
        },
		async mounted(){
            try{

                let result = await this.$botService.getBackfillStatus()
				console.log("result: ",result)
				this.total = result.count
                this.oldest = result.oldest
                this.newest = result.newest

				this.trade_chart = await this.$botService.getBackfillChart()

			}catch(e){
                console.error(e)
			}
		},
		methods:{
            async backfill() {
                console.log("CHECKPOINT BACKFILL: ")
                let settings = {
                    foo:"bar"
                }
                ipcRenderer.send("bot","backfill",settings)
            },
		}
    }
</script>

<style scoped>

</style>
