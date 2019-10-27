<template>
	<div class="box help-content">
	<b-container class="bv-example-row">
		<b-row>
			<b-col>
				<h2> Fomobot Desktop Dashboard</h2>
				<h4>account: {{address}}
				<button type="button"
						v-clipboard:copy="address"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError">Copy!</button>
				</h4>

				<h2>balance: {{total}}</h2>
				<h3>Total TXS: {{txCount}}</h3>
				<button class="button is-info" @click="getSummaryinfo">
					{{ $t("msg.update") }}
				</button>

<!--				<a class="button is-info is-success" @click="openReceive">Receive</a>-->
				<a class="button is-info is-success" @click="openSend">Send</a>

			</b-col>
			<b-col>

				<div class="col-12">
					<card :title="table1.title">
						<div class="table-responsive">

							<SortedTable :values="table1.data">
								<thead>
								<tr>
									<th scope="col" style="text-align: left; width: 10rem;">
										<SortLink name="blockNumber">blockNumber</SortLink>
									</th>
									<th scope="col" style="text-align: left; width: 10rem;">
										<SortLink name="amount">amount</SortLink>
									</th>
									<th scope="col" style="text-align: left; width: 10rem;">
										<SortLink name="to">to</SortLink>
									</th>
									<th scope="col" style="text-align: left; width: 10rem;">
										<SortLink name="from">from</SortLink>
									</th>
									<th scope="col" style="text-align: left; width: 10rem;">
										<SortLink name="txid">txid</SortLink>
									</th>
								</tr>
								</thead>
								<tbody slot="body" slot-scope="sort">
								<tr v-for="value in sort.values" :key="value.blockNumber">
									<td @click="openLink('https://etherscan.io/block/'+value.blockNumber)">{{ value.blockNumber }}</td>
									<td>{{ value.amount }}</td>
									<td @click="openLink('https://etherscan.io/token/0x3f72bba888da894e73523daa9735596725c15518?a='+value.to)">{{ value.to }}</td>
									<td @click="openLink('https://etherscan.io/token/0x3f72bba888da894e73523daa9735596725c15518?a='+value.from)">{{ value.from }}</td>
									<td @click="openLink('https://etherscan.io/tx/'+value.txid)">{{ value.txid }}</td>
								</tr>
								</tbody>
							</SortedTable>
						</div>
					</card>
				</div>

			</b-col>

		</b-row>
	</b-container>
	</div>
</template>

<script>
    const { shell } = require('electron')
    import { messageBus } from '@/messagebus'
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    const tableColumns = ["blockNumber", "amount", "to", "from","txid"];
    const tableData = [];

    export default {
        name: "Wallet",
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
			messageBus.$on('update', () => {
				this.$log.info("Update detected! ")
				this.getSummaryinfo()
			})
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
                this.$walletService.getSummaryInfo(10)
                    .then((res) => {
                        this.$log.info("res: ", res)
                        this.total = res.balance
                        this.table1.data = [...res.txs]
                        this.txCount = res.txs.length
                        this.address = res.address
                    }).catch((error) => {
                    this.$log.error('getSummaryinfo error:' + error)
                    if (error.response) {
                        let resp = error.response
                        this.$log.error(`resp.data:${resp.data}; status:${resp.status};headers:${resp.headers}`)
                    }
                })
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
