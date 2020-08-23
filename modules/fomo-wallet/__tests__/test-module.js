/*


 */


let wallet = require("../lib")


wallet.onGetNewSeed()
    .then(function(resp){
        console.log(resp.seed)
        //
        wallet.onBuildWallet(resp.seed)
            .then(function(resp){
                console.log(resp)
            })

    })