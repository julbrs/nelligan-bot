var api = require('nelligan-api')

var todayPlusFewDays = new Date();
todayPlusFewDays.setDate(todayPlusFewDays.getDate()+3);

module.exports = function(controller) {

    controller.hears('(.*)list(.*)livre(.*)', 'message_received', function(bot, message) {
      var user_id = message.sender.id
      controller.storage.users.get(user_id, (err, user_data) => {
        if(err) {
          console.log(err)
        }
        if(user_data && user_data.cards) {
          user_data.cards.forEach((card) => {
            api.books(card)
            .then(data => {
              console.log(data)
              data.books.filter((book) => {
                var duedate=new Date("20"+book.duedate);
                return todayPlusFewDays>duedate;
              }).forEach((book) => {
                bot.reply(message, `*A rendre bientot*: ${book.title} (${book.duedate})`)
              })
            })
            .catch((err) => {
              bot.reply(message, `Erreur sur la carte ${card.code}`)
            })
          })
        }
        bot.reply(message, 'Je réflechis...')
      })
    });
};
