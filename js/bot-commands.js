var commands = {
    "commands_p": [
        {
            "pattern": ["hie", "hi","hello","ola","yo","sup",'hey'],
            "response_type" : "string",
            "response": "Yo! Hope your doing good, How may I assist you today ? Ask me 'what can you do?' if you want to know what I can do...",
            "must_have": null
        },
        {
            "pattern": ["are"],
            "response_type" : "string",
            "response": "I'm doing better than I'm supposed too, my developers are killing me!! anyway,  if you want to know what I can do...",
            "must_have": ["how","you"]
        }
    ],
    "commands_r": [
        {
            "pattern": ["(.*)what can you do(.*)"],
            "match_tye": "r",
            "response_type": "string",
            "response" : "Ask me  <br/> 1. Suggest a Restaurant<br/> 2. Show Top Rated Restaurants<br/> 3. Suggest Restaurants by [$$] ( $ - Budget Friendly  $$$ - Expensive) <br/> 4. What are restaurants in [zipcode]</br> 5. Show me restaurants that are serving [Category] </br> 6. Search for [Restaurant Name]"
        },
        {
            "pattern": ["the names (.*)"],
            "match_tye": "r",
            "response_type": "calculated",
            "response" : "r_1"
        },
        {
            "pattern": ["(.*)suggest(.*)restaurant(.*)"],
            "match_tye":"r",
            "response_type":"calculated",
            "response" : "q1"
        },
        {
            "pattern": ["(.*)top rated(.*)"],
            "match_tye":"r",
            "response_type":"calculated",
            "response" : "q2"
        },
        {
            "pattern": ["(.*)restaurants by (${1-3})(.*)"],
            "match_tye":"r",
            "response_type":"calculated",
            "response" : "q3"
        },
        {
            "pattern": ["(.*)restaurants in ([0-9]{5})(.*)"],
            "match_tye":"r",
            "response_type":"calculated",
            "response" : "q4"
        },
        {
            "pattern": ["(.*)serving (.*)"],
            "match_tye":"r",
            "response_type":"calculated",
            "response" : "q5"
        },
        {
            "pattern": ["search for (.*)"],
            "match_tye":"r",
            "response_type":"calculated",
            "response" : "q6"
        },
        {
            "pattern": ["(.*)ask(.*)now(.*)"],
            "match_tye": "r",
            "response_type": "string",
            "response" : "Ask me  <br/> 1.What cuisine this restaurant serves? <br/> 2. Show me the menu<br/> 3. What is budget range of this restaurant <br/> 4. Where is this restaurant located? </br> 5. What are food categories served in this restaurant?"
        },
        {
            "pattern": ["(.*)cuisine(.*)restaurant(.*)serves(.*)"],
            "match_tye": "r",
            "response_type": "calculated",
            "response" : "q1_sq1"
        },
        {
            "pattern": ["(.*)show(.*)menu(.*)"],
            "match_tye": "r", 
            "response_type": "calculated",
            "response" : "q1_sq2"
        },
        {
            "pattern": ["(.*)budget(.*)range(.*)restaurant(.*)"],
            "match_tye": "r",
            "response_type": "calculated",
            "response" : "q1_sq3"
        },
        {
            "pattern": ["(.*)restaurant(.*)located(.*)"],
            "match_tye": "r",
            "response_type": "calculated",
            "response" : "q1_sq4"
        },
        {
            "pattern": ["(.*)categories(.*)served(.*)restaurant(.*)"],
            "match_tye": "r",
            "response_type": "calculated",
            "response" : "q1_sq5"
        }
    ]
}


