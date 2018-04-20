// import "./CelebrityCollection.js";

var CelebrityData = require("./CelebrityCards.json");
var CelebrityCards = CelebrityData.cards;

Meteor.methods({
  makeCelebrity: function(cardSafety, gameLength) {
    var listOfPlayers = Lobbies.findOne({ createdById: this.userId }).players;
    if (
      typeof listOfPlayers == "undefined" ||
      typeof listOfPlayers.length == "undefined"
    ) {
      console.log(listOfPlayers);
      return console.log("Something went wrong");
    }
    var team1 = [],
      team2 = [];
    for (let i = 0; i < listOfPlayers.length; i++) {
      if (!(i % 2)) {
        team1.push(listOfPlayers[i]);
      } else {
        team2.push(listOfPlayers[i]);
      }
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

    team1.forEach(function(player, index, team) {
      team[index] = Object.assign(
        {
          hand: tmpdeck.splice(0, numCards * 2),
          team: "team1",
          ready: false
        },
        player
      );
    });

    team2.forEach(function(player, index, team) {
      team[index] = Object.assign(
        {
          hand: tmpdeck.splice(0, numCards * 2),
          team: "team2",
          ready: false
        },
        player
      );
    });

    Celebrity.insert({
      team1players: team1,
      team2players: team2,
      team1score: 0,
      team2score: 0,
      round: 1,
      ready: 0,
      deck: []
    });

    /*    console.log(
      Celebrity.find({
        $or: [
          {
            "team1players.userId": this.userId
          },
          {
            "team2players.userId": this.userId
          }
        ]
      }).fetch()
    );
    */
  },

  selectCards: function(addCards) {
    let celeb = Celebrity.findOne({
      $or: [
        {
          "team1players.userId": this.userId
        },
        {
          "team2players.userId": this.userId
        }
      ]
    });

    Celebrity.update(
      { _id: celeb._id },
      { $addToSet: { deck: { $each: addCards } } }
    );

    Celebrity.update(
      { _id: celeb._id },
      { $set: { ready: celeb.ready + 1 } }
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
