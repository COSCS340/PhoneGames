// import "./CelebrityCollection.js";

let CelebrityData = require("./CelebrityCards.json");
let CelebrityCards = CelebrityData.cards;

Meteor.methods({
  checkReady: function() {
    let celeb = Celebrity.find({
      "players.userId": this.userId
    }).fetch()[0];
    if (typeof celeb.players != "undefined") {
      if (celeb.ready >= celeb.players.length) {
        Meteor.call("startCelebrity", celeb);
      }
    }
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
            ready: false
          },
          player
        );
      } else {
        team[index] = Object.assign(
          {
            hand: tmpdeck.splice(0, numCards * 2),
            team: "Team 2",
            ready: false
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
      turn: listOfPlayers[0]
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

  nextRound: function() {
    Celebrity.update(
      {
        "players.userId": this.userId
      },
      {
        $inc: {
          round: 1
        }
      }
    );
  },

  scoreCard: function() {
    let turn = Celebrity.findOne({ "players.userId": this.userId }).turn;
    score = turn.hand.shift().points;
    if (turn.hand.length == 0) {
      Meteor.call("nextRound");
      return;
    }
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
            "turn.hand": turn.hand,
          },
          $inc: {
            team2score: score
          }
        }
      );
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
