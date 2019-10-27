/**
 * Created by highlander on 12/16/16.
 */

//TODO convert Mocha syntax to jest

let Accounting = require("../index")
let redis = require("fakeredis").createClient("6379", "127.0.0.1");
let accounting = new Accounting(redis)


describe('Accounting Module', function ()
{

    afterEach(async function ()
    {
        await(redis.flushdb())
    })

    //
    describe('Should Handle Accuracy Correctly', function ()
    {
        it.skip('Should not cut off any decimals', async function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            let balance = await(accounting.credit(orderId,1.23456789,"btc"))
            expect(balance).to.be.equal(123456789)
        })

        it.skip('Should not allow a 0 credit', function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            return expect(accounting.credit(orderId,0,"eth"))
                .to.eventually.be.rejectedWith("ERROR:CREDIT:200 failed to credit!")
        })

        it.skip('Should throw if empty account', function ()
        {
            var orderId = ""
            return expect(accounting.credit(orderId,0,"eth"))
                .to.eventually.be.rejectedWith("ERROR:CREDIT:200 failed to credit!")
        })

        it.skip('Should throw if empty coin', function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            return expect(accounting.credit(orderId,0,""))
                .to.eventually.be.rejectedWith("ERROR:CREDIT:200 failed to credit!")
        })

        it.skip('Should throw if unknown coin', function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            return expect(accounting.credit(orderId,0,"XMR"))
                .to.eventually.be.rejectedWith("ERROR:CREDIT:200 failed to credit!")
        })

        it.skip('Should not allow a 0 debit', function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            return expect(accounting.debit(orderId,0,"btc"))
                .to.eventually.be.rejectedWith("ERROR:CREDIT:300 failed to debit!")
        })


        it.skip('Should not allow a negative credit', function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            return expect(accounting.credit(orderId,-1,"eth"))
                .to.eventually.be.rejectedWith("ERROR:CREDIT:200 failed to credit!")
        })


        it.skip('Should not allow a negitive debit', function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            return expect(accounting.debit(orderId,-1,"btc"))
                .to.eventually.be.rejectedWith("ERROR:CREDIT:300 failed to debit!")
        })

    })

    describe('Should Handle Precision Correctly', function ()
    {

        it.skip('Should be able to credit a single satoshi', async function ()
        {
            let orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            let balance = await(accounting.credit(orderId,1,"BTC"))
            expect(balance).to.be.equal(100000000)
            let balance2 = await(accounting.credit(orderId,0.00000001,"BTC"))
            expect(balance2).to.be.equal(100000001)

            let balance3 = await(accounting.balance(orderId,"BTC"))
            expect(balance3).to.be.equal(1.00000001)
        })

        it.skip('Should be able to debit a single satoshi', async function ()
        {
            let orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            let balance = await(accounting.credit(orderId,1,"BTC"))
            expect(balance).to.be.equal(100000000)
            let balance2 = await(accounting.debit(orderId,0.00000001,"BTC"))
            expect(balance2).to.be.equal(99999999)

            // let balance3 = await(accounting.balance(orderId,"BTC"))
            // expect(balance3).to.be.equal(99999999)
        })

        it.skip('Should error on too many decimals', function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            return expect(accounting.credit(orderId,1.000000001,"eth"))
                .to.eventually.be.rejectedWith("ERROR:CREDIT:200 failed to credit!")
        })


    })

    describe('Should Not Allow Overdrafts', function ()
    {
        it.skip('Should throw on overdraft', async function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            let balance = await(accounting.credit(orderId,1,"BTC"))
            expect(balance).to.be.equal(100000000)

            return expect(accounting.debit(orderId,1.00000001,"BTC"))
                .to.eventually.be.rejectedWith("ERROR:CREDIT:300 failed to debit!")

        })

        it.skip('Should allow a 0 balance', async function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            let balance = await(accounting.credit(orderId,1,"BTC"))
            expect(balance).to.be.equal(100000000)

            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            let balance2 = await(accounting.debit(orderId,1,"BTC"))
            expect(balance2).to.be.equal(0)
        })
    })

    describe('Should Be flexible with input types', function ()
    {
        it.skip('Should not error on string Credit', async function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            let balance = await(accounting.credit(orderId,"1","BTC"))
            expect(balance).to.be.equal(100000000)
        })

        it.skip('Should not error on string Debit', async function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            let balance = await(accounting.credit(orderId,"1","BTC"))
            expect(balance).to.be.equal(100000000)

            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            let balance2 = await(accounting.debit(orderId,"1","BTC"))
            expect(balance2).to.be.equal(0)
        })

    })

    describe('Should Display balances correctly', function ()
    {
        it.skip('Should throw on empty account', async function ()
        {
            var orderId = ""
            return expect(accounting.balance(orderId,"BTC"))
                .to.eventually.be.rejectedWith("ERROR:BALANCE:100 failed to find balance")

        })

        it.skip('Should throw on unknown account', async function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            let balance = await(accounting.balance(orderId,"BTC"))
            expect(balance).to.be.equal(0)
        })

        it.skip('Should throw on unknown coin', async function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            return expect(accounting.balance(orderId,"XMR"))
                .to.eventually.be.rejectedWith("ERROR:BALANCE:100 failed to find balance")
        })

        it.skip('Should throw on empty coin', async function ()
        {
            var orderId = "520ff060-0ed3-4f4f-9738-23b39625062f"
            return expect(accounting.balance(orderId,""))
                .to.eventually.be.rejectedWith("ERROR:BALANCE:100 failed to find balance")
        })
    })


})
