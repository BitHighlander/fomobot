<template>
	<div>
		<b-container class="bv-example-row">
			<img @click="openSetupExchange" src="../assets/logos/bitmex-testnet-white.png" height="50px" width="150px">
			<br/><small class="text-white">(testnet)</small>
		</b-container>

		<chart :options="trade_chart"></chart>
<!--		<chart :options="chartOptionsBar"></chart>-->
	</div>


</template>

<script>
    const { shell } = require('electron')
    import { messageBus } from '@/messagebus'

	let trade_chart = {
        "useUTC":true,
        "grid":{
            "left":60,
            "right":60
        },
        "xAxis":[
            {
                "type":"time",
                "axisLabel":{

                }
            }
        ],
        "yAxis":[
            {
                "name":"Price",
                "position":"right",
                "scale":true
            },
            {
                "name":"Volume",
                "scale":true
            }
        ],
        "toolbox":{
            "show":true,
            "showTitle":false,
            "feature":{
                "dataZoom":{

                },
                "restore":{

                },
                "saveAsImage":{

                }
            }
        },
        "tooltip":{
            "trigger":"axis",
            "axisPointer":{
                "type":"cross"
            }
        },
        "dataZoom":[
            {
                "startValue":1566857220868
            },
            {
                "type":"inside"
            }
        ],
        "series":[
            {
                "name":"Price",
                "type":"line",
                "data":[{
                    "value":[
                        1566845762683,
                        10333.24
                    ]
                },
                    {
                        "value":[
                            1566845764860,
                            10333.24
                        ]
                    },
                    {
                        "value":[
                            1566845769880,
                            10335.71
                        ]
                    },
                    {
                        "value":[
                            1566845778720,
                            10335.71
                        ]
                    },
                    {
                        "value":[
                            1566845779303,
                            10335.71
                        ]
                    },
                    {
                        "value":[
                            1566845783628,
                            10335.71
                        ]
                    },
                    {
                        "value":[
                            1566845784222,
                            10335.62
                        ]
                    }
                ]
            },
            {
                "name":"Volume",
                "type":"bar",
                "yAxisIndex":1,
                "z":1,
                "itemStyle":{
                    "opacity":0.25
                },
                "data":[{
                    "value":[
                        1566845762683,
                        0.02431436
                    ]
                },
                    {
                        "value":[
                            1566845764860,
                            0.0013449
                        ]
                    },
                    {
                        "value":[
                            1566845769880,
                            0.00491076
                        ]
                    },
                    {
                        "value":[
                            1566845778720,
                            0.00972026
                        ]
                    },
                    {
                        "value":[
                            1566845779303,
                            0.00385158
                        ]
                    },
                    {
                        "value":[
                            1566845783628,
                            0.01896627
                        ]
                    },
                    {
                        "value":[
                            1566845784222,
                            0.00982056
                        ]
                    }
                ]
            },
            {
                "name":"High",
                "type":"candlestick",
                "z":1,
                "itemStyle":{
                    "color":"rgba(40,167,69,0.5)",
                    "borderColor":"#28a745",
                    "color0":"rgba(220,53,69,0.5)",
                    "borderColor0":"#dc3545"
                },
                "data":[
                    {
                        "value":[
                            1566858239999,
                            10159.68,
                            10156.01,
                            10156,
                            10160.01
                        ]
                    },
                    {
                        "value":[
                            1566858119999,
                            10154,
                            10159.68,
                            10154,
                            10159.93
                        ]
                    },
                    {
                        "value":[
                            1566857999999,
                            10154,
                            10154,
                            10153.99,
                            10154
                        ]
                    },
                    {
                        "value":[
                            1566857879999,
                            10154.35,
                            10153.99,
                            10153.51,
                            10154.35
                        ]
                    },
                    {
                        "value":[
                            1566857759999,
                            10163.45,
                            10153.48,
                            10152.37,
                            10164.99
                        ]
                    },
                    {
                        "value":[
                            1566857639999,
                            10167.45,
                            10163.43,
                            10161.56,
                            10167.45
                        ]
                    },
                    {
                        "value":[
                            1566857519999,
                            10168.01,
                            10167.45,
                            10167,
                            10173.11
                        ]
                    },
                    {
                        "value":[
                            1566857399999,
                            10160,
                            10167.82,
                            10159.58,
                            10169.39
                        ]
                    }
                ]
            },
            {
                "type":"line",
                "smooth":true,
                "lineStyle":{
                    "type":"dotted"
                },
                "data":[

                ],
                "tooltip":{
                    "show":false
                }
            },
            {
                "name":"Buy",
                "type":"scatter",
                "symbol":"triangle",
                "data":[

                ],
                "itemStyle":{
                    "color":"#28a745"
                },
                "markPoint":{
                    "symbol":"arrow",
                    "itemStyle":{
                        "color":"#28a745"
                    },
                    "symbolOffset":[
                        0,
                        10
                    ],
                    "data":[

                    ]
                }
            },
            {
                "name":"Sell",
                "type":"scatter",
                "symbol":"triangle",
                "symbolRotate":180,
                "data":[

                ],
                "itemStyle":{
                    "color":"#dc3545"
                },
                "markPoint":{
                    "symbol":"arrow",
                    "itemStyle":{
                        "color":"#dc3545"
                    },
                    "symbolRotate":180,
                    "symbolOffset":[
                        0,
                        -10
                    ],
                    "data":[

                    ]
                }
            }
        ]
    }


    export default {
        name: "Exchanges",
        data() {
            return {
                trade_chart:trade_chart,
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
