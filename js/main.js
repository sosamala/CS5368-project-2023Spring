$(document).ready(function () {

    var isVolume = true;

    $("#btSend").on('click', function () {
        textarea = $("#taMessage");
        value = textarea.val();
        if (value.trim().length == 0) {
            return;
        }
        sendMessage(value);
        value = textarea.val("");
    });

    $("#taMessage").keyup(function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13) {  // Enter keycode
            e.preventDefault();
            $("#btSend").click();
        }
    });


    $("#btMic").click(function (e) {
        recognition.start();
        console.log("Listening...");
    });

    recognition.onresult = (event) => {
        $("#taMessage").val(event.results[0][0].transcript);
    };

    $("#btSpeakers").click(function (e) {
        isVolume = !isVolume;
        console.log(isVolume)
        if (isVolume) {
            $("#imgVolume").attr('src', 'css/fonts/volume-up.svg');
        } else {
            $("#imgVolume").attr('src', 'css/fonts/volume-mute.svg');
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

        if (isVolume) {
            const utterThis = new SpeechSynthesisUtterance(message);
            utterThis.voice = synth.getVoices()[2];
            utterThis.pitch = specch_pitch;
            utterThis.rate = speech_rate;
            synth.speak(utterThis);
        }

    }

    function processMessage(message) {

        // clean the message
        message = message.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");

        //process if expecting a response first :O 
        if (context != null && context.expectint_a_response != null) {
            var ex_return = process_exc(message);
            if (ex_return != null) {
                return process_msg_response(process_exc_response(ex_return));
            }
        }

        // process regex first :)
        var pr_return = process_regex(message);
        if (pr_return != null) {
            return process_msg_response(process_regex_response(pr_return));
        }

        // process percentile later :thumbsup
        var pp_return = process_percentile(message);
        if (pp_return != null) {
            return process_msg_response(process_percentile_response(pp_return));
        }

        process_msg_response({ "data": "I don't understand what you said.... L , could you please retry? Thanks :)" });


    }

    function process_exc(message) {

        if (context.expectint_a_response == "q1") {

            message = message.replace(/[^a-z]/g, "");
            if (positive_response.includes(message)) {
                context.res = context.saved_suff.data[1];
                context.res_id = context.saved_suff.data[0];
                response_message = `Awesome! what more do you want to know about the Restaurant '{}' ?.  
                To know what you can ask me now say "what can I ask now?".
                `.format([res_hash_name[context.saved_suff.data[1]]]);
                return { 'data': response_message, 'tag': 'string' };
            } else if (negative_response.includes(message)) {
                context.saved_suff.negative_response = true;
                process_regex_response(process_regex('suggest restaurant'));
                return { 'data': null, 'tag': 'string' }
            } else {
                return null;
            }

        } else if(context.expectint_a_response == "q5") {
            message = message.replace(/[^0-9]/g, "");
            try {
                option = Number(message)
                if(option <= context.saved_suff.data_q5.length && option > 0) {
                    option = option - 1
                    context.res = context.saved_suff.data_q5[option][1];
                    context.res_id = context.saved_suff.data_q5[option][0];
                    response_message = `Awesome! what more do you want to know about the Restaurant '{}' ?.  
                    To know what you can ask me now say "what can I ask now?".
                    `.format([res_hash_name[context.saved_suff.data_q5[option][1]]]);
                    console.log({'data': response_message, 'tag':'string'})
                    return {'data': response_message, 'tag':'string'};
                }
            }
            catch(err) {
                console.log("cought an error")
                console.log(err)
                return null;
            }
        }
        return null;

    }

    function process_exc_response(ex_return) {
        if (ex_return.tag === 'string') {
            return ex_return;
        }
    }


    function process_regex(message) {
        const c_objects = commands["commands_r"];
        for (x of c_objects) {
            reg = RegExp(x.pattern[0]);
            response = reg.exec(message);
            if (response != null) return { "regex": response, "data": x };
        }
        return null;
    }

    function process_regex_response(pr_return) {

        if (pr_return.data.response_type === "string") {
            return { "data": pr_return.data.response }
        }

        if (pr_return.data.response_type === "calculated") {
            var response_case = pr_return.data.response;
            var regex = pr_return.regex;
            if (response_case === "r_1") {
                return { "data": "All Hail " + regex[1] + "!!!!" };
            }
            else if (response_case === 'q1') {
                params = []
                unkowns = 0;
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                query_name = 'name';
                return createAndMakeQuery(query_name, params, unkowns, pr_return);
            }
            else if (response_case === 'q2') {
                console.log('In q1');
            }
            else if (response_case === 'q3') {
                console.log('In q1');
            }
            else if (response_case === 'q4') {
                console.log('In q1');
            }
            else if(response_case === 'q5'){
                category = initCap(regex[2])
                console.log(category)
                params = []
                unkowns = 0;
                params.push(res_cat_hash[category])
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                query_name = 'getRestaurantByCategory';
                return createAndMakeQuery(query_name, params, unkowns, pr_return);
            }
            else if(response_case === 'q6'){
                params = []
                unkowns = 0;
                console.log("regex"+regex[1])
                context.res_name_id = res_name_hash[regex[1]]
                params.push(unkown_names[unkowns++])
                params.push(res_name_hash[regex[1]])
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                query_name = 'getRestaurantDetails';
                return createAndMakeQuery(query_name, params, unkowns, pr_return);
            } else if (response_case === 'q7' || response_case === 'q7_1') {
                params = []
                unkowns = 0;
                const food_item_id = res_food_cat_hash[regex[2].trim()];
                context.food_item_id = food_item_id;
                params.push(unkown_names[unkowns++])
                params.push(food_item_id)
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                query_name = 'getRestaurantNameByFoodItem';
                return createAndMakeQuery(query_name, params, unkowns, pr_return, regex[2].trim());
            }
            else if(response_case === 'q1_sq1'){
                params = []
                unkowns = 0;
                params.push(context.res_id)
                params.push(unkown_names[unkowns++])
                query_name = 'category';
                return createAndMakeQuery(query_name, params, unkowns, pr_return);
            }
            else if (response_case === 'q1_sq2') {
                params = []
                unkowns = 0;
                params.push(context.res_id)
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                params.push(unkown_names[unkowns++])
                query_name = 'getMenuByRestaurant';
                return createAndMakeQuery(query_name, params, unkowns, pr_return);
            }
            else if (response_case === 'q1_sq3') {
                params = []
                unkowns = 0;
                params.push(context.res_id)
                params.push(unkown_names[unkowns++])
                query_name = 'getPriceRange';
                return createAndMakeQuery(query_name, params, unkowns, pr_return);
            }
            else if (response_case === 'q1_sq4') {
                params = []
                unkowns = 0;
                params.push(context.res_id)
                params.push(unkown_names[unkowns++])
                query_name = 'fullAddress';
                return createAndMakeQuery(query_name, params, unkowns, pr_return);
            }
            else if (response_case === 'q1_sq5') {
                params = []
                unkowns = 0;
                params.push(context.res_id)
                params.push(unkown_names[unkowns++])
                query_name = 'hasFoodCategory';
                return createAndMakeQuery(query_name, params, unkowns, pr_return);
            }
        }

        return null;
    }


    function process_percentile(message) {
        tokens = message.split(' ');
        const c_objects = commands["commands_p"];
        max_percentage = 0;
        max_percentage_obj = null;
        for (x of c_objects) {

            must_have = false;
            if (x.must_have != null) {
                dance:
                for (y of x.must_have) {
                    if (tokens.includes(y)) {
                        must_have = true;
                    } else {
                        must_have = false;
                        break dance;
                    }
                }
            } else {
                must_have = true;
            }


            if (must_have) {
                hits = 0
                total = x.pattern.length

                if (x.must_have != null) {
                    hits += x.must_have.length
                    total += x.must_have.length
                }

                for (z of tokens) {
                    if (x.pattern.includes(z)) {
                        hits += 1;
                    }
                }

                percentage = (hits / total) * 100;
                if (percentage > max_percentage) {
                    max_percentage = percentage
                    max_percentage_obj = x
                }


            }
        }
        if (max_percentage_obj === null)
            return null;
        return { "data": max_percentage_obj }
    }


    function process_percentile_response(pp_return) {
        if (pp_return.data.response_type === "string") {
            return { "data": pp_return.data.response }
        }

        if (pp_return.data.response_type === "calculated") {
            var response_case = pp_return.data.response;

        }

        return null;

    }

    function process_msg_response(msgresponse) {
        if (msgresponse != null && msgresponse.data != null) {
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
            "res": null,
            "res_cat": null,
            "res_menu": null,
            "res_name_id": null,
            "expectint_a_response": null,
            "saved_suff": null,
            "food_item_id": null
        }
    }

    function createAndMakeQuery(query_name, params, unkowns, pr_return = null) {
        makeAQuery(query_name + "(" + params.join(',') + ")", unkowns, pr_return);
        return { 'data': null };
    }

    function makeAQuery(query, unkowns, pr_return) {
        console.log(query)
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/http://wave.ttu.edu/ajax.php",
            type: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            },
            data: {
                action: "getQuery",
                query: query,
                editor: knowledge
            },
            success: function (response) {
                process_msg_response(processAjaxResponse(response, unkowns, pr_return));
            },
            error: function (xhr, status, error) {
                console.log("error: " + error);
            }
        });
    }

    function processAjaxResponse(response, unkowns, pr_return) {
        results = []
        lines = response.split('<p')[1].split('<br');
        response_message = '';
        for (line of lines) {
            result = []
            should_add = true;
            dance:
            for (var i = 0; i < unkowns; i++) {
                rStr = '(.*?)' + unkown_names[i] + ' = ([0-9a-zA-Z]*) (.*)';
                answer = RegExp(rStr).exec(line + " filler");
                if (answer == null) {
                    should_add = false;
                    break dance
                }
                result.push(answer[2]);
            }
            if (should_add)
                results.push(result)
        }
        console.log(results);

        const response_case = pr_return.data.response;

        if (response_case === "q1") {
            item = results[Math.floor(Math.random() * results.length)];
            res_name = res_hash_name[item[1]];
            neg_response = false;
            if (context.saved_suff != null && context.saved_suff.negative_response != null)
                neg_response = true

            context = getEmptyContext();
            context.expectint_a_response = "q1";
            context.saved_suff = {
                "data": item
            };
            if (!neg_response)
                response_message = 'wanna try "{}" Resturaunt today ?'.format([res_name]);
            else
                response_message = 'Okay, wanna try "{}" Resturaunt Instead ?'.format([res_name]);
            return createResponseMessage(response_message);

        } else if(response_case === "q6"){
            response_message = '';
            console.log(results);
            context = getEmptyContext();
            context.res_id =  results[0][0]
            priceRange = ''
            if(results[4] === "1"){
                priceRange = "Budget Friendly"
            } else if( results[4] === "2"){
                priceRange = "Moderate"
            } else {
                priceRange = "Expensive"
            }
            response_message = 'Please find restaurant Details </br>' +
                                'Name :'+ res_hash_name[context.res_name_id]+ '</br>'+
                                'Ranking :' +results[0][1]+'</br>'+
                                'Rating :' + results[0][2]+'</br>'+
                                'Price Range:'+priceRange+'</br>'+
                                'Address' + res_hash_address[results[0][5]]+'</br>'+
                                'zipcode' + res_hash_zip[results[0][6]]+'</br>'

            return createResponseMessage(response_message);
        
        } else if( response_case === "q1_sq1"){
            response_message = '';
            
            for(let i = 0 ; i < results.length; i++){
                response_message += (i+1) +"."+res_hash_cat[results[i]]+"</br>"
            }

            return createResponseMessage(response_message);

        } else if( response_case === "q1_sq2"){
            response_message = '';
            
            for(let i = 0 ; i < results.length; i++){
                response_message += (i+1) +"."+ res_hash_food[results[i][1]]+ 
                 "          $ "+results[i][2] +"</br>"
            }

            return createResponseMessage(response_message);

        } else if (response_case === "q1_sq3") {

            if (result === "1") {
                response_message = "Budget Friendly"
            } else if (result === "2") {
                response_message = "Moderate"
            } else {
                response_message = "Expensive"
            }

            return createResponseMessage(response_message);

        } else if (response_case === "q1_sq4") {

            for (let i = 0; i < results.length; i++) {
                response_message += (i + 1) + "." + res_hash_zip[results[i]] + "\n"
            }

            return createResponseMessage(response_message);

        } else if (response_case === "q1_sq5") {

            for (let i = 0; i < results.length; i++) {
                response_message += (i + 1) + "." + res_hash_cat[results[i]] + "\n"
            }

            return createResponseMessage(response_message);
            
        } else if( response_case === "q5"){
            response_message = '';

            item = results[1]
            console.log()
            context = getEmptyContext();
            context.expectint_a_response = "q5";
            context.saved_suff = {
                "data_q5" : results
            };

            console.log(results)
            for(let i = 0 ; i < results.length; i++){
                response_message += (i+1) +". "+res_hash_name[results[i][1]]+"</br>"
            }
            return createResponseMessage(response_message);
        } else if (response_case === "q7" || response_case === 'q7_1') {

            response_message = 'You can get ' + res_hash_food_cat[context.food_item_id] + ' in these restaurants </br>';
            const uniqueRestName = results?.filter((thing, index) => {
                return index === results.findIndex(obj => {
                    return obj[3] === thing[3];
                });
            });
            for (let i = 0; i < uniqueRestName.length; i++) {
                response_message += res_hash_name[results[i][3]] + "</br>"
            }
            context = getEmptyContext();
            return createResponseMessage(response_message);
        }
    }

    function createResponseMessage(message) {
        return { 'data': message };
    }

    function initCap(mySentence) {
        const words = mySentence.split(" ");

        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }

        return words.join(" ");
    }


});

