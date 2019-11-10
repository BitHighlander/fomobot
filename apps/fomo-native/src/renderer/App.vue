<template>
	<div id="app">

		<div class="container">
			<div class="columns">
				<div class="column is-12">
					<b-row>
						<b-col>
							<b-card
									title="Balances"
									img-src=""
									img-alt="Image"
									img-top
									tag="article"
									style="max-width: 20rem;"
									class="mb-2"
							>
								<b-card-text>
									<h4>Fomopoints: {{fomopoints}}</h4>

									<div v-if="isNotConfiged">
										Please finish configuring!
									</div>

									<div v-if="isFunded">
										You must fund your account to trade!
									</div>

									<div v-if="isReady">
										Ready to begin!
									</div>

									<div v-if="isTrader">
										Trading Status:

										<vc-donut
												:size="280"
												background="#363636"
												:sections="sections"
												has-legend legend-placement="bottom"
												:total="100"
										>
											{{totalBalance}}(BTC)
											<animated-number
													:value="totalUSD"
													:formatValue="formatToPriceUSD"
													:duration="duration"/>
											Total (USD)
										</vc-donut>
									</div>

									<div v-if="isTraining">
										Trading Status:

										<vc-donut
												:size="280"
												background="#363636"
												:sections="sections"
												has-legend legend-placement="bottom"
												:total="100"
										>
											<animated-number :value="totalUSD" :formatValue="formatToPriceUSD"
															 :duration="duration"/>
											Total (USD)
										</vc-donut>
									</div>

								</b-card-text>
							</b-card>
						</b-col>
						<b-col>

							<div v-if="isTrader">
								<b-card
										title="TA"
										img-src=""
										img-alt="Image"
										img-top
										tag="article"
										style="max-width: 20rem;"
										class="mb-2 text-white"
								>
									<b-card-text>

										last price: {{lastPrice}}

										isBull: {{isBull}}
										isBear: {{isBear}}

									</b-card-text>
								</b-card>

								<b-card
										title="Trade"
										img-src=""
										img-alt="Image"
										img-top
										tag="article"
										style="max-width: 20rem;"
										class="mb-2 text-white"
								>
									<b-card-text>

										last price: {{lastPrice}}


										<h2>Exchange Configured</h2>


										Bitmex: {{isBitmexLive}}

										<h2>Select Trading Strategy</h2>

										<b-form-select class="text-white" style="background-color: darkslateblue;"
													   v-model="selected" :options="options"></b-form-select>

										<div class="mt-3 text-white">Selected: <strong>{{ selected }}</strong></div>


									</b-card-text>

									<b-button href="#" variant="primary" @click="startTrading">Start Trading!</b-button>
									<b-button href="#" variant="primary" @click="buySignal">Go Bull!</b-button>
									<b-button href="#" variant="primary" @click="sellSignal">go Bear!</b-button>
								</b-card>

								<b-card
										title="Positions"
										img-src=""
										img-alt="Image"
										img-top
										tag="article"
										style="max-width: 20rem;"
										class="mb-2 text-white"
								>
									<b-card-text>


										<div>
											<b-table striped hover :items="positions"></b-table>
										</div>
										<b-button href="#" variant="primary" @click="updatePostition">refresh!
										</b-button>
									</b-card-text>


								</b-card>

							</div>


							<div v-if="isMiner">
								<b-card
										title="Trained models"
										img-src=""
										img-alt="Image"
										img-top
										tag="article"
										style="max-width: 20rem;"
										class="mb-2"
								>
									<b-card-text>

									</b-card-text>


									<div class="card-body all-icons">
										<div class="row">

											<div v-for="bot in bots">

												<div class="">
													<div class="font-icon-detail text-white">
														profile: {{ bot.name }}
														<img :src=bot.icon >
														<button class="button is-medium is-success text-white"
																@click="deleteBot(bot.name)">
															{{ $t("msg.delete") }}
														</button>

														<button class="button is-medium is-success text-white"
																@click="editBot(bot.name)">
															{{ $t("msg.edit") }}
														</button>

													</div>
												</div>

											</div>
										</div>
									</div>


									<b-button href="#" variant="primary" @click="startMining()">Start Mining!</b-button>
								</b-card>

							</div>

						</b-col>
					</b-row>


					<div v-if="isAdvancedMode">

						<div class="tabs help-tabs">
							<ul>
								<li :class="[ tabOpen === 'wallet' ? 'is-active' : '']"><a @click="tabOpen='wallet'">Wallet</a>
								</li>
								<li :class="[ tabOpen === 'bot' ? 'is-active' : 'is-disabled']"><a
										@click="tabOpen='bot'">bot</a></li>
								<li :class="[ tabOpen === 'exchanges' ? 'is-active' : 'is-disabled']"><a
										@click="tabOpen='exchanges'">Exchanges</a></li>
								<li :class="[ tabOpen === 'balances' ? 'is-active' : 'is-disabled']"><a
										@click="tabOpen='balances'">Balances</a></li>
								<li :class="[ tabOpen === 'backfill' ? 'is-active' : 'is-disabled']"><a
										@click="tabOpen='backfill'">Backfill</a></li>
								<li :class="[ tabOpen === 'train' ? 'is-active' : 'is-disabled']"><a
										@click="tabOpen='train'">Train</a></li>
								<li :class="[ tabOpen === 'trade' ? 'is-active' : 'is-disabled']"><a
										@click="tabOpen='trade'">Trade</a></li>
								<li :class="[ tabOpen === 'trollbox' ? 'is-active' : 'is-disabled']"><a
										@click="tabOpen='trollbox'">trollbox</a></li>
								<li :class="[ tabOpen === 'subscribe' ? 'is-active' : 'is-disabled']"><a
										@click="tabOpen='subscribe'">Subscribe</a></li>
								<li :class="[ tabOpen === 'settings' ? 'is-active' : 'is-disabled']"><a
										@click="tabOpen='settings'">Settings</a></li>
							</ul>
						</div>
						<code v-if="tabOpen ==='wallet'">
							<Wallet></Wallet>
						</code>
						<code v-if="tabOpen ==='bot'">
							<bot></bot>
						</code>
						<code v-if="tabOpen ==='exchanges'">
							<exchanges></exchanges>
						</code>
						<code v-if="tabOpen ==='balances'">
							<Balances></Balances>
						</code>
						<code v-if="tabOpen ==='backfill'">
							<Backfill></Backfill>
						</code>
						<code v-if="tabOpen ==='train'">
							<Train></Train>
						</code>
						<code v-if="tabOpen ==='trade'">
							<trade></trade>
						</code>
						<code v-if="tabOpen ==='trollbox'">
							<trollbox></trollbox>
						</code>
						<code v-if="tabOpen ==='reports'">
							<trollbox></trollbox>
						</code>
						<code v-if="tabOpen ==='subscribe'">
							<p text-white>Coming Soon! </p>
						</code>
						<code v-if="tabOpen ==='settings'">
							<settings></settings>
						</code>

						<!--					<div class="box help-content">-->
						<!--					</div>-->

					</div>

				</div>
			</div>
		</div>

		<password :showModal="openPassword"></password>
		<welcome :showModal="openWelcome"></welcome>
		<Setup :showModal="openSetup"></Setup>
		<RestoreSeed :showModal="openRestoreSeed"></RestoreSeed>
		<Configuration :showModal="openConfiguration"></Configuration>
		<Register :showModal="openRegister"></Register>
		<Send :showModal="openSend"></Send>
		<DisplaySeed :showModal="openDisplaySeed"></DisplaySeed>
		<SetupExchange :showModal="openSetupExchange"></SetupExchange>
		<EditBot :showModal="openEditBot"></EditBot>
<!--		<MinerTraderSelect :showModal="openEditBot"></MinerTraderSelect>-->

		<radial-menu
				style="margin: auto; margin-top: 300px; background-color: white"
				:itemSize="50"
				:radius="120"
				:angle-restriction="180">
			<radial-menu-item
					v-for="(item, index) in items"
					:key="index"
					style="background-color: white"
					@click="() => handleClick(item)">
				<span>{{item}}</span>
			</radial-menu-item>
		</radial-menu>
		<div style="color: rgba(0,0,0,0.6); margin-top: 16px;">{{ lastClicked }}</div>


	</div>
</template>

<script>
    import {RadialMenu, RadialMenuItem} from 'vue-radial-menu'
    import {messageBus} from '@/messagebus'
    import checkUpdate from '../modules/updateChecker'
    import {
        downloadUrl,
        locale,
        gnodeOption,
        getConfig,
        setConfig,
        updateConfig,
        apiSecretPath,
        checkConfigs,
        getModels,
		deleteModel,
		getModel,
		getSimResults,
		backtestDir
    } from '../modules/config'
    //modules

    //modals
    import Setup from '@/components/Setup'
    import Welcome from '@/components/Welcome'
    import DisplaySeed from '@/components/DisplaySeed'
    import RestoreSeed from '@/components/RestoreSeed'
    import Configuration from '@/components/Configuration'
    import Register from "@/components/Register";
    import Password from '@/components/Password'
    import Send from '@/components/Send'
    import Receive from '@/components/Receive'
    import Train from '@/components/Train'
    import SetupExchange from '@/components/SetupExchange'
    import EditBot from '@/components/EditBot'

    //pages
    import Wallet from '@/components/Wallet'
    import Settings from '@/components/Settings'
    import Exchanges from '@/components/Exchanges'
    import Balances from '@/components/Balances'
    import Bot from '@/components/Bot'
    import Trollbox from '@/components/Trollbox'
    import Trade from '@/components/Trade'
    import Backfill from '@/components/Backfill'

    //
    import {BaseTable} from "@/components/BaseTable";
    import AnimatedNumber from "animated-number-vue";
    import MinerTraderSelect from "./components/MinerTraderSelect";
    //nav
    // import Nav from '@/components/Setup'

    //require
    const {ipcRenderer} = require('electron')


    export default {
        name: 'fomobot',
        components: {
            MinerTraderSelect,
            RadialMenu,
            RadialMenuItem,
            AnimatedNumber,
            EditBot,
            Backfill,
            Trade,
            Trollbox,
            Bot,
            Balances,
            SetupExchange,
            Exchanges,
            Train,
            Settings,
            Wallet,
            Send,
            Receive,
            BaseTable,
            Setup,
            Welcome,
            Configuration,
            RestoreSeed,
            DisplaySeed,
            Register,
            Password,
        },
        data() {
            return {
                fomopoints:"",
                showModal:"",
                bots: [],
                positions: [],
                trades: [],
                selected: "bollinger",
                options: [
                    {value: 'bollinger', text: 'bollinger'},
                    {value: 'cci_srsi', text: 'cci_srsi'},
                    {value: 'crossover_vwap', text: 'crossover_vwap'},
                    {value: 'dema', text: 'dema'},
                    {value: 'ichimoku_score', text: 'ichimoku_score'},
                    {value: 'ichimoku', text: 'ichimoku'},
                    {value: 'speed', text: 'speed'},
                    {value: 'wavetrend', text: 'wavetrend'},
                    {value: 'trust_distrust', text: 'trust_distrust'},
                    {value: 'ta_ultosc', text: 'ta_ultosc'},
                    {value: 'stddev', text: 'stddev'},
                ],
                items: ['Mine', 'Trade', 'Advanced Mode'],
                lastClicked: 'Trade',
                lastPrice: 0,
                totalUSD: 0,
                totalBalance: 0,
                duration: 1000,
                isBull: false,
                isBear: false,
                isMiner: true,
                isTrader: false,
                isFunded: false,
                isTrading: false,
                isTraining: false,
                isReady: false,
                isAdvancedMode: false,
                isBitmexLive: false,
                isNotConfiged: false,
                sections: [],
                bitmex: "",
                monitor: {
                    schedule: '* * * * *',
                    url_code: 'https://cronhub.io/random_uuid',
                },
                tabOpen: 'balances',
                isWalletLocked: true,
                openMinerTraderSelect: false,
                openSetupExchange: false,
                openSend: false,
                openConfiguration: false,
                openDisplaySeed: false,
                openRestoreSeed: false,
                openWelcome: false,
                openCheckPublic: false,
                openSetup: false,
                openCheckPrivate: false,
                openRegister: false,
                openPassword: false,
                openReceive: false,
                openHttpReceive: false,
                openFileSend: false,
                openFinalize: false,
                openHedwigV1: false,
                openCheck: false,
                openLang: false,
                openGnode: false,
                openEditBot: false,
            }
        },
        mounted() {

            /*

				Setup stages

				isRightVersion?

				do I have a grin wallet already?
				  if not, setup(welcome componiant)

				verifyPassword
				  else offer new wallet

				do I have a config file?
				  Should always

				does config file have a username?
				  else register

			 */

            this.$log.info("checkpoint 1 mounted")

            //this.checkNewVersion()
            //this.$log.info("checkpoint 2 passed version check")

            //detect configs
            this.loadConfig()

        },
        async created() {
            try {

                //miner
                ipcRenderer.on('bot', (work, data2, data3) => {
                    this.$log.info("IPC MESSAGE! ")
                    //this.$log.info("work: ",work)
                    this.$log.info("data2: ", data2)
                    this.$log.info("data3: ", data3)
                })

                let models = await getModels()
                this.$log.info("models: ", models)
                this.$log.info("models: ", models.length)
                this.$log.info("models: ", typeof (models))
                this.bots = models

                //get results
                let results = await getSimResults()
                this.$log.info("results: ", results)
                this.$log.info("results: ", results.length)
                this.$log.info("results: ", typeof (results))
                this.results = results


                //Trader

                ipcRenderer.on('trades', (work, data2, data3) => {

                    /*
                    	trade:  {
                    			  event: 'trades',
								  global: true,
								  source: 'bitmex',
								  time: 1572669006552,
								  trade:
								   { price: 9245,
									 side: 'Buy',
									 size: 3230,
									 time: 1572669006450,
									 trade_id: '4ec837e3-0808-eb57-84e9-8fbf74133f33',
									 unix: 1572669006450 }
								 }
                     */


                    //this.$log.debug("IPC MESSAGE! ")
                    //this.$log.info("work: ",work)
                    //this.$log.debug("data2: ",data2)
                    //this.$log.debug("data3: ",data3)
                    //this.$log.debug("data2: ",typeof(data2))
                    //this.$log.debug("data2: ",data2.event)
                    if (data2.event === 'trades') {
                        this.lastPrice = data2.trades[0].price
                    }

                    if (data2.event === 'signal') {

                        this.$toasted.show('SIGNAL! : ', {
                            type: 'info',
                            duration: 3000
                        })

                    }

                    //sound.playChingle()
                    messageBus.$emit('block', data2)

                })

                ipcRenderer.on('signal', (work, data2, data3) => {

                    /*
                    	signal:  {

                    	}

                     */

                    this.$log.debug("><><><><><><><><>< signal! ", data2)

                    this.$toasted.show('SIGNAL! : ' + data2.signal, {
                        type: 'info',
                        duration: 3000
                    })

                    // if(data2.event === 'signal'){
                    //
                    //     this.$toasted.show('SIGNAL! : ',{
                    //         type:'info',
                    //         duration:3000
                    //     })
                    //
                    // }


                    //sound.playChingle()
                    messageBus.$emit('<><><><><><><><><>< signal', data2)


                    //
                    if (data2.signal === "buy") {
                        this.$botService.buySignal()
                    }


                    if (data2.signal === "sell") {
                        this.$botService.sellSignal()
                    }


                })

                messageBus.$on('execution', (trade) => {
                    //this.getBalances()
                    this.$log.info(" execution!: ", trade)
                    //this.trades = this.trades.push(trade)

                    this.$toasted.show('SIGNAL! : ' + JSON.stringify(trade), {
                        type: 'info',
                        duration: 3000
                    })

                })


                let pieChart = [
                    {label: 'In Positions', value: 50},
                    {label: 'Available', value: 50},
                ]
                this.sections = pieChart

                //Modals
                messageBus.$on('update', (window) => {
                    //this.getBalances()
                    this.loadConfig()
                })

                //open
                messageBus.$on('open', (window) => {
                    if (window == 'windowMinerTraderSelect') {
                        this.openMinerTraderSelect = true
                    }
                    if (window == 'windowEditBot') {
                        this.openEditBot = true
                    }
                    if (window == 'windowSetupExchange') {
                        this.openSetupExchange = true
                    }
                    if (window == 'windowSend') {
                        this.openSend = true
                    }
                    if (window == 'windowConfiguration') {
                        this.openConfiguration = true
                    }
                    if (window == 'windowDisplaySeed') {
                        this.openDisplaySeed = true
                    }
                    if (window == 'windowRestoreSeed') {
                        this.openRestoreSeed = true
                    }
                    if (window == 'windowPassword') {
                        this.openPassword = true
                    }
                    if (window == 'windowSetup') {
                        this.openSetup = true
                    }
                    if (window == 'windowWelcome') {
                        this.openWelcome = true
                    }
                    if (window == 'windowReceive') {
                        this.openReceive = true
                    }
                    if (window == 'windowRegister') {
                        this.openRegister = true
                    }
                    if (window == 'windowCheckPrivate') {
                        this.openCheckPrivate = true
                    }
                    if (window == 'windowCheckPrivate') {
                        this.openCheckPublic = true
                    }
                    if (window == 'windowFileSend') {
                        this.openFileSend = true
                    }
                    if (window == 'windowFinalize') {
                        this.openFinalize = true
                    }
                    if (window == 'windowHttpReceive') {
                        this.openHttpReceive = true
                    }
                    if (window == 'windowHedwigV1') {
                        this.openHedwigV1 = true
                    }
                    if (window == 'windowCheck') {
                        this.openCheck = true
                    }
                    if (window == 'windowLang') {
                        this.openLang = true
                    }
                    if (window == 'windowGnode') {
                        this.openGnode = true
                    }
                })

                //close
                messageBus.$on('close', (window) => {
                    if (window == 'windowMinerTraderSelect') {
                        this.openMinerTraderSelect = false
                    }
                    if (window == 'windowEditBot') {
                        this.openEditBot = false
                    }
                    if (window == 'windowSetupExchange') {
                        this.openSetupExchange = false
                    }
                    if (window == 'windowSend') {
                        this.openSend = false
                    }
                    if (window == 'windowDisplaySeed') {
                        this.openDisplaySeed = false
                    }
                    if (window == 'windowConfiguration') {
                        this.openConfiguration = false
                    }
                    if (window == 'windowRestoreSeed') {
                        this.openRestoreSeed = false
                    }
                    if (window == 'windowPassword') {
                        this.openPassword = false
                    }
                    if (window == 'windowSetup') {
                        this.openSetup = false
                    }
                    if (window == 'windowWelcome') {
                        this.openWelcome = false
                    }
                    if (window == 'windowReceive') {
                        this.openReceive = false
                    }
                    if (window == 'windowRegister') {
                        this.openRegister = false
                    }
                    if (window == 'windowCheckPrivate') {
                        this.openCheckPrivate = false
                    }
                    if (window == 'windowCheckPrivate') {
                        this.openCheckPublic = false
                    }
                    if (window == 'windowFileSend') {
                        this.openFileSend = false
                    }
                    if (window == 'windowFinalize') {
                        this.openFinalize = false
                    }
                    if (window == 'windowHttpReceive') {
                        this.openHttpReceive = false
                    }
                    if (window == 'windowHedwigV1') {
                        this.openHedwigV1 = false
                    }
                    if (window == 'windowCheck') {
                        this.openCheck = false
                    }
                    if (window == 'windowLang') {
                        this.openLang = false
                    }
                    if (window == 'windowGnode') {
                        this.openGnode = false
                    }
                })

            } catch (e) {
                this.$log.error(e)
            }
        },
        methods: {
            startMining: async function () {
				try{

				    //push to main start mining

				}catch(e){
				    this.$log.error(e)
				}
            },
            openResult: async function (name) {
                let path = "file://"+backtestDir+"/"+name
                this.$log.info("path: ", path)
                shell.openExternal(path)
            },
            editBot: async function (name) {
                this.$log.info("editBot bot name: ",name)
				this.openEditBot = true
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
            buySignal() {
                try {
                    this.$botService.buySignal()
                    this.updatePostition()
                } catch (e) {
                    this.$log.error(" Failed to go bull! ", e)
                }
            },
            sellSignal() {
                try {
                    this.$log.info("Sell signal! ")
                    this.$botService.sellSignal()
                    this.updatePostition()
                } catch (e) {
                    this.$log.error(" Failed to go bull! ", e)
                }
            },
            async startTrading() {
                try {

                    ipcRenderer.sendSync('sub-fomo-ws', this.selected)

                } catch (e) {
                    this.$log.error(" Failed to start trading! ", e)
                }
            },
            handleClick(item) {
                this.lastClicked = item;
                this.$log.info("item: ", item)

                //
                switch (item) {
                    case "Mine":
                        this.isMiner = true
                        this.isTrader = false
                        // code block
                        break;
                    case "Trade":
                        this.isTrader = true
                        this.isMiner = false

                        // code block
                        break;
                    case "Advanced Mode":
                        // code block
                        if (this.isAdvancedMode) {
                            this.isAdvancedMode = false
                        } else {
                            this.isAdvancedMode = true
                        }
                        break;
                    default:
                    // code block
                }
            },
            formatToPriceUSD(value) {
                return `<h4>$ ${Number(value).toFixed(2)}</h4>`;
            },
            updatePostition: async function () {
                try {
                    //
                    await this.$botService.updatePosition()
                    let status = await this.$botService.getSummaryInfo()
                    this.$log.info("status: ", status)

                    this.lastPrice = status.LAST_PRICE

                    if (status.BALANCE_AVAILABLE > 0) {
                        this.totalBalance = status.BALANCE_AVAILABLE
                        this.totalUSD = status.BALANCE_AVAILABLE * status.LAST_PRICE
                        this.isBear = status.IS_BEAR
                        this.isBull = status.IS_BULL
                        this.isFunded = true
                        this.isReady = true
                    }

                    //update positions
                    let positions = []
                    for (let i = 0; i < status.POSITIONS.length; i++) {
                        let position = status.POSITIONS[i]
                        let summary = {}

                        summary.size = position.openingQty
                        summary.leverage = position.leverage
                        summary.entry = position.avgCostPrice
                        summary.liquidation = position.liquidationPrice
                        summary.pnl = position.unrealisedPnl / 100000000
                        positions.push(summary)
                    }
                    this.positions = positions
                } catch (e) {
                    this.$log.error("e: ", e)
                }
            },
            loadConfig: async function () {
                let configStatus = checkConfigs()
                let config = getConfig()
                this.$log.info("config: ", config)

                let password = this.$walletService.getPassword()
                if (password) {
                    this.isNotConfiged = false

                    //init bot
                    await this.$botService.initClient(password)
                    //startSockets
                    await this.$botService.startSockets()

                    this.updatePostition()


                } else {
                    this.$log.info("Password Not Set! : ")
                }


                // if (!configStatus.isConfigured) {
                //     this.$log.info("checkpoint 3 No config found!")
                //     //open settings modal
                //     this.openWelcome = true
                // } else {
                //     this.$log.info("checkpoint 3a config found!")
                //     //isRegistered?
                //     if (configStatus.isRegistered) {
                //         this.$log.info("checkpoint 4a username found!")
                //         //startup
                //         //isPassword
                //         let password = this.$walletService.getPassword()
                //         if (password) {
                //             if (!this.username) {
                //                 this.username = config.username
                //             }
                //             if (!this.signingPub) {
                //                 this.signingPub = config.signingPub
                //             }
                //             if (!this.signingPriv) {
                //                 this.signingPriv = config.signingPriv
                //             }
                //
                //             //init bot
                //             await this.$botService.init(password)
                //
                // 			//test bitmex
                // 			let status = await this.$botService.getSummaryInfo()
                //
                //
                //
                // 			//if online
                // 			if(status.online){
                //
                // 			}
                //
                //
                //             // if (!this.signingPub || !this.signingPriv) {
                //             //     this.openRegister = true
                //             // }
                //         } else {
                //             this.openPassword = true
                //         }
                //
                //
                //     } else {
                //         //if wallet
                //         if (configStatus.isWallet) {
                //             this.$log.info("checkpoint 4b no username found!")
                //             //nerf register
                // 			this.openPassword = true
                // 			//this.openRegister = true
                //
                // 			//
                //
                //         } else {
                //             this.openWelcome = true
                //         }
                //     }
                // }
            },
            getUsers: function () {
                this.$http
                    .get(domain + "/online")
                    .then(response => {
                        this.$log.info("response: ", response.data)
                        this.$log.info("response: ", typeof (response.data))
                        let users = Object.keys(response.data)
                        this.$log.info("users: ", users)

                        //TODO remove yourself
                        let members = []
                        for (let i = 0; i < users.length; i++) {
                            //
                            let member = {}
                            member.username = users[i]
                            member.avatar = "http://api.adorable.io/avatars/30/" + users[i] + '.png'
                            members.push(member)
                        }

                        this.online = users
                        this.members = members
                    })
                    .catch((e) => {
                        this.error = true;
                        this.error = e;
                    });
            },
            displaySeed: function () {
                this.openDisplaySeed = true
            },
            update: function () {
                messageBus.$emit('update')
            },
            async announce() {
                //await this.get
                let joinEvent = {
                    event: "announce",
                    account: this.signingPub,
                    username: this.username,
                    status: "live",
                    message: "user " + this.username + " is online! ready to accept payments."
                }
                let signature = await service.signMessage(this.signingPub, JSON.stringify(joinEvent), this.signingPriv)
                this.$log.info("signature: ", signature)
                joinEvent.signature = signature
                socket.emit('join', JSON.stringify(joinEvent))
            },
            logout() {
                this.$log.debug('logout')
                ipcRenderer.send('quit')
            },
            autoRefresh(interval) {
                setInterval(() => {
                    if (this.ownerApiRunning) {
                        messageBus.$emit('update')
                    }
                }, interval)
            },
            async checkNewVersion() {
                let toUpdate = await checkUpdate()

                let message = this.$t('msg.app.available') + ": " + toUpdate.latest + "\n" + this.$t('msg.app.current') + ": " + toUpdate.current + "\n" + this.$t('msg.app.updateMsg')
                if (toUpdate && toUpdate.isUpdate) {
                    this.$electron.remote.dialog.showMessageBox({
                        type: 'info',
                        title: this.$t('msg.app.updateTitle'),
                        buttons: [this.$t('msg.app.yes'), this.$t('msg.app.no')],
                        message: message,
                    }, (res, checkboxChecked) => {
                        if (res === 0) {
                            this.$electron.shell.openExternal(downloadUrl)
                            this.$log.debug('User choose to update. now quit app.')
                            ipcRenderer.send('quit')
                        } else {
                            this.$log.info('User chose not to update.')
                        }
                    })
                }
            }
        }
    }
</script>

<style>
	/* CSS */
	.help-content {
		background-color: darkslateblue !important;
	}

	.help-tabs {
		margin-bottom: 10px !important;
	}

	.tabs li.is-active a {
		border-bottom-color: #000000;
		color: #7763A9;
		border-bottom: 3px solid;
		font-weight: bold;
	}

	code, pre {
		color: #1b1e21 !important;
		background-color: darkslateblue !important;
	}

	* {
		font-family: "Avenir", Helvetica, Arial, sans-serif;
	}

	span {
		font-size: 28px;
	}

	button {
		border: none;
		margin-left: 20px;
		padding: 10px;
		border-radius: 100px;
	}

	button:focus {
		outline: none;
	}


	body {
		margin: 0px;
		width: 100%;
	}

	.wrap {
		margin: 0px auto;
		width: 486px;
	}

	.text {
		text-align: center;
		margin-top: 56px;
		color: #fff;
		font-size: 1.0em;
		font-family: sans-serif;
		text-transform: uppercase;
	}

	.animated {
		animation-duration: 2.5s;
		animation-fill-mode: both;
		animation-iteration-count: infinite;
	}

	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-30px);
		}
		60% {
			transform: translateY(-15px);
		}
	}

	.bounce {
		animation-name: bounce;
	}

	@keyframes flash {
		0%, 50%, 100% {
			opacity: 1;
		}
		25%, 75% {
			opacity: 0;
		}
	}

	.flash {
		animation-name: flash;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	.pulse {
		animation-name: pulse;
		animation-duration: 1s;
	}

	@keyframes rubberBand {
		0% {
			transform: scale(1);
		}
		30% {
			transform: scaleX(1.25) scaleY(0.75);
		}
		40% {
			transform: scaleX(0.75) scaleY(1.25);
		}
		60% {
			transform: scaleX(1.15) scaleY(0.85);
		}
		100% {
			transform: scale(1);
		}
	}

	.rubberBand {
		animation-name: rubberBand;
	}

	@keyframes shake {
		0%, 100% {
			transform: translateX(0);
		}
		10%, 30%, 50%, 70%, 90% {
			transform: translateX(-10px);
		}
		20%, 40%, 60%, 80% {
			transform: translateX(10px);
		}
	}

	.shake {
		animation-name: shake;
	}

	@keyframes swing {
		20% {
			transform: rotate(15deg);
		}
		40% {
			transform: rotate(-10deg);
		}
		60% {
			transform: rotate(5deg);
		}
		80% {
			transform: rotate(-5deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}

	.swing {
		transform-origin: top center;
		animation-name: swing;
	}

	@keyframes wobble {
		0% {
			transform: translateX(0%);
		}
		15% {
			transform: translateX(-25%) rotate(-5deg);
		}
		30% {
			transform: translateX(20%) rotate(3deg);
		}
		45% {
			transform: translateX(-15%) rotate(-3deg);
		}
		60% {
			transform: translateX(10%) rotate(2deg);
		}
		75% {
			transform: translateX(-5%) rotate(-1deg);
		}
		100% {
			transform: translateX(0%);
		}
	}

	.wobble {
		animation-name: wobble;
	}

	@keyframes flip {
		0% {
			transform: perspective(400px) translateZ(0) rotateY(0) scale(1);
			animation-timing-function: ease-out;
		}
		40% {
			transform: perspective(400px) translateZ(150px) rotateY(170deg) scale(1);
			animation-timing-function: ease-out;
		}
		50% {
			transform: perspective(400px) translateZ(150px) rotateY(190deg) scale(1);
			animation-timing-function: ease-in;
		}
		80% {
			transform: perspective(400px) translateZ(0) rotateY(360deg) scale(.95);
			animation-timing-function: ease-in;
		}
		100% {
			transform: perspective(400px) translateZ(0) rotateY(360deg) scale(1);
			animation-timing-function: ease-in;
		}
	}

	.animated.flip {
		backface-visibility: visible;
		animation-name: flip;
	}

	@keyframes lightSpeedIn {
		0% {
			transform: translateX(100%) skewX(-30deg);
			opacity: 0;
		}
		60% {
			transform: translateX(-20%) skewX(30deg);
			opacity: 1;
		}
		80% {
			transform: translateX(0%) skewX(-15deg);
			opacity: 1;
		}
		100% {
			transform: translateX(0%) skewX(0deg);
			opacity: 1;
		}
	}

	.lightSpeedIn {
		animation-name: lightSpeedIn;
		animation-timing-function: ease-out;
	}

	@keyframes rollIn {
		0% {
			opacity: 0;
			transform: translateX(-100%) rotate(-120deg);
		}
		100% {
			opacity: 1;
			transform: translateX(0px) rotate(0deg);
		}
	}

	.rollIn {
		animation-name: rollIn;
	}

	@keyframes rotateIn {
		0% {
			transform-origin: center center;
			transform: rotate(-200deg);
			opacity: 0;
		}
		100% {
			transform-origin: center center;
			transform: rotate(0);
			opacity: 1;
		}
	}

	.rotateIn {
		animation-name: rotateIn;
	}

	@keyframes hinge {
		0% {
			transform: rotate(0);
			transform-origin: top left;
			animation-timing-function: ease-in-out;
		}
		20%, 60% {
			transform: rotate(80deg);
			transform-origin: top left;
			animation-timing-function: ease-in-out;
		}
		40% {
			transform: rotate(60deg);
			transform-origin: top left;
			animation-timing-function: ease-in-out;
		}
		80% {
			transform: rotate(60deg) translateY(0);
			transform-origin: top left;
			animation-timing-function: ease-in-out;
		}
		100% {
			transform: translateY(700px);
		}
	}

	.hinge {
		margin: 20px;
		animation-name: hinge;
	}

	@media all and (max-width: 680px) {
		.wrap {
			width: 100%;
		}

		.box {
			width: 100%;
			height: 55px;
			clear: both;
			margin: 0px auto;
		}

		.text {
			margin-top: 20px;
		}

		.hingebox, .flipbox {
			display: none;
		}
	}

</style>
