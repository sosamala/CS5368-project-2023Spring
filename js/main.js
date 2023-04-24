$(document).ready(function() {
    
    var isVolume = true;
    var debugEnabled = true;

    $("#btSend").on('click', function(){
        textarea = $("#taMessage");
        value = textarea.val();
        if(value.trim().length == 0) {
            return;
        }
        sendMessage(value);
        value = textarea.val("");
    });

    $("#taMessage").keyup(function(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13) {  // Enter keycode
            e.preventDefault();
            $("#btSend").click();
        }
     });


     $("#btMic").click(function(e) {
        recognition.start();
        console.log("Listening...");
     });

    recognition.onresult = (event) => {
        $("#taMessage").val(event.results[0][0].transcript);    
    };

    $("#btSpeakers").click(function(e){
       isVolume = !isVolume;
       console.log(isVolume)
       if(isVolume){
        $("#imgVolume").attr('src','css/fonts/volume-up.svg');
       } else {
        synth.cancel()
        $("#imgVolume").attr('src','css/fonts/volume-mute.svg');
       }
    });

    //$.ajax("bot-commands.json", function(data) {console.log(data)});
    //console.log(commands);

    var context = getEmptyContext(); 

    function sendMessage(message) {

        /* update UI */
        divMessages = $("#diMessages");
        var newDiv = document.createElement('div');
        newDiv.className = 'right-message';
        newDiv.innerHTML = message;
        divMessages.append(newDiv)
        $('#chatbody').scrollTop($('#chatbody')[0].scrollHeight);

        /* callbackend*/
        processMessage(message);

    }

    function recieveMessage(message) {

        /* update UI */
        divMessages = $("#diMessages");
        var newDiv = document.createElement('div');
        newDiv.className = 'left-message';
        newDiv.innerHTML = message;
        divMessages.append(newDiv)
        $('#chatbody').scrollTop($('#chatbody')[0].scrollHeight);

        displayContext();

        if(isVolume) {
        synth.cancel();
        const utterThis = new SpeechSynthesisUtterance(message);
        utterThis.voice = synth.getVoices()[2];
        utterThis.pitch = specch_pitch;
        utterThis.rate = speech_rate;
        synth.speak(utterThis);
        }

    }

    function processMessage(message) {

        // clean the message
        message = message.toLowerCase().trim().replace(/[^a-z0-9$ ]/g, "");

        //process if expecting a response first :O 
        if(context != null && context.expecting_a_response != null) {
            var ex_return  = process_exc(message);
            if(ex_return != null) {
                return process_msg_response(process_exc_response(ex_return));
            }            
        }

        // process regex first :)
        var pr_return = process_regex(message);
        if(pr_return != null) {
            return process_msg_response(process_regex_response(pr_return));
        }

        // process percentile later :thumbsup
        var pp_return = process_percentile(message);
        if(pp_return != null) {
            return process_msg_response(process_percentile_response(pp_return));
        }

        process_msg_response({"data": "I don't understand what you said, could you please retry? Thanks :)"});


    }

    // Process Expecting responses Method.
    function process_exc(message) {

        if(context.expecting_a_response == "q1") {

            message = message.replace(/[^a-z]/g, "");
            if(positive_response.includes(message)) {
                context.res = context.saved_suff.data[1];
                context.res_id = context.saved_suff.data[0];
                response_message = `Awesome! what more do you want to know about the Restaurant '{}'?
                To know what you can ask me now say "what can I ask now?".
                `.format([res_hash_name[context.saved_suff.data[1]]]);
                return {'data': response_message, 'tag':'string'};
            } else if(negative_response.includes(message)) {
                context.saved_suff.negative_response = true;
                process_regex_response(process_regex('suggest restaurant'));
                return {'data': null , 'tag':'string'}
            } else {
                return null;
            }

        } else if(context.expecting_a_response == "q5") {
            message = message.replace(/[^0-9]/g, "");
            try {
                option = Number(message)
                if(option <= context.saved_suff.data_q5.length && option > 0) {
                    option = option - 1
                    context.res = context.saved_suff.data_q5[option][1];
                    context.res_id = context.saved_suff.data_q5[option][0];
                    response_message = `Awesome! what more do you want to know about the Restaurant '{}'? 
                    To know what you can ask me now say "what can I ask now?".
                    `.format([res_hash_name[context.saved_suff.data_q5[option][1]]]);
                    console.log({'data': response_message, 'tag':'string'})
                    return {'data': response_message, 'tag':'string'};
                }
            }
            catch(err) {
                console.log(err)
                return null;
            }
        } else if(context.expecting_a_response == "q4") {
            message = message.replace(/[^0-9]/g, "");
            try {
                option = Number(message)
                if(option <= context.saved_suff.data_q4.length && option > 0) {
                    option = option - 1
                    context.res = context.saved_suff.data_q4[option][1];
                    context.res_id = context.saved_suff.data_q4[option][0];
                    response_message = `Awesome! what more do you want to know about the Restaurant '{}'?  
                    To know what you can ask me now say "what can I ask now?".
                    `.format([res_hash_name[context.saved_suff.data_q4[option][1]]]);
                    d({'data': response_message, 'tag':'string'})
                    return {'data': response_message, 'tag':'string'};
                }
            }
            catch(err) {
                console.log(err)
                return null;
            }
        } else if(context.expecting_a_response == "q3") {
            message = message.replace(/[^0-9]/g, "");
            try {
                option = Number(message)
                if(option <= context.saved_suff.data_q3.length && option > 0) {
                    option = option - 1
                    context.res = context.saved_suff.data_q3[option][0];
                    context.res_id = context.saved_suff.data_q3[option][1];
                    response_message = `Awesome! what more do you want to know about the Restaurant '{}' ?.  
                    To know what you can ask me now say "what can I ask now?".
                    `.format([res_hash_name[context.saved_suff.data_q3[option][0]]]);
                    console.log({'data': response_message, 'tag':'string'})
                    return {'data': response_message, 'tag':'string'};
                }
            }
            catch(err) {
                console.log(err)
                return null;
            }
        } else if(context.expecting_a_response == "q2") {
            message = message.replace(/[^0-9]/g, "");
            try {
                option = Number(message)
                if(option <= context.saved_suff.data_q2.length && option > 0) {
                    option = option - 1
                    context.res = context.saved_suff.data_q2[option][1];
                    context.res_id = context.saved_suff.data_q2[option][0];
                    response_message = `Awesome! what more do you want to know about the Restaurant '{}' ?.  
                    To know what you can ask me now say "what can I ask now?".
                    `.format([res_hash_name[context.res]]);
                    console.log({'data': response_message, 'tag':'string'})
                    return {'data': response_message, 'tag':'string'};
                }
            }
            catch(err) {
                console.log(err)
                return null;
            }
        } else if(context.expecting_a_response == "asknow") {
            message = message.replace(/[^0-9]/g, "");
            try {
                option = Number(message)
                if(option <= 5 && option > 0) {
                    if(option == 1) {
                        process_regex_response(process_regex('what cuisine this restaurant serves'));
                    } else if(option == 2) {
                        process_regex_response(process_regex('the menu'));
                    } else if(option == 3) {
                        process_regex_response(process_regex('budget range of this restaurant'));
                    } else if(option == 4) {
                        process_regex_response(process_regex('restaurant located'));
                    } else if(option == 5) {
                        process_regex_response(process_regex('food categories served in this restaurant'));
                    }
                    return {'data': null , 'tag':'string'}
                }
            }
            catch(err) {
                d(err)
                return null;
            }
        } else if (context.expecting_a_response == "q7") {
            message = message.replace(/[^0-9]/g, "");
            try {
                option = Number(message)
                if (option <= context.saved_suff.data_q7.length && option > 0) {
                    option = option - 1
                    context.res = context.saved_suff.data_q7[option][3];
                    context.res_id = context.saved_suff.data_q7[option][0];
                    response_message = `Awesome! what more do you want to know about the Restaurant '{}' ?.  
                    To know what you can ask me now say "what can I ask now?".
                    `.format([res_hash_name[context.saved_suff.data_q7[option][3]]]);
                    d({ 'data': response_message, 'tag': 'string' })
                    return { 'data': response_message, 'tag': 'string' };
                }
            }
            catch (err) {
                d(err)
                return null;
            }
        }

        return null;

    }

    function process_exc_response(ex_return) {
        if(ex_return.tag === 'string') {
            return ex_return;
        }
    }


    function process_regex(message) {
        const c_objects = commands["commands_r"];
        for(x of c_objects) {
            for(p of x.pattern) {
                reg = RegExp(p);
                response = reg.exec(message);
                if(response != null) return { "regex" : response , "data": x};
            }
        }
        return null;
    }

    function process_regex_response(pr_return) {
        d(pr_return)
        if(pr_return.data.response_type === "string") {
            if(pr_return.data.expecting_a_response != null) {
                context.expecting_a_response = pr_return.data.expecting_a_response;
                d('test')
                d(pr_return.data.expecting_a_response)
            }
            return {"data": pr_return.data.response}
        }

        if(pr_return.data.response_type === "calculated") {
            var response_case = pr_return.data.response;
            var regex = pr_return.regex;
            if(response_case === "r_1") {
                return {"data": "All Hail " + regex[1] + "!!!!" };
            }
            else if(response_case === 'q1'){
                params = []
                unknowns = 0;
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                query_name = 'name';
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
            }
            else if(response_case === 'q2'){
                params = [];
                unknowns = 0;
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                query_name = 'scoreByName';
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
            }
            else if(response_case === 'q3'){
                params = [];
                unknowns = 0;
                params.push(unknown_names[unknowns++]);
                params.push(regex[2].length);
                params.push(unknown_names[unknowns++]);
                query_name = 'priceRangeByName';
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
            }
            else if(response_case === 'q4'){
                zipcode = regex[2];
                params = []
                unknowns = 0;
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                params.push(res_zip_hash[zipcode])
                query_name = 'zipcodeByNameAndId';
                context.inputs = {"zipcode" : zipcode };
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
                
            }
            else if(response_case === 'q5'){
                category = regex[2]
                params = []
                unknowns = 0;
                params.push(res_cat_hash[category])
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                query_name = 'getRestaurantByCategory';
                context.res_cat=category
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
            }
            else if(response_case === 'q6'){
                params = []
                unknowns = 0;
                d("regex "+regex[1])
                d(res_name_hash[regex[1]])
                params.push(unknown_names[unknowns++])
                params.push(res_name_hash[regex[1]])
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                query_name = 'getRestaurantDetails';
                context.q6_res_name_hash = res_name_hash[regex[1]];
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
            } else if (response_case === 'q7') {
                params = []
                unknowns = 0;
                const food_item_id = res_food_hash[regex[2].trim()];
                context.food_item_name = regex[2].trim();
                context.food_item_id = food_item_id;
                d(regex[2].trim()+" "+food_item_id)
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                params.push(food_item_id)
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                query_name = 'getRestaurantNameByFoodItem';
                return createAndMakeQuery(query_name, params, unknowns, pr_return, regex[2].trim());
            } else if(response_case === 'q1_sq1'){
                params = []
                unknowns = 0;
                params.push(context.res_id)
                params.push(unknown_names[unknowns++])
                query_name = 'category';
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
            }
            else if(response_case === 'q1_sq2'){
                params = []
                unknowns = 0;
                params.push(context.res_id)
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                params.push(unknown_names[unknowns++])
                query_name = 'getMenuByRestaurant';
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
            }
            else if(response_case === 'q1_sq3'){
                params = []
                unknowns = 0;
                params.push(context.res_id)
                params.push(unknown_names[unknowns++])
                query_name = 'getPriceRange';
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
            }
            else if(response_case === 'q1_sq4'){
                params = []
                unknowns = 0;
                params.push(context.res_id)
                params.push(unknown_names[unknowns++])
                query_name = 'fullAddress';
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
            }
            else if(response_case === 'q1_sq5'){
                params = []
                unknowns = 0;
                params.push(context.res_id)
                params.push(unknown_names[unknowns++])
                query_name = 'hasFoodCategory';
                return createAndMakeQuery(query_name, params, unknowns, pr_return);
            }
        }
        
        return null;
    }


    function process_percentile(message) {
        tokens = message.split(' ');
        const c_objects = commands["commands_p"];
        max_percentage = 0;
        max_percentage_obj = null;
        //debugger;
        for(x of c_objects) {

            must_have = false;
            if(x.must_have != null) {
                dance:
                for(y of x.must_have) {
                    if(tokens.includes(y)) {
                        must_have = true;
                    } else {
                        must_have = false;
                        break dance;
                    }
                }
            } else {
                must_have = true;
            }


            if(must_have) {
                hits = 0
                total = x.pattern.length

                if(x.must_have != null) {
                    hits += x.must_have.length
                    total += x.must_have.length
                }
                
                for(z of tokens) {
                    if(x.pattern.includes(z)) {
                        hits += 1;
                    }
                }

                percentage = (hits / total )* 100;
                if(percentage > max_percentage) {
                    max_percentage = percentage
                    max_percentage_obj = x
                }
                
                
            }
        }
        if(max_percentage_obj === null)
            return null;
        return  {"data": max_percentage_obj}
    }


    function process_percentile_response(pp_return) {
        if(pp_return.data.response_type === "string") {
            return {"data": pp_return.data.response}
        }

        if(pp_return.data.response_type === "calculated") {
            var response_case = pp_return.data.response;
           
        }
        
        return null;

    }

    function process_msg_response(msgresponse) {
        if(msgresponse != null && msgresponse.data != null) {
            recieveMessage(msgresponse.data)
        }
    }

    function displayContext() {
        console.log(context)
    }

    function getEmptyContext() {
        /*return {
            "r": null, // resuturanut 
            "rc": null, // resturaunt category
            "fc": null, // food category
            "ap": null, // address postal
            "as": null, // address state
            "ac": null, //address city
            "fp": null, // food price
            "v": [], // values like numbers, etc etc
            "er": null, // what type of response is it expecting ?
            "dr": null, // default response
            "tries": 0 // number of tries to get valid a response from user
        }*/
        return {
            "talking_about": "",
            "res_id": null,
            "res" : null,
            "res_cat": null,
            "res_menu": null,
            "expecting_a_response": null,
            "saved_suff": null 
        }
    }

    function createAndMakeQuery(query_name, params, unknowns, pr_return) {        
        makeAQuery(query_name+"("+params.join(',')+")",unknowns, pr_return);
        
        return  {'data': null};
    }

    function makeAQuery(query,unknowns, pr_return) {
        d(query)
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/http://wave.ttu.edu/ajax.php",
            type: "POST",
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Access-Control-Allow-Origin":"*",
              "Access-Control-Allow-Methods" : "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            },
            data: {
              action: "getQuery",
              query: query,
              editor: knowledge
            },
            success: function(response ) {
                process_msg_response(processAjaxResponse(response, unknowns, pr_return ));
            },
            error: function(xhr, status, error) {
              console.log("error: " + error);
            }
          });
    }

    function processAjaxResponse(response, unknowns, pr_return) {
        results = []
        lines = response.split('<p')[1].split('<br');
        for(line of lines) {
            result = []
            should_add = true;
            dance:
            for(var i=0; i<unknowns ;i++) {
                rStr = '(.*?)' + unknown_names[i] + ' = ([0-9a-zA-Z]*) (.*)';
                answer = RegExp(rStr).exec(line+" filler");
                if(answer==null) {
                    should_add = false;
                    break dance
                }
                result.push(answer[2]);
            }
            if(should_add)
                results.push(result)
        }
        d(results);

        const response_case = pr_return.data.response;

        if(response_case === "q1") {

            response_message = '';
            item = results[Math.floor(Math.random()*results.length)];
            res_name = res_hash_name[item[1]];
            neg_response = false;
            if(context.saved_suff != null && context.saved_suff.negative_response != null)
                neg_response = true
            

            context.expecting_a_response = "q1";
            context.saved_suff = {
                "data" : item
            };
            if(!neg_response)
                response_message = 'Do you want try "{}" Resturaunt today ?'.format([res_name]);
            else 
                response_message = 'Okay, how about "{}" Resturaunt Instead ?'.format([res_name]);
            return createResponseMessage(response_message);

        } else if (response_case === "q2") {
            count = 5;
            max = 50;
            custom_results = [];
            response_message = '';

            if(results.length > 0)  {
                order = {};
                for(i=0;i<results.length;i++) {
                    if(order[results[i][2]] == null) {
                        order[results[i][2]] = [i];
                    } else {
                        order[results[i][2]].push(i);
                    }
                }
                for(i=50;i>=0 && custom_results.length<5;i--) {
                    if(order[i] == null) {
                        continue;
                    }
                    indexes = order[i];
                    for(j=0;j<indexes.length && custom_results.length < 5;j++) {
                        custom_results.push(results[indexes[j]])
                    }
                }
                
                context.expecting_a_response = "q2";
                context.saved_suff = {
                    "data_q2" : custom_results
                };
                response_message += 'The Top Rated Restaurants are: </br>'
                for(i=0;i<custom_results.length;i++) {
                    response_message += "{}. {} (Ratings: {}) </br>"
                    .format([i+1, res_hash_name[custom_results[i][1]], (custom_results[i][2]/10)]);
                }
                response_message += 'Reply with a number from above to select the Restaurant</br>';

            }
            return createResponseMessage(response_message);
        } else if (response_case === "q3") {
            response_message = "Please give the price range between 1-3";
            if(results.length > 0){
                response_message = 'According to the given range, these are the restaurants:</br>';
                const uniqueRestName = results?.filter((thing, index) => {
                    return index === results.findIndex(obj => {
                        return obj[0] === thing[0];
                    });
                });

                context.expecting_a_response = "q3";
                context.saved_suff = { "data_q3": results };
                for (let i = 0; i < uniqueRestName.length; i++) {
                    response_message += (i+1)+" "+res_hash_name[results[i][0]] + "</br>"
                }
                response_message += "</br>"+"Select a restaurant by entering it's serial number."
            }
            return createResponseMessage(response_message);
        } else if(response_case === "q6"){
            response_message = '';
            console.log(results);

            context.res_id =  results[0][0]
            context.res = context.q6_res_name_hash;
            priceRange = ''
            if(results[0][4] === "1"){
                priceRange = "Budget Friendly"
            } else if( results[0][5] === "2"){
                priceRange = "Moderate"
            } else {
                priceRange = "Expensive"
            }

            response_message = 'Please find restaurant Details </br>' +
                                'Name: '+ res_hash_name[context.q6_res_name_hash]+ '</br>'+
                                'Ranking: ' +results[0][3]+'</br>'+
                                'Rating: ' + (results[0][4]/10)+'</br>'+
                                'Price Range: '+priceRange+'</br>'+
                                'Address: ' + res_hash_address[results[0][5]]+'</br>'+
                                'zipcode: ' + res_hash_zip[results[0][6]]+'</br>'


            return createResponseMessage(response_message);
        
        } else if (response_case === "q7") {
            response_message = "Could not find any restaurants for '<b>" + context.food_item_name + "</b>'.</br> Please, "
                + "Try different food.";
            if (results.length > 0) {
                response_message = 'You can get ' + res_hash_food[context.food_item_id] + ' in these restaurants </br>';
                const uniqueRestName = results?.filter((thing, index) => {
                    return index === results.findIndex(obj => {
                        return obj[3] === thing[3];
                    });
                });

                context.expecting_a_response = "q7";
                context.saved_suff = { "data_q7": results };
                for (let i = 0; i < uniqueRestName.length; i++) {
                    response_message += (i + 1) + " " + res_hash_name[results[i][3]] + "</br>"
                }
                response_message += "</br>" + "Select a restaurant by entering it's serial number."

            }
            return createResponseMessage(response_message);
        } else if( response_case === "q1_sq1"){
            response_message = "Here's the Cuisine for '{}': </br>".format([res_hash_name[context.res]]);
            
            for(let i = 0 ; i < results.length; i++){
                response_message += (i+1) +". "+res_hash_cat[results[i]]+"</br>"
            }

            return createResponseMessage(response_message);

        } else if( response_case === "q1_sq2"){
            response_message = '';
            
            for(let i = 0 ; i < results.length; i++){
                response_message += (i+1) +". "+ res_hash_food[results[i][1]]+ 
                 "          $ "+results[i][2] +"</br>"
            }

            return createResponseMessage(response_message);

        } else if( response_case === "q1_sq3"){
            response_message = '';
            
            if(result === "1"){
                response_message = "Budget Friendly"
            } else if( result === "2"){
                response_message = "Moderate"
            } else {
                response_message = "Expensive"
            }

            return createResponseMessage(response_message);
            
        } else if( response_case === "q1_sq4"){
            response_message = '';
            console.log(context)
            
            for(let i = 0 ; i < results.length; i++){
                response_message += res_hash_name[context.res]+" is located at: "+res_hash_address[results[i]]+".</br>"
            }

            return createResponseMessage(response_message);
            
        } else if( response_case === "q1_sq5"){
            response_message = "Here's the Food Categories for '{}': </br>".format([res_hash_name[context.res]]);
            
            for(let i = 0 ; i < results.length; i++){
                response_message += "{}. {} </br>".format([i+1, res_hash_food_cat[results[i]]])
            }

            return createResponseMessage(response_message);
            
        } else if( response_case === "q5"){
            response_message = '';

            item = results[1]
            context.expecting_a_response = "q5";
            context.saved_suff = {
                "data_q5" : results
            };
            console.log("results")
            if(results.length == 0){
                response_message += "Could not find a restaurant that serves "+ context.res_cat+"."+"</br>"
                response_message += "Try again with: fast food, bbq, coffee and tea, tex mex..."+"</br>"
            } else {
                response_message += "Here is a list of restaurants serve "+ context.res_cat+ ":"+"</br>"+"</br>"
                for(let i = 0 ; i < results.length; i++){
                    response_message += (i+1) +". "+res_hash_name[results[i][1]]+"</br>"
                }
                response_message += "</br>"+"Select a restaurant by entering it's serial number."
            }

            
            return createResponseMessage(response_message);
        } else if(response_case === "q4") {
            response_message = '';
            if(results.length == 0) {
                response_message = "Could not find any restaurants in {}.</br> Please, "
                + "Try a different zip code such as 79414 etc"
                .format([context.inputs.zipcode]);

            } else {
                context.expecting_a_response = "q4";
                context.saved_suff = { "data_q4": results };
                for(let i=0;i<results.length;i++) {
                    response_message += (i+1) +". "+res_hash_name[results[i][1]]+"</br>"
                }   
                response_message += '</br> Reply with a number to select one of the above Restaurants.'
            }
            return createResponseMessage(response_message);
        }

    }
    
    function createResponseMessage(message) {
        return {'data' : message};
    }

    function initCap(mySentence) {
        const words = mySentence.split(" ");

        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }

        return words.join(" ");
    }

    d('suggest restaurant');
    d('Hey, Tell me some restaurants in 79414');
    d('So Tell me what cuisine does the restaurant serve');
    d('tell me the food Categories served in this restaurant');
    d('Show Top Rated restaurants');
    function d(s) {
        if(debugEnabled) {
            console.log(s);
        }
    }

});

