var api = require('nelligan-api')

module.exports = function(controller) {
    controller.hears('.*ajout.*carte.*', 'message_received', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            // Create a yes/no question in the default thread...
            convo.ask('Voulez-vous ajouter une carte ?', [
                {
                    pattern:  'oui',
                    callback: function(response, convo) {
                        convo.gotoThread('card_id');
                    },
                },
                {
                    default:  true,
                    callback: function(response, convo) {
                        convo.gotoThread('quit');
                    },
                },
            ]);

            // card code
            convo.addQuestion('OK quel est le code (par exemple 12777001234567 ?)', (res,conv) => {
              conv.gotoThread('pin_id');
            }, {key: "card"}
            ,'card_id');

            // card pin
            convo.addQuestion('Et maintenant le PIN de la carte ?)', (res,conv) => {
              conv.next();
            }, {key: "pin"}
            ,'pin_id');

            // create a path for when a user says NO
            // mark the conversation as unsuccessful at the end
            convo.addMessage({
                text: 'OK j\'ai mal compris.',
                action: 'stop', // this marks the converation as unsuccessful
            },'quit');

            convo.activate();

            // capture the results of the conversation and see what happened...
            convo.on('end', function(convo) {

                if (convo.successful()) {
                  var card = {
                    code: convo.extractResponse('card'),
                    pin: convo.extractResponse('pin')
                  }
                  // check if card valid
                  api.books(card)
                  .then(data => {
                    var user_id = convo.source_message.sender.id
                    controller.storage.users.get(user_id, (err, user_data) => {
                      if(err) {
                        console.log(err)
                      }
                      var cards
                      if(user_data && user_data.cards) {
                        cards = user_data.cards
                      }
                      else {
                        cards = []
                      }
                      cards.push(card)
                      controller.storage.users.save({id: user_id, cards: cards}, (err) => {
                        console.log(err)
                      })
                    })
                    // test the card and say ok if card is valid !
                    bot.reply(message, 'La carte est enregistré sur votre profil !');
                  })
                  .catch((err) => {
                    bot.reply(message, 'Erreur la carte ne fonctionne pas sur Nelligan');
                  })
                }
            });
        });
    });
};