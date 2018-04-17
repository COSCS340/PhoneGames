Meteor.methods({
  makeCelebrity: function(players) {
    Celebrity.insert({
      players: this.players, //list of players
      
    });
  }
});
