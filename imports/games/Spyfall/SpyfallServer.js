import { Random } from "meteor/random";

Meteor.methods({
  makeSpyfall: function(pls) {
    SpyfallGames.insert({
      players: pls,
      spy: determineSpy(pls),
      time: 600,
      win: 0,
    });
    console.log(SpyfallGames.findOne({players: pls}));
    return SpyfallGames.findOne({players: pls})._id;
  },
  /*isSpy: function(player) {
    return !(SpyfallGames.findOne({spy: player}) == NULL);
  },*/
});

function determineSpy(players){

  //setTimeout(function(){
    //SpyfallGames.findOne({})
  //}, 2000);

  return players[Math.floor(Math.random() * players.length)];
}
