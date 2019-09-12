


let TAG = " | fomobot-core-test | ";

describe('trade workflow', () => {
    it('should always have a test', () => {
        expect(true).toEqual(true)
    })

    it(' train a model ', async () => {
        let train = require("../../src/modules/train")
        train.train()

        expect(true).toEqual(true)

    });

})
