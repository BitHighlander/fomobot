<template>
	<div>
		<h2>Logs: {{logs}}</h2>
		<button class="button is-medium is-success text-white" @click="openSeed">
			{{ $t("msg.viewSeed") }}
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

            ipcRenderer.on('bot', (work,data2) => {
                this.$log.info("IPC MESSAGE! ")
                this.$log.info("work: ",work)
                this.$log.info("data2: ",data2)
            })

            // messageBus.$on('update', () => {
            //     this.$log.info("Update detected! ")
            //     this.getSummaryinfo()
            // })
        },
        mounted() {
            this.startTraining()
        },
        methods:{

            startTraining: function () {
                this.$log.info("Start training!! ")
                ipcRenderer.send("bot","train")
            },
        }
    }
</script>

<style scoped>

</style>
