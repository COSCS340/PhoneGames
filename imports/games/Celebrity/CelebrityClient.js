import "./Celebrity.html";
import { gameLength, cardSafety } from "./config.js";

var cnt = 0;
var CelebrityData = require("./CelebrityCards.json");
var CelebrityCards = CelebrityData.cards;
var safe;
var length;

Template.celebrityLobbyOptions.events({
  "click .btn-start": function() {
    safe = cardSafety[$("#cardSafety :selected").text()];
    length = gameLength[$("#gameLength :selected").text()];
    Meteor.call("makeCelebrity", safe, length, function() {
      Session.set("whatGame", "Celebrity");
      Meteor.call("startLobby", function() {
        Session.set("currentView", "Celebrity");
      });
    });
  }
});

Template.Celebrity.onCreated(function() {
  Session.set("selected", false);
});

Template.Celebrity.helpers({
  card: function() {
    let celeb = Celebrity.find({
      "players.userId": Meteor.userId()
    }).fetch();
    if (typeof celeb[0].players != "undefined") {
      var playerHand = celeb[0].players.map(function(player) {
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

    if (typeof celeb.started != "undefined") {
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

Template.celebrityPlay.events({
  "click .btn-pass": function() {
    Meteor.call("nextCard");
  },
  "click .btn-got": function() {
    Meteor.call("scoreCard");
  }
});

Template.celebrityPlay.helpers({
  myTurn: function() {
    let celeb = Celebrity.find({
      "players.userId": Meteor.userId()
    }).fetch()[0];
    return celeb.turn && celeb.turn.userId == Meteor.userId();
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
    if (celeb && celeb.turn && celeb.turn.team) {
      return celeb.turn.team;
    }
  },

  round: function() {
    let celeb = Celebrity.find({
      "players.userId": Meteor.userId()
    }).fetch()[0];
    if (celeb && celeb.round) {
      return celeb.round;
    }
  }
});

Template.celebrityTest.helpers({
  card: function() {
    return Session.get("currentCard");
  }
});

Template.celebrityTest.events({
  "click .btn-next": function() {
    cnt += 1;
    Session.set("currentCard", CelebrityCards[cnt - 1].path);
  },
  "click .btn-list": function() {
    Session.set("currentView", "celebrityCardList");
  }
});

Template.celebrityCardList.helpers({
  CelebrityCards: function() {
    return CelebrityCards;
  }
});
