

let trades = [
    { _id: 'bitmex.BTC-USD-f00683cf-b4ce-cbd5-27d2-5155f58ed306',
        trade_id: 'f00683cf-b4ce-cbd5-27d2-5155f58ed306',
        time: 1552469616123,
        unix: 1552469616123,
        human: '03/13/2019',
        size: 2,
        side: 'Sell',
        price: 4268.5,
        id: 'bitmex.BTC-USD-f00683cf-b4ce-cbd5-27d2-5155f58ed306',
        selector: 'bitmex.BTC-USD' },
    { _id: 'bitmex.BTC-USD-ef21c0ac-5bf6-8633-c1e7-69e3f9752173',
        trade_id: 'ef21c0ac-5bf6-8633-c1e7-69e3f9752173',
        time: 1552469840053,
        unix: 1552469840053,
        human: '03/13/2019',
        size: 6,
        side: 'Sell',
        price: 4269,
        id: 'bitmex.BTC-USD-ef21c0ac-5bf6-8633-c1e7-69e3f9752173',
        selector: 'bitmex.BTC-USD' },
    { _id: 'bitmex.BTC-USD-caa27aba-db50-3b52-2653-6453157667a2',
        trade_id: 'caa27aba-db50-3b52-2653-6453157667a2',
        time: 1552470348169,
        unix: 1552470348169,
        human: '03/13/2019',
        size: 9,
        side: 'Sell',
        price: 4270,
        id: 'bitmex.BTC-USD-caa27aba-db50-3b52-2653-6453157667a2',
        selector: 'bitmex.BTC-USD' },
    { _id: 'bitmex.BTC-USD-cb514d67-1248-1129-1788-3fa2fbe40113',
        trade_id: 'cb514d67-1248-1129-1788-3fa2fbe40113',
        time: 1552470491054,
        unix: 1552470491054,
        human: '03/13/2019',
        size: 2,
        side: 'Sell',
        price: 4270,
        id: 'bitmex.BTC-USD-cb514d67-1248-1129-1788-3fa2fbe40113',
        selector: 'bitmex.BTC-USD' },
    { _id: 'bitmex.BTC-USD-a0fb48de-14a5-3e24-5c53-d23a17629454',
        trade_id: 'a0fb48de-14a5-3e24-5c53-d23a17629454',
        time: 1552470511306,
        unix: 1552470511306,
        human: '03/13/2019',
        size: 1,
        side: 'Sell',
        price: 4270,
        id: 'bitmex.BTC-USD-a0fb48de-14a5-3e24-5c53-d23a17629454',
        selector: 'bitmex.BTC-USD' },
    { _id: 'bitmex.BTC-USD-f140b28d-035d-b75c-c6f4-fd466bbb12a2',
        trade_id: 'f140b28d-035d-b75c-c6f4-fd466bbb12a2',
        time: 1552470529055,
        unix: 1552470529055,
        human: '03/13/2019',
        size: 2,
        side: 'Sell',
        price: 4270,
        id: 'bitmex.BTC-USD-f140b28d-035d-b75c-c6f4-fd466bbb12a2',
        selector: 'bitmex.BTC-USD' },
    { _id: 'bitmex.BTC-USD-91429580-6da6-e4cb-58e2-0c2935f9f008',
        trade_id: '91429580-6da6-e4cb-58e2-0c2935f9f008',
        time: 1552470569055,
        unix: 1552470569055,
        human: '03/13/2019',
        size: 2,
        side: 'Buy',
        price: 4276,
        id: 'bitmex.BTC-USD-91429580-6da6-e4cb-58e2-0c2935f9f008',
        selector: 'bitmex.BTC-USD' },
    { _id: 'bitmex.BTC-USD-034b1d25-8d85-44d7-aa5e-d39fce35f9b6',
        trade_id: '034b1d25-8d85-44d7-aa5e-d39fce35f9b6',
        time: 1552470956323,
        unix: 1552470956323,
        human: '03/13/2019',
        size: 4,
        side: 'Buy',
        price: 4273.5,
        id: 'bitmex.BTC-USD-034b1d25-8d85-44d7-aa5e-d39fce35f9b6',
        selector: 'bitmex.BTC-USD' },
    { _id: 'bitmex.BTC-USD-f27a88ad-7399-c3d7-b487-de9065cac4c4',
        trade_id: 'f27a88ad-7399-c3d7-b487-de9065cac4c4',
        time: 1552471052050,
        unix: 1552471052050,
        human: '03/13/2019',
        size: 2,
        side: 'Buy',
        price: 4273,
        id: 'bitmex.BTC-USD-f27a88ad-7399-c3d7-b487-de9065cac4c4',
        selector: 'bitmex.BTC-USD' },
    { _id: 'bitmex.BTC-USD-1e86bc14-5c5a-60a4-9689-1277b11b1b53',
        trade_id: '1e86bc14-5c5a-60a4-9689-1277b11b1b53',
        time: 1552471130094,
        unix: 1552471130094,
        human: '03/13/2019',
        size: 12,
        side: 'Sell',
        price: 4269,
        id: 'bitmex.BTC-USD-1e86bc14-5c5a-60a4-9689-1277b11b1b53',
        selector: 'bitmex.BTC-USD' } ]

//sort by time
//trades.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));

//get start
let start = trades[0]
console.log("start: ",start)

//get end
let end = trades[trades.length - 1]
console.log("end: ",end)

//target 3 candles
let difference = end.time - start.time
    console.log("difference: ",difference)

let intervals  = difference / 5
console.log("intervals: ",intervals)

//get intervals
var arrays = [], size = 3;

while (a.length > 0)
    arrays.push(a.splice(0, size));


//

// function convertToOHLC(data) {
//     var parsedData = data,
//         pointStart = parsedData[0].date,
//         range = [],
//         low,
//         high,
//         ranges = [],
//         dataOHLC = [],
//         interval = 60 * 1000; // 1 minute candles
//
//     parsedData.sort(function(a, b) {
//         return a.date - b.date
//     });
//
//     parsedData.forEach(function(i, el) {
//         if (pointStart + interval < el.time) {
//             ranges.push(range.slice());
//             range = [];
//             range.push(el);
//             pointStart = pointStart + interval;
//         } else {
//             range.push(el);
//         }
//
//         if (i === parsedData.length - 1) {
//             ranges.push(range);
//         }
//     });
//
//     ranges.forEach( function(i, range) {
//         low = range[0].price;
//         high = range[0].price;
//
//         range.forEach(function(i, el) {
//             low = Math.min(low, el.price);
//             high = Math.max(high, el.price);
//         });
//
//         dataOHLC.forEach({
//             x: range[0].date + 30 * 1000,
//             open: Number(range[0].price),
//             high: high,
//             low: low,
//             close: Number(range[range.length - 1].price)
//         });
//     });
//
//     return dataOHLC
// }
//
// let candles = convertToOHLC(trades)
// console.log(candles)
