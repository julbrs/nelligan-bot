var api = require('nelligan-api')

module.exports = function(controller) {
  const intervalObj = setInterval(() => {

    var todayPlusFewDays = new Date();
    todayPlusFewDays.setDate(todayPlusFewDays.getDate()+1);

    controller.spawn({}, (bot) => {
      controller.storage.users.all(function(err, all_user_data) {
        if(err) {
          console.log(err)
        }
        all_user_data.forEach((user) => {
          if(user.cards) {
            var promiseList = user.cards.map((card) => {
              return api.books(card)
              .then(data => {
                return data.books
              })
              .catch((err) => {
                console.log(`Erreur sur la carte ${card.code}`)
              })
            })

            Promise.all(promiseList).then((values) => {
              var books = [].concat(...values).filter((book) => {
                var duedate=new Date("20"+book.duedate);
                return todayPlusFewDays>duedate;
              })
              if(books.length !=0) {
                var booklist = books.map((book) => ` *${book.title}* (${book.duedate})`).join("\n")
                bot.say({
                  text: `${books.length} livre(s) à rendre dans les 24h : ${booklist}`,
                  channel: user.id,
                  messaging_type: 'MESSAGE_TAG',
                  tag: 'BUSINESS_PRODUCTIVITY'
                })
              }
            })
          }
        })
      })
    })
  }, 4000);
};
