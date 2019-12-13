// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log(
      "Dialogflow Request headers: " + JSON.stringify(request.headers)
    );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function welcome(agent) {
      agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
      agent.add(`I didn't understand, can you try again please ?`);
      agent.add(`I'm sorry, can you try again?`);
    }

    function holidayChoice(agent) {
      agent.add(
        `I'm here to help you find the best holiday destination for you ! First of all; which continent would you like to go to ?`
      );
      agent.setContext({
        name: "continentChoice"
      });
    }

    function continentChoice(agent) {
      const continent = agent.parameters.continent;
      if (continent) {
        agent.add(
          `${continent} sounds like a great choice ! And are you looking more for a relaxing beach holiday, cities full of culture, or beautiful nature ?`
        );
      } else {
        agent.add(`Which continent would you like to go to?`);
      }
      //agent.context.set({
      agent.setContext({
        name: "holidayType",
        lifespan: 99,
        parameters: { continent: continent }
      });
    }

    function holidayType(agent) {
      const params2 = agent.getContext("continentchoice-followup").parameters;
      console.log("PARAMS2", params2);
      const holidayType = agent.parameters.holidayType;
      if (holidayType) {
        agent.add(
          `Thanks! And finally, would you rather go to a holiday-classic (tried and tested destination), or something more low-key (off the beaten path) ?`
        );
      } else {
        agent.add(`What type of holiday do you like?`);
      }
      agent.setContext({
        name: "popularity",
        lifespan: 99,
        parameters: { holidayType: holidayType }
      });
    }

    function popularity(agent) {
      const continentParam = agent.getContext("continentchoice-followup")
        .parameters.continent;
      const holidayTypeParam = agent.getContext("holidaytype-followup")
        .parameters.holidayType;
      const popularity = agent.parameters.popularity;
      if (popularity) {
        agent.add(`Got it ! You would like to go to ${continentParam}, for a ${holidayTypeParam} holiday, to a ${popularity} destination.
My recommandation is... *drumrolls* ${chooseDestination(continentParam, holidayTypeParam, popularity)} !`);
      } else {
        agent.add(
          `Do you prefer a popular destination, or something off the beaten path ?`
        );
      }
    }
    
    function shortChooseHolidayDestination(agent){
      const {holidayType, continent, popularity} = agent.parameters;
      agent.add(`Got it ! You would like to go to ${continent}, for a ${holidayType} holiday, to a ${popularity} destination.
My recommandation is... ${chooseDestination(continent, holidayType, popularity)} !`);
    }

    function chooseDestination(continent, holidayType, popularity) {
      if (continent === "Europe") {
        if (holidayType === "beach") {
          if (popularity === "holiday-classic") {
            return "Croatia";
          } else if (popularity === "low-key") {
            return "Albania";
          }
        } else if (holidayType === "city") {
          if (popularity === "holiday-classic") {
            return "Italy";
          } else if (popularity === "low-key") {
            return "Lithuania";
          }
        } else if (holidayType === "nature") {
          if (popularity === "holiday-classic") {
            return "Switzerland";
          } else if (popularity === "low-key") {
            return "Montenegro";
          }
        }
      } else if (continent === "Asia") {
        if (holidayType === "beach") {
          if (popularity === "holiday-classic") {
            return "Bali";
          } else if (popularity === "low-key") {
            return "The Philippines";
          }
        } else if (holidayType === "city") {
          if (popularity === "holiday-classic") {
            return "Japan";
          } else if (popularity === "low-key") {
            return "Azerbaijan";
          }
        } else if (holidayType === "nature") {
          if (popularity === "holiday-classic") {
            return "Sri Lanka";
          } else if (popularity === "low-key") {
            return "Kyrgyzstan";
          }
        }
      } else if (continent === "Africa") {
        if (holidayType === "beach") {
          if (popularity === "holiday-classic") {
            return "the Seychelles";
          } else if (popularity === "low-key") {
            return "Mozambique";
          }
        } else if (holidayType === "city") {
          if (popularity === "holiday-classic") {
            return "Egypt";
          } else if (popularity === "low-key") {
            return "Ethiopia";
          }
        } else if (holidayType === "nature") {
          if (popularity === "holiday-classic") {
            return "Kenya";
          } else if (popularity === "low-key") {
            return "Madagascar";
          }
        }
      } else if (continent === "America") {
        if (holidayType === "beach") {
          if (popularity === "holiday-classic") {
            return "Mexico";
          } else if (popularity === "low-key") {
            return "Ecuador";
          }
        } else if (holidayType === "city") {
          if (popularity === "holiday-classic") {
            return "the USA";
          } else if (popularity === "low-key") {
            return "Colombia";
          }
        } else if (holidayType === "nature") {
          if (popularity === "holiday-classic") {
            return "Costa Rica";
          } else if (popularity === "low-key") {
            return "Chile";
          }
        }
      }
    }

    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function yourFunctionHandler(agent) {
    //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    //   agent.add(new Card({
    //       title: `Title: this is a card title`,
    //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
    //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //       buttonText: 'This is a button',
    //       buttonUrl: 'https://assistant.google.com/'
    //     })
    //   );
    //   agent.add(new Suggestion(`Quick Reply`));
    //   agent.add(new Suggestion(`Suggestion`));
    //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    // }

    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
    // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);
    intentMap.set("chooseHolidayDestination", holidayChoice);
    intentMap.set("continentChoice", continentChoice);
    intentMap.set("holidayType", holidayType);
    intentMap.set("popularity", popularity);
    intentMap.set('shortChooseHolidayDestination', shortChooseHolidayDestination);

    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
  }
);
