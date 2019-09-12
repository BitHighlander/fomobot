<template>
	<div>
		<b-container class="bv-example-row">
			<img @click="openSetupExchange" src="../assets/logos/bitmex-testnet-white.png" height="50px" width="150px">
			<br/><small class="text-white">(testnet)</small>
		</b-container>

<!--		<chart :options="trade_chart"></chart>-->
<!--		<chart :options="chartOptionsBar"></chart>-->
	</div>


</template>

<script>
    const { shell } = require('electron')
    import { messageBus } from '@/messagebus'



    export default {
        name: "Exchanges",
        data() {
            return {
                // trade_chart:trade_chart,
                // chartOptionsBar: {
                //     xAxis: {
                //         data: ['Q1', 'Q2', 'Q3', 'Q4']
                //     },
                //     yAxis: {
                //         type: 'value'
                //     },
                //     series: [
                //         {
                //             type: 'bar',
                //             data: [63, 75, 24, 92]
                //         }
                //     ]
                // }
            }
        },
        created() {
            messageBus.$on('update', () => {
                this.$log.info("Update detected! ")
                this.getSummaryinfo()
            })


            //this.trade_chart = echarts.init(document.getElementById('trade_chart'));

        },
        mounted() {
            this.getSummaryinfo()
        },
        methods:{
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
            getSummaryinfo: function () {

            },
            openSetupExchange: function () {
                this.$log.info("openSetupExchange: ")
                messageBus.$emit('open', 'windowSetupExchange',"bitmexTest");
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
