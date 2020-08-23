/**
 * Created by highlander on 4/29/17.
 */
/**
 * Created by highlander on 4/24/17.
 */
/**
 * Created by highlander on 4/22/17.
 */

var fs = require('fs')

var RiveScript = require('rivescript')
var bot = new RiveScript();



// Load a directory full of RiveScript documents (.rive files). This is for
// Node.JS only: it doesn't work on the web!
//bot.loadDirectory("brain", loading_done, loading_error);

// Load an individual file.
//bot.loadFile("brain/testsuite.rive", loading_done, loading_error);

// Load a list of files all at once (the best alternative to loadDirectory
// for the web!)
// bot.loadDirectory("./nlp/brain", loading_done, loading_error);


var prompt = 'You: ';


let TAG = " | reddit | "

module.exports = {
    //save entire user history to file
    initialize:async function(){
        await bot.loadDirectory("./nlp/brain", loading_done, loading_error);
        return true
    },
    respond:function(input){
        bot.setUservar("local-user", "origMessage", input);
        return bot.reply("local-user", input);
    },
    //create
    create:function(trigger,response){
        return create_rive(trigger,response);
    },
    //read

    //update

    //destroy
}

/*****************************************
 // Primary
 //*****************************************/

var create_rive = async function (trigger,response) {
    var tag = " | get_response | "
    let debug = true
    try{
        //
        trigger = trigger.replace(".","")
        response = response.replace(".","")
        response = response.trim()
        let entry = ""
        if(debug) console.log(tag,"response: ",response)
        if(debug) console.log(tag,"response: ",response[0])
        if(response[0] == "@"){
            entry = "\n \n + "+trigger+" \n "+response
        }else{
            entry = "\n \n + "+trigger+" \n - "+response
        }



        fs.appendFile('./nlp/brain/begin.rive', entry, function (err) {});

        //restart brain

        await bot.loadDirectory("./nlp/brain", loading_done, loading_error);
        return true
    }catch(e){
        console.error(tag,"Error: ",e)
    }
}




//lib
function loading_done (batch_num) {
    let debug = false
    if(debug) console.log("Batch #" + batch_num + " has finished loading!");

    // Now the replies must be sorted!
    bot.sortReplies();

}

// It's good to catch errors too!
function loading_error (error) {
    throw Error("100: Error when loading files: " + error);
}



















/*

    Example RIVE

 + bitcoin
 - Bitcoin is an innovative payment network and a new kind of money.
 */

// let entry = "\n \n + litecoin \n - is a shitcoin"
//
// fs.appendFile('./brain/bitcoin.rive', entry, function (err) {});




//CRUD rive files

//create

//read

//update
//find where param = value
//if not found insert
//if found (replace?) <combine>

//destroy
