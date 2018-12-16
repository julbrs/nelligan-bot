var api = require('nelligan-api')


module.exports = function(controller) {

    controller.hears([/list.*livre[a-zA-Z ]*(\d{0,2})/], 'message_received', function(bot, message) {
      var user_id = message.sender.id
      console.log(message.match[1])
      let days = 3
      if(message.match[1]){
        days = parseInt(message.match[1])
      }
      var todayPlusFewDays = new Date();
      todayPlusFewDays.setDate(todayPlusFewDays.getDate()+days);

      controller.storage.users.get(user_id, (err, user_data) => {
        if(err) {
          console.log(err)
        }
        if(user_data && user_data.cards) {
          var promiseList = user_data.cards.map((card) => {
            return api.books(card)
            .then(data => {
              data.books.filter((book) => {
                var duedate=new Date("20"+book.duedate);
                return todayPlusFewDays>duedate;
              }).forEach((book) => {
                bot.reply(message, `*A rendre bientot*: ${book.title} (${book.duedate})`)
              })
              return data.books.length
            })
            .catch((err) => {
              bot.reply(message, `Erreur sur la carte ${card.code}`)
            })
          })
          Promise.all(promiseList).then((count) => {
            var sum = count.reduce((a, b) => a + b, 0)
            bot.reply(message, `Vous avez ${sum} livres sur vos ${count.length} cartes.`)

          })
        }
        bot.reply(message, 'Je réflechis...')
      })
    });
};
