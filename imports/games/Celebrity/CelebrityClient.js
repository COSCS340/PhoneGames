import "./Celebrity.html";
import { gameLength, cardSafety } from "./config.js";
var CelebrityData = require("./CelebrityCards.json");
var CelebrityCards = CelebrityData.cards;

Template.celebrityLobbyOptions.events({
  "click .btn-start": function() {
    let safe = cardSafety[$("#cardSafety :selected").text()];
    let length = gameLength[$("#gameLength :selected").text()];
    Meteor.call("makeCelebrity", safe, length, function() {
      Session.set("whatGame", "Celebrity");
      Meteor.call("startLobby", function() {
        Session.set("currentView", "Celebrity");
      });
    });
  }
});

Template.celebrityLobbyOptions.onDestroyed(function() {
  if (Session.get("currentView") != "Celebrity") {
    Meteor.call("removePlayer");
  }
});

Template.Celebrity.onCreated(function() {
  Session.set("selected", false);
});

Template.Celebrity.helpers({
  card: function() {
    let celeb = Celebrity.findOne({
      "players.userId": Meteor.userId()
    });
    if (celeb && celeb.players) {
      var playerHand = celeb.players.map(function(player) {
        if (player.userId == Meteor.userId()) {
          return player.hand;
        }
      });
      for (let i = 0; i < playerHand.length; i++) {
        if (typeof playerHand[i] != "undefined") {
          return playerHand[i];
        }
      }
    }
  },
  selected: function() {
    return Session.get("selected");
  },
  started: function() {
    let celeb = Celebrity.findOne({
      "players.userId": Meteor.userId()
    });
    if (!celeb) {
      return true;
    }

    if (celeb && celeb.started) {
      return celeb.started;
    }
    return false;
  },
  hand: function() {
    let celeb = Celebrity.findOne({
      "players.userId": Meteor.userId()
    });
  }
});

Template.Celebrity.events({
  "click .btn-select": function() {
    let checkboxes = document.getElementsByClassName("cardSelect");
    let cnt = 0;
    let selected = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        selected.push(checkboxes[i].id);
        cnt++;
      }
    }
    if (cnt == checkboxes.length / 2) {
      let addCards = [];
      for (let i = 0; i < checkboxes.length / 2; i++) {
        addCards.push(
          CelebrityCards.find(function(card) {
            return card.name == selected[i];
          })
        );
      }
      Meteor.call("selectCards", addCards, function() {
        Session.set("selected", true);
        Meteor.call("checkReady");
      });

      $("#errCards").html("You're good to go.");
    } else if (cnt > checkboxes.length / 2) {
      $("#errCards").html(
        "You've selected more than " + checkboxes.length / 2 + " cards."
      );
    } else {
      $("#errCards").html(
        "You've selected less than " + checkboxes.length / 2 + " cards."
      );
    }
  }
});

Template.Celebrity.onDestroyed(function() {
  Meteor.call("removePlayer");
  Meteor.call("removeCelebPlayer");
});

Template.celebrityPlay.events({
  "click .btn-pass": function() {
    Meteor.call("nextCard");
  },
  "click .btn-got": function() {
    Meteor.call("scoreCard");
  },
  "click .btn-start": function() {
    Meteor.call("timer", function() {
      Session.set("ready", true);
    });
  }
});

Template.celebrityPlay.helpers({
  myTurn: function() {
    let celeb = Celebrity.find({
      "players.userId": Meteor.userId()
    }).fetch()[0];
    if (celeb.turn && celeb.turn.userId == Meteor.userId()) {
      return true;
    } else {
      Session.set("ready", false);
      return false;
    }
  },

  cardPath: function() {
    let celeb = Celebrity.find({
      "players.userId": Meteor.userId()
    }).fetch()[0];
    if (celeb && celeb.turn && celeb.turn.hand && celeb.turn.hand[0].path) {
      return celeb.turn.hand[0].path;
    }
  },

  currentTeam: function() {
    let celeb = Celebrity.find({
      "players.userId": Meteor.userId()
    }).fetch()[0];
    if (celeb && celeb.turn && celeb.turn.team && celeb.players) {
      for (let i = 0; i < celeb.players.length; i++) {
        if (celeb.players[i].userId == Meteor.userId()) {
          if (celeb.turn.team == celeb.players[i].team) {
            return "your";
          } else {
            return "the other";
          }
        }
      }
    }
  },

  ready: function() {
    return Session.get("ready");
  },

  round: function() {
    let celeb = Celebrity.find({
      "players.userId": Meteor.userId()
    }).fetch()[0];
    if (celeb && celeb.round) {
      return celeb.round;
    }
  },

  time: function() {
    let celeb = Celebrity.find({
      "players.userId": Meteor.userId()
    }).fetch()[0];
    if (celeb && celeb.time) {
      let time = new Date(60000 - celeb.time);
      if (time < 10000) {
        return time.getUTCMinutes() + ':0' + time.getUTCSeconds();
      }
      return time.getUTCMinutes() + ':' + time.getUTCSeconds();
    } else {
      return '1:00';
    }
  },
  endStr: function() {
    let celeb = Celebrity.find({
      "players.userId": Meteor.userId()
    }).fetch()[0];
    if (celeb) {
      if (celeb.team1score > celeb.team2score) {
        return "Team 1 won with a score of " + celeb.team1score + "<br>Team 2 lost with a score of " + celeb.team2score;
      } else if (celeb.team1score < celeb.team2score) {
        return "Team 2 won with a score of " + celeb.team2score + "<br>Team 1 lost with a score of " + celeb.team1score;
      } else if (celeb.team1score == celeb.team2score) {
        return "Both teams tied with a score of " + celeb.team1score;
      }
    } else {
      return "This game has been deleted.";
    }
  },
  gameEnded: function() {
    let celeb = Celebrity.find({
      "players.userId": Meteor.userId()
    }).fetch()[0];
    if (!celeb) {
      return true;
    }
    if (celeb && celeb.finished) {
      return celeb.finished;
    }
  }

});

Template.celebrityPlay.onCreated(function(){
  Session.set("ready", false);
});
