let CelebrityData = require("./CelebrityCards.json");
let CelebrityCards = CelebrityData.cards;
let Timers = {};

Meteor.methods({
  checkReady: function() {
    let celeb = Celebrity.findOne({
      "players.userId": this.userId
    });
    if (celeb && celeb.players) {
      if (celeb.ready >= celeb.players.length) {
        Meteor.call("startCelebrity", celeb);
      }
    }
  },

  endGame: function (userId) {
    Celebrity.update(
      {
        "players.userId": userId
      },
      {
        $set: {
          finished: true
        }
      }
    );
    Meteor.setTimeout(function() {
      Lobbies.remove({"players.userId": userId});
      Celebrity.remove({"players.userId": userId});
    }, 10000);
  },

  makeCelebrity: function(cardSafety, gameLength) {
    let listOfPlayers = Lobbies.findOne({ createdById: this.userId }).players;
    if (
      typeof listOfPlayers == "undefined" ||
      typeof listOfPlayers.length == "undefined"
    ) {
      console.log(listOfPlayers);
      return console.log("Something went wrong");
    }

    let deck;

    if (cardSafety == "sfw") {
      deck = CelebrityCards.filter(function(card) {
        if (card.safe == "sfw") {
          return true;
        }
      });
    } else if (cardSafety == "ssfw") {
      deck = CelebrityCards.filter(function(card) {
        if (card.safe == "sfw" || card.safe == "ssfw") {
          return true;
        }
      });
    } else {
      deck = CelebrityCards;
    }

    let tmpdeck = shuffle(deck);
    let numCards = 5;
    let team = [];

    listOfPlayers.forEach(function(player, index, team) {
      if (!(index % 2)) {
        team[index] = Object.assign(
          {
            hand: tmpdeck.splice(0, numCards * 2),
            team: "Team 1",
            order: index
          },
          player
        );
      } else {
        team[index] = Object.assign(
          {
            hand: tmpdeck.splice(0, numCards * 2),
            team: "Team 2",
            order: index
          },
          player
        );
      }
    });

    Celebrity.insert({
      players: listOfPlayers,
      team1score: 0,
      team2score: 0,
      round: 1,
      deck: [],
      ready: 0,
      started: false,
      finished: false,
      turn: listOfPlayers[0],
      time: 0
    });
  },

  nextCard: function() {
    let hand = Celebrity.findOne({ "players.userId": this.userId }).turn.hand;
    hand[hand.length - 1] = hand.shift();
    Celebrity.update(
      {
        "players.userId": this.userId
      },
      {
        $set: {
          "turn.hand": hand
        }
      }
    );
  },

  nextTurn: function(userId) {
    let celeb = Celebrity.findOne({ "players.userId": userId });
    let hand = celeb.turn.hand;
    let next = ((celeb.turn.order + 1) % celeb.players.length);
    let player = celeb.players[next];
    player.hand = hand;

    Celebrity.update(
      {
        _id: celeb._id
      },
      {
        $set: {
          turn: player,
          time: 0
        }
      }
    )
  },

  nextRound: function(userId) {
    let celeb = Celebrity.findOne({ "players.userId": userId});
    Meteor.clearInterval(Timers[celeb._id]);
    if (celeb.round >= 3) {
      return Meteor.call("endGame", userId);
    }
    let deck = shuffle(celeb.deck);
    let next = ((celeb.turn.order + 1) % celeb.players.length);
    let player = celeb.players[next];
    player.hand = deck;

    Celebrity.update(
      {
        "players.userId": this.userId
      },
      {
        $inc: {
          round: 1
        },
        $set: {
          turn: player,
          time: 0
        }
      }
    );
  },

  removeCelebPlayer: function() {
    let celeb = Celebrity.findOne({
      "players.userId": this.userId
    });
    Meteor.clearInterval(Timers[celeb._id]);

    if (celeb.players.length > 1) {
      if (celeb.turn.userId == this.userId) {
          Meteor.call("nextTurn");
      }
      Celebrity.update(
        { _id: celeb._id },
        { $pull: { players: { userId: this.userId } } }
      );
    } else {
      Celebrity.remove({ _id: celeb._id });
    }
  },

  scoreCard: function() {
    let turn = Celebrity.findOne({ "players.userId": this.userId }).turn;
    score = turn.hand.shift().points;
    if (turn.team == "Team 1") {
      Celebrity.update(
        {
          "players.userId": this.userId
        },
        {
          $set: {
            "turn.hand": turn.hand
          },
          $inc: {
            team1score: score
          }
        }
      );
    } else {
      Celebrity.update(
        {
          "players.userId": this.userId
        },
        {
          $set: {
            "turn.hand": turn.hand
          },
          $inc: {
            team2score: score
          }
        }
      );
    }
    if (turn.hand.length == 0) {
      return Meteor.call("nextRound", this.userId);
    }
  },

  selectCards: function(addCards) {
    Celebrity.update(
      {
        "players.userId": this.userId
      },
      {
        $addToSet: {
          deck: {
            $each: addCards
          }
        },
        $inc: {
          ready: 1
        }
      }
    );

    Celebrity.update(
      {
        "players.userId": this.userId
      },
      {
        $set: {
          "players.$.hand": []
        }
      }
    );
  },

  startCelebrity: function(celeb) {
    let deck = celeb.deck;
    shuffle(deck);

    Celebrity.update(
      {
        _id: celeb._id
      },
      {
        $set: {
          started: true,
          "turn.hand": deck
        }
      }
    );
  },

  timer: function() {
    let start = Date.parse(new Date());
    let celeb = Celebrity.findOne({"players.userId": this.userId});
    let id = Meteor.setInterval(function() {
      if ((Date.parse(new Date()) - start) <= 60000) {
        Celebrity.update(
          {
            _id: celeb._id
          },
          {
            $set: {
              time: Date.parse(new Date()) - start
            }
          }
        )
      } else {
        Meteor.clearInterval(id);
        Meteor.call("nextTurn", this.userId);
      }
    }, 1000);
    Timers[celeb._id] = id;
  }
});

Celebrity.allow({
  update(userId, doc, fieldNames, modifier) {
    return true;
  }
});

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
