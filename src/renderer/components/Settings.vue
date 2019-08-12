<template>
	<button class="button is-medium is-success text-white" @click="openSeed">
		{{ $t("msg.viewSeed") }}
	</button>
</template>

<script>
    import { messageBus } from '@/messagebus'
    const tableColumns = ["blockNumber", "amount", "to", "from","txid"];
    const tableData = [];

    export default {
        name: "Settings",
        data() {
            return {
                message: 'Copy These Text',
                amount: 0,
                address: '',
                spendable: 0,
                total: 0,
                txCount:0,
                table1: {
                    title: "transactions",
                    columns: [...tableColumns],
                    data: [...tableData]
                },
            }
        },
        created() {
        },
        mounted() {
        },
        methods:{
            openSeed: function () {
                this.$log.info("windowDisplaySeed: ")
                messageBus.$emit('getSeed')
                messageBus.$emit('open', 'windowDisplaySeed');
            },
        }
    }
</script>

<style scoped>

</style>
