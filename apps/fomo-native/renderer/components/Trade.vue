<template>

	<div>

		<!-- .row -->
		<div class="row">
			<div class="col-lg-6 col-sm-6 col-12">
				<div class="white-box box help-content">
					<h3 class="box-title">Current Market</h3>
					<div class="row">
						<div class="col-lg-4 col-12">
							<ul class="list-inline two-part">
								<li class="text-left" style="display:inline"><i class="ti-arrow-up"></i> <span class="text-info">Price</span></li>
								<li class="text-left" style="display:inline"><i class="ti-arrow-up text-info"></i> <span>10309.97</span> <small>BTC</small></li>
							</ul>
						</div>

						<div class="col-lg-4 col-12">
							<ul class="list-inline two-part">
								<li class="text-left" style="display:inline"><i class="ti-arrow-up"></i> <span class="text-success">ASK</span></li>
								<li class="text-left" style="display:inline"><i class="ti-arrow-up text-success"></i> <span>10309.98</span> <small>BTC</small></li>
							</ul>
						</div>
						<div class="col-lg-4 col-12">
							<ul class="list-inline two-part">
								<li class="text-left" style="display:inline"><i class="ti-arrow-up"></i> <span class="text-danger">BID</span></li>
								<li class="text-left" style="display:inline"><i class="ti-arrow-up text-danger"></i> <span>10309.97</span> <small>BTC</small></li>
							</ul>
						</div>

					</div>
				</div>
			</div>
			<div class="col-lg-6 col-sm-6 col-12">
				<div class="white-box box help-content">
					<h3 class="box-title">Capital</h3>
					<div class="row">
						<div class="col-lg-6 col-12">
							<ul class="list-inline two-part">
								<li class="text-left" style="display:inline"><i class="ti-arrow-up text-purple"></i> <span class="text-purple">Asset</span></li>
								<li class="text-left" style="display:inline"><i class="ti-arrow-up text-purple"></i> <span>0.00</span> <small>BTC</small></li>
							</ul>
						</div>

						<div class="col-lg-6 col-12">
							<ul class="list-inline two-part">
								<li class="text-left" style="display:inline"><i class="ti-arrow-up text-purple"></i> <span class="text-purple">Currency</span></li>
								<li class="text-left" style="display:inline"><i class="ti-arrow-up text-purple"></i> <span>1000.00</span> <small>USD</small></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row">

			<div class="col-lg-3 col-sm-6 col-12">
				<div class="white-box box help-content">
					<h3 class="box-title">Last balance (1.00% vs buy hold)</h3>
					<ul class="list-inline one-part">
						<li class="text-right text-success"><i class="ti-arrow-up"></i> <span class="counter">1009.81974045</span> <small>USD</small></li>
						<li class="text-right text-success""><i class="ti-arrow-up"></i> <span>0.98%</span> <small>of profit</small></li>
					</ul>
				</div>
			</div>
			<div class="col-lg-3 col-sm-6 col-12">
				<div class="white-box box help-content">
					<h3 class="box-title">Buy hold</h3>
					<ul class="list-inline one-part">
						<li class="text-right text-info"><i class="ti-arrow-up"></i> <span class="counter">999.89816720</span> <small>USD</small></li>
						<li class="text-right text-danger""><i class="ti-arrow-up"></i> <span>-0.02%</span> <small>of profit</small></li>
					</ul>
				</div>
			</div>
			<div class="col-lg-3 col-sm-6 col-12">
				<div class="white-box box help-content">
					<h3 class="box-title">Trades per day</h3>
					<ul class="list-inline one-part">
						<li class="text-right"><i class="ti-arrow-up text-purple"></i> <span class="counter text-purple">0.00</span></li>
						<li class="text-right"><i class="ti-arrow-up text-purple"></i> <span class="text-purple">0 trades over 1 day</span></li>
					</ul>
				</div>
			</div>


		</div>


		<div class="row">
			<div class="col-lg-12 col-sm-6 col-12">
			<div class="white-box box help-content">
				<chart :options="trade_chart" class="text-white"></chart>
			</div>
			</div>
		</div>


<!--		<div class="row">-->
<!--			<div class="col-lg-6 col-md-12">-->
<!--				<card type="tasks" :header-classes="{'text-right': false}">-->
<!--					<template slot="header">-->
<!--						<h6 class="title d-inline">{{$t('dashboard.tasks', {count: 5})}}</h6>-->
<!--						<p class="card-category d-inline">{{$t('dashboard.today')}}</p>-->
<!--						<base-dropdown menu-on-right=""-->
<!--									   tag="div"-->
<!--									   title-classes="btn btn-link btn-icon"-->
<!--									   aria-label="Settings menu"-->
<!--									   :class="{'float-left': false}">-->
<!--							<i slot="title" class="tim-icons icon-settings-gear-63"></i>-->
<!--							<a class="dropdown-item" href="#pablo">{{$t('dashboard.dropdown.action')}}</a>-->
<!--							<a class="dropdown-item" href="#pablo">{{$t('dashboard.dropdown.anotherAction')}}</a>-->
<!--							<a class="dropdown-item" href="#pablo">{{$t('dashboard.dropdown.somethingElse')}}</a>-->
<!--						</base-dropdown>-->
<!--					</template>-->
<!--					<div class="table-full-width table-responsive">-->
<!--						<task-list></task-list>-->
<!--					</div>-->
<!--				</card>-->
<!--			</div>-->
<!--			<div class="col-lg-6 col-md-12">-->
<!--				<card class="card" :header-classes="{'text-right': false}">-->
<!--					<h4 slot="header" class="card-title">{{$t('dashboard.simpleTable')}}</h4>-->
<!--					<div class="table-responsive">-->
<!--						<user-table></user-table>-->
<!--					</div>-->
<!--				</card>-->
<!--			</div>-->
<!--		</div>-->
	</div>
</template>

<script>

    import LineChart from '@/components/Charts/LineChart';
    import BarChart from '@/components/Charts/BarChart';
    import * as chartConfigs from '@/components/Charts/config';
    import TaskList from './Dashboard/TaskList';
    import UserTable from './Dashboard/UserTable';
    import config from './Dashboard/config';

    export default {
        name: "Trade",
        components: {
            LineChart,
            BarChart,
            TaskList,
            UserTable
        },
        data() {
            return {
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
        computed: {
            enableRTL() {
                return this.$route.query.enableRTL;
            },
            false() {
                return this.$rtl.false;
            },
            bigLineChartCategories() {
                return this.$t('dashboard.chartCategories');
            }
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
        methods: {

        },

    }
</script>

<style scoped>

</style>
