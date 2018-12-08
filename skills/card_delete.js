module.exports = function(controller) {
    controller.hears('.*eff.*carte.*', 'message_received', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            // Create a yes/no question in the default thread...
            convo.ask('Voulez-vous effacer une carte ?', [
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
            convo.addQuestion('OK quel est le code a effacer ?', (res,conv) => {
              conv.next();
            }, {key: "card"}
            ,'card_id');

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
                    controller.storage.users.save({id: user_id, cards: cards.filter((el) => el.code != convo.extractResponse('card'))}, (err) => {
                      console.log(err)
                    })
                  })
                  // test the card and say ok if card is valid !
                  bot.reply(message, 'La carte est effacé de votre profil !');
                }
            });
        });
    });

};
