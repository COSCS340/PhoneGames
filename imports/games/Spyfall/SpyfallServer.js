import { Random } from "meteor/random";
import { locations } from "./SpyfallLocations.js";

Meteor.methods({
  makeSpyfall: function(pls) {
    SpyfallGames.insert({
      players: pls,
      spy: pickSpy(pls),
      location: pickLocation(),
      endTime: (new Date().getTime()+10*60*1000), //end time (unix time)
      win: 0,
    });
    console.log(SpyfallGames.findOne({players: pls}));
    return SpyfallGames.findOne({players: pls})._id;
  },
});

function pickSpy(players){
  return players[Math.floor(Math.random() * players.length)];
}

function pickLocation(){
  return locations[Math.floor(Math.random() * locations.length)];
}
