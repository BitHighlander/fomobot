
//********************************************************

// bitmex

//                              - modularized Client
//********************************************************

const TAG = " | bitmex | "

//*********************************
//        Requires
//*********************************

const exchangeName = 'bitmex'
let {BitmexAPI} = require("bitmex-node")

//*********************************
//         Module
//*********************************

let client = {}
module.exports = {
    //async
    innitilize:function(public,private){
        client  = new BitmexAPI({
            "apiKeyID": public || "FGiRBC_lzxicpWlsSA2714Sy",
            "apiKeySecret": private || "APSAKyl4BZi1OB0RMuptfTvB7b7E3PlVDDuj_wSGMbujh8-D",
            "testnet":true
            //"proxy": "https://cors-anywhere.herokuapp.com/"
        })
    },
    name: function() {
        return exchangeName;
    },
    // //promise
    // initialize: function() {
    //     return initialize_binance();
    // },
    // coins: function() {
    //     return get_coins();
    // },
    //
    // coinInfo: function(coin) {
    //     return get_coin_info(coin);
    // },
    //
    // getTicker: function(market) {
    //     return get_ticker(market);
    // },
    //
    // getSummary: function() {
    //     return get_Summary();
    // },
    // address: function(account, coin) {
    //     return get_new_address(account, coin);
    // },
    // addresses: function() {
    //     return get_addresses();
    // },
    // cancel: function(orderId, symbol, account) {
    //     return cancel_order(orderId, symbol, account);
    // },

    //
    // run: function() {
    //     return run_binance();
    // },
    //
    // status: function() {
    //     return get_binance_status();
    // },
    //
    // getpairs: function() {
    //     return get_all_pairs();
    // },
    //

    // balances: function(account) {
    //     return get_balances(account);
    // },
    //
    // ordersOpen: function(account) {
    //     return get_open_orders(account);
    // },
    //
    // getOrder: function(uuid) {
    //     return lookup_order(uuid);
    // },

    //
    // withdrawal: function(coin,amount,destination) {
    //     return withdrawal_coin(coin,amount,destination);
    // },

    // getorderbook: function(pair) {
    //     return get_orderbook(pair);
    // },

    // transferHistory: function(coin) {
    //     return get_transfer_history(coin);
    // },
    //
    //
    // withdrawalHistory: function(coin) {
    //     return get_withdrawal_history(coin);
    // },
    //
    // depositHistory: function(coin) {
    //     return get_deposit_history(coin);
    // },
    //
    // bid: function(account,pair, rate,amount) {
    //     return post_bid(account,pair,  rate,amount);
    // },
    //
    // ask: function(account,pair,  rate,amount) {
    //     return post_ask(account,pair,  rate,amount);
    // },
    //
    // bidMarket: function(pair, amount) {
    //     return post_bid_market(pair,  amount);
    // },
    //
    // askMarket: function(pair, amount) {
    //     return post_ask_market(pair, amount);
    // }

};
