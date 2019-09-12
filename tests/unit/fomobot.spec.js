/*
    FOMOBOT test


 */


import bot from "../../src/modules/fomobot.js"

let TAG = " | fomobot-core-test | ";

describe('Fomo workflow', () => {
    it('should always have a test', () => {
        expect(true).toEqual(true)
    })

    let historicalTradeCount = 0

    it(' gets count of trades ', async () => {

        historicalTradeCount = await bot.getTransactionCount()
        console.log("historicalTradeCount: ",historicalTradeCount)

        expect(true).toEqual(true)

    });

    it(' if less get more backfill', async () => {





        expect(true).toEqual(true)

    });

    it(' list modals available ', async () => {

        //read modal dir
        let modalDirList =

        expect(true).toEqual(true)

    });

    it(' train modals ', async () => {


        expect(true).toEqual(true)

    });

    it(' backtest modals ', async () => {


        expect(true).toEqual(true)

    });

    it(' purge generation of modals ', async () => {


        expect(true).toEqual(true)

    });

    it(' load modal to trade bot ', async () => {


        expect(true).toEqual(true)

    });

    it(' start trade bot ', async () => {


        expect(true).toEqual(true)

    });

    it(' bot detects buy event submits order ', async () => {


        expect(true).toEqual(true)

    });

    it(' bot fulfills buy order ', async () => {


        expect(true).toEqual(true)

    });

})
