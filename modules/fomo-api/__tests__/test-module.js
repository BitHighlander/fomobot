
let fomo = require("../lib")


let urlSpec = "http://127.0.0.1:8000/spec/swagger.json"
//let urlSpec = "https://fomobro.com/spec/swagger.json"
console.log(urlSpec)


let run_test = async function(){
    try{
        await fomo.init(urlSpec,{apiKey:'test'})

        let url = await fomo.url()
        console.log("url: ",url)

        //health
        let health = await fomo.health()
    }catch(e){
        console.error(e)
    }
}

run_test()
