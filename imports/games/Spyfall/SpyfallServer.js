import { Random } from "meteor/random";

Meteor.methods({
  makeSpyfall: function(pls) {
    SpyfallGames.insert({
      players: pls,
      spy: determineSpy(pls),
      endTime: (new Date().getTime()+10*60*1000), //end time (unix time)
      win: 0,
    });
    console.log(SpyfallGames.findOne({players: pls}));
    return SpyfallGames.findOne({players: pls})._id;
  },
});

function determineSpy(players){
  return players[Math.floor(Math.random() * players.length)];
}
