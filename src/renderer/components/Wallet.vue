<template>
	<b-container class="bv-example-row">
		<b-row>
			<b-col>
				<h2> Fomobot Desktop Dashboard</h2>
				<h2>balance: {{total}}</h2>
				<h3>Total TXS: {{txCount}}</h3>
				<button class="button is-primary" @click="getSummaryinfo">
					{{ $t("msg.update") }}
				</button>

				<a class="button is-info is-success" @click="openReceive">Receive</a>
				<a class="button is-info is-danger" @click="openSend">Send</a>

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
									<td>{{ value.blockNumber }}</td>
									<td>{{ value.amount }}</td>
									<td>{{ value.to }}</td>
									<td>{{ value.from }}</td>
									<td>{{ value.txid }}</td>
								</tr>
								</tbody>
							</SortedTable>
						</div>
					</card>
				</div>

			</b-col>

		</b-row>
	</b-container>
</template>

<script>
    import { messageBus } from '@/messagebus'
    const tableColumns = ["blockNumber", "amount", "to", "from","txid"];
    const tableData = [];

    export default {
        name: "Send",
        data() {
            return {
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
        methods:{
            getSummaryinfo: function () {
                this.$walletService.getSummaryInfo(10)
                    .then((res) => {
                        this.$log.info("res: ", res)
                        this.total = res.balance
                        this.table1.data = [...res.txs]
                        this.txCount = res.txs.length
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
