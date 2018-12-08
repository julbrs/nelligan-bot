module.exports = function(controller) {

    controller.hears('(.*)list(.*)cart(.*)', 'message_received', function(bot, message) {
      var user_id = message.sender.id
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
        var list = cards.map((el) => el.code).join(', ')
        bot.reply(message, 'Voici la liste de vos cartes sur votre profil: '+ list)
      })
    });
};
