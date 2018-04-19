// import "./CelebrityCollection.js";

Meteor.methods({
  makeCelebrity: function() {
    var listOfPlayers = Lobbies.findOne({ createdById: this.userId }).players;
    if (typeof(listOfPlayers) == 'undefined' || typeof(listOfPlayers.length) == 'undefined') {
      console.log(listOfPlayers);
      return console.log("Something went wrong");
    }
    var team1= [], team2 = [];
    for (let i = 0; i < listOfPlayers.length; i++) {
      if (!(i % 2)) {
        team1.push(listOfPlayers[i]);
      } else {
        team2.push(listOfPlayers[i]);
      }
    }
    console.log(listOfPlayers);
    console.log(team1);
    console.log(team2);

//    Celebrity.insert({
      //      players: this.players, //list of players
//    });
  }
});
