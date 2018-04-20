import { Random } from "meteor/random";
import { locations } from "./SpyfallLocations.js";

Meteor.methods({
  makeSpyfall: function(pls) {
    SpyfallGames.insert({
      players: pls,
      spy: pickSpy(pls),
      location: pickLocation(),
      endTime: (new Date().getTime()+10*60*1000)
    });
    console.log(SpyfallGames.findOne({players: pls}));
  },
  getRoleData: function(userID){
    var game = SpyfallGames.findOne({'players.userId': userID});
    if (game.spy.userId == userID)
      return "spy";
    else
      return game.location;
  }
});

function pickSpy(players){
  return players[Math.floor(Math.random() * players.length)];
}

function pickLocation(){
  return locations[Math.floor(Math.random() * locations.length)];
}
