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
      Session.set("whatGame", "celebrity");
      Meteor.call("startLobby", function() {
        Session.set("currentView", "celebrity");
      });
    });
  }
});

Template.celebrity.helpers({
  hand: function() {
    let celeb = Celebrity.find({
      $or: [
        {
          "team1players.userId": Meteor.userId()
        },
        {
          "team2players.userId": Meteor.userId()
        }
      ]
    }).fetch();
    if (typeof(celeb[0].team1players) != "undefined") {
      return celeb[0].team1players.map(function(player) {
        if (player.userId == Meteor.userId()) {
          return player.hand;
        }
      })[0];
    }
    if (typeof(celeb[0].team2players) != "undefined") {
      return celeb[0].team2players.map(function(player) {
        if (player.userId == Meteor.userId()) {
          return player.hand;
        }
      })[0];
    }
  },
  selected: function() {
    return false;
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
