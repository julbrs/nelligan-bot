module.exports = function(controller) {

    controller.on('message_received', function(bot, message) {
      bot.reply(message, 'Comment puis-je vous aider ? Je comprend :\n'+
    '*ajouter carte* pour ajouter une carte\n'+
    '*lister cartes* pour lister les cartes associés\n'+
    '*lister livres a rendre dans les N jours* pour lister les livres (3j par default)\n'+
    '*effacer carte* pour effacer une carte.\n\n'+
    'Et je vous averti si vous avez des livres a rendre dans les 24h !')
    });
};
