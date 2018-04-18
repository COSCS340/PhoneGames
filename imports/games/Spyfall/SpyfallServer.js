Meteor.methods({
  makeSpyfall: function(p1ID, p2ID) {
    SpyfallGames.insert({
      player1: p1ID, //X
      player2: p2ID, //O
      turn: p1ID,
      board: "---------",
      win: 0
    });
    return SpyfallGames.findOne({
      player1: p1ID
    })._id;
  },
});
