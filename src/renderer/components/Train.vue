<template>
	<div>
		<h2>Logs: {{logs}}</h2>
	</div>
</template>

<script>
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
                this.$botService.initClient()
                    .then((res) => {
                        this.$log.debug(res)
						this.logs = res
                    }).catch((error) => {
						this.$log.error('initClient error:' + error)
						if (error.response) {
							let resp = error.response
							this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
						}
                })
            },
        }
    }
</script>

<style scoped>

</style>
