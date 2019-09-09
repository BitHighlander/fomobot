/*
    FOMOBOT test


 */


import bot from "../../src/modules/fomobot.js"

let TAG = " | fomo-api-test | ";

let account;
let apiKey;

describe('Fomo workflow', () => {
    it('should always have a test', () => {
        expect(true).toEqual(true)
    })

    it(' test can generate API keys ', async () => {

        let newSeed = await wallet.onGetNewSeed();
        log.debug(TAG, "newSeed: ", newSeed);


        let newWallet = await wallet.onBuildWallet(newSeed.seed);
        log.debug(TAG, "newWallet: ", newWallet.account);
        log.debug(TAG, "apiKey: ", newWallet.apiKey);

        account = newWallet.account;
        apiKey = newWallet.apiKey;

        expect(true).toEqual(true)
    });


})
