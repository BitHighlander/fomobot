/**
 * Created by highlander on 2/26/17.
 */
const urban = require('urban')
const when = require('when')



module.exports = {
    //initialize
    define: function (input) {
        return get_urban_defination(input)
    }
}

/*****************************************
 // Primary
 //*****************************************/


var get_urban_defination = function(input){
    var tag = " | aiml_response | "
    var d = when.defer();
    let debug = false
    let trollface = urban(input);
    if(debug) console.log(tag,"trollface: ",trollface)
    //mode first
    trollface.first(function(json) {
        if(debug) console.log(json);
        d.resolve(json)
    });

    //return all

    return d.promise;
}
