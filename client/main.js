import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import "../imports/games/Hangman/Hangman.js";
import "../imports/startup/accounts-config.js";
import "../imports/games/TTT/TTTclient.js";
import "../lib/collections.js";
import { msgCodes, errCodes } from "../lib/codes.js";
var cnt = 0;
var CelebrityData = require("../imports/games/Celebrity/cards.json");
var CelebrityCards = CelebrityData.cards;

Meteor.startup(() => {
  Session.set("docTitle", "Phone Games");
  Session.set("currentView", "homepage");
  Session.set("whatGame", "none");
  Session.set("mainDivClass", "center-center-container");
  Session.set("currentCard", "/Celebrity/Blacula.png");
  Meteor.subscribe("allUsers");
  Meteor.subscribe("lobbies");
  Meteor.subscribe("games");
  Meteor.subscribe("ttt");
  //	Tracker.autorun(function() {
  if (!Meteor.user()) {
    AccountsAnonymous.login();
  }
  //	});
});

Deps.autorun(function() {
  document.title = Session.get("docTitle");
});

Template.homepage.events({
  "click .btn-new-game": function() {
    Session.set("currentView", "gameSelect");
  },

  "click .btn-join-game": function() {
    Session.set("currentView", "joinGame");
  }
});

Template.header.events({
  "click .btn-home": function() {
    Session.set("currentView", "homepage");
    Session.set("docTitle", "Phone Games");
  },

  "click .btn-login": function() {
    Session.set("currentView", "loginPage");
  },

  "click .btn-user-profile": function() {
    Session.set("currentView", "userPage");
  }
});

Template.gameSelect.events({
  "click .btn-game-1": function() {
    Session.set("currentView", "gameHangmanUI");
    Session.set("docTitle", "Hangman");
  },

  "click .btn-game-2": function() {
    Session.set("docTitle", "Tic-Tac-Toe");
    Session.set("whatGame", "TTT");
    if (!Meteor.user().username) {
      Session.set("currentView", "newGame");
    } else {
      Meteor.call("createLobby", Session.get("whatGame"));
      Session.set("currentView", "lobby");
    }
  },

  "click .btn-game-3": function() {
    Session.set("whatGame", "Celebrity");
    Session.set("currentView", "celebrityTest");
    /*		if (!Meteor.user().username) {
    			Session.set("currentView", "newGame");
    		} else {
    			Meteor.call('createLobby', Session.get("whatGame"));
    			Session.set("currentView", "lobby");
    		}
    */
  },

  "click .btn-game-4": function() {
    Session.set("whatGame", "game4");
    if (!Meteor.user().username) {
      Session.set("currentView", "newGame");
    } else {
      Session.set("currentView", "lobby");
    }
  },

  "click .btn-game-5": function() {
    Session.set("whatGame", "game5");
    if (!Meteor.user().username) {
      Session.set("currentView", "newGame");
    } else {
      Session.set("currentView", "lobby");
    }
  },

  "click .btn-back": function() {
    Session.set("currentView", "homepage");
  }
});

Template.newGame.helpers({
  whatGame: function() {
    return Session.get("whatGame");
  }
});

Template.newGame.events({
  /* TODO */
  'blur input[name = "username"]': function(event, template) {
    if (!event.target.value || event.target.value.length > 15) {
      document.getElementById("textbox-name").style.borderColor = "#e52213";
      if (event.target.value.length > 15) {
        document.getElementById("errName").innerHTML =
          "names must be less than 15 characters";
      } else {
        document.getElementById("errName").innerHTML =
          "names must be more than 0 characters";
      }
    } else {
      document.getElementById("textbox-name").style.borderColor = "#e3e3e3";
      document.getElementById("errName").innerHTML = "";
    }
  },

  "click .btn-new-game": function(event, template) {
    event.preventDefault();
    var name = document.getElementById("textbox-name").value;
    if (name && name.length > 0 && name.length < 15) {
      Meteor.call("changeUsername", name);
      Meteor.call("createLobby", Session.get("whatGame"));
      Session.set("currentView", "lobby");
    } else {
      if (name.length == 0) {
        document.getElementById("errName").innerHTML =
          "names must be more than 0 characters";
        document.getElementById("textbox-name").style.borderColor = "#e52213";
      }
    }
  },

  "click .btn-back": function() {
    Session.set("currentView", "gameSelect");
  }
});

Template.joinGame.events({
  'blur input[name = "username"]': function(event, template) {
    var tVal = event.target.value;
    if (!tVal || tVal.length > 15) {
      document.getElementById("textbox-name").style.borderColor = "#e52213";
      if (tVal.length > 15) {
        document.getElementById("errName").innerHTML =
          "names must be less than 15 characters";
      } else {
        document.getElementById("errName").innerHTML =
          "names must be more than 0 characters";
      }
    } else {
      document.getElementById("textbox-name").style.borderColor = "#e3e3e3";
      document.getElementById("errName").innerHTML = "";
    }
  },

  /* change to event.target.length != # of chars lobby strings are later when lobbies are implemented */
  'blur input[name = "lobbyID"]': function(event, template) {
    var tVal = event.target.value;
    if (!tVal) {
      document.getElementById("textbox-lobby").style.borderColor = "#e52213";
      document.getElementById("errLobby").innerHTML =
        "lobby ids must be exactly x characters";
    } else {
      document.getElementById("textbox-lobby").style.borderColor = "#e3e3e3";
      document.getElementById("errLobby").innerHTML = "";
    }
  },

  "submit .userInfo": function(event, template) {
    event.preventDefault();
    if (document.getElementById("textbox-name")) {
      name = document.getElementById("textbox-name").value;
    }
    var lobbyId = document.getElementById("textbox-lobby").value;
    if (name && name.length > 0 && name.length < 15) {
      Meteor.call("changeUsername", name);
      //			Session.set("currentView", "lobby");
    } else if (name) {
      if (name.length == 0) {
        document.getElementById("errName").innerHTML =
          "names must be more than 0 characters";
        document.getElementById("textbox-name").style.borderColor = "#e52213";
      } else {
        document.getElementById("errName").innerHTML =
          "names must be less than 15 characters";
        document.getElementById("textbox-name").style.borderColor = "#e52213";
      }
    }
    Meteor.call("joinGame", lobbyId, function(error, result) {
      if (result == errCodes.invalidLobbyCode) {
        $("#errLobby").html(result);
        $("#textbox-lobby").css("border-color", "#e52213");
      } else if (result == errCodes.fullLobby) {
        $("#errLobby").html(result);
        $("#textbox-lobby").css("border-color", "#e52213");
      } else {
        console.log("returning true");
        Session.set("currentView", "lobby");
      }
    });

    //		Session.set("currentView", "forTesting");
  },

  "click .btn-back": function(event) {
    event.preventDefault();
    Session.set("currentView", "homepage");
  }
});

Template.lobby.onCreated(function() {
  var test = Lobbies.find({
    "players.userId": Meteor.userId()
  }).observeChanges({
    changed: function(id, fields) {
      var lobby = Lobbies.find({
        "players.userId": Meteor.userId()
      }).fetch();
      if (lobby[0].started == true) {
        Session.set("currentView", "TTT");
      } else {
        console.log(lobby);
        console.log(lobby[0].started);
      }
    }
  });
});

Template.lobby.events({
  "click .btn-start": function() {
    makeGame(Session.get("whatGame"));
    Session.set("currentView", Session.get("whatGame"));
    Meteor.call("startLobby");
  },

  "click .btn-back": function() {
    Session.set("currentView", "gameSelect");
  }
});

Template.lobby.helpers({
  whatGame: function() {
    return Session.get("whatGame");
  },

  lobbyId: function() {
    var lobby = Lobbies.find({}).fetch();
    if (lobby && lobby[0] && lobby[0].lobbyId) {
      return lobby[0].lobbyId;
    }
  },

  users: function() {
    var lobby = Lobbies.find({}).fetch();
    if (lobby && lobby[0] && lobby[0].players) {
      return lobby[0].players;
    }
  },

  names: function() {
    return this.name;
  },

  playerCount: function() {
    var lobby = Lobbies.find({}).fetch();
    if (lobby && lobby[0] && lobby[0].players) {
      return (
        lobby[0].players.length >= lobby[0].minPlayers &&
        lobby[0].players.length <= lobby[0].maxPlayers &&
        lobby[0].createdById == Meteor.user()._id
      );
    }
  }
});

/* this is used for testing so you can get back to the homepage after testing buttons or forms */
Template.forTesting.events({
  "click .btn-for-testing": function() {
    Session.set("currentView", "homepage");
  }
});

Template.main.helpers({
  currentView: function() {
    return Session.get("currentView");
  },

  mainDivClass: function() {
    return Session.get("mainDivClass");
  }
});

Template.footer.events({
  "click .btn-admin-info": function() {
    Session.set("currentView", "adminInfo");
  }
});

Template.adminInfo.events({
  "click .btn-users": function() {
    Session.set("currentView", "adminInfoUsers");
  },

  "click .btn-lobbies": function() {
    Session.set("currentView", "adminInfoLobbies");
  },

  "click .btn-msgcodes": function() {
    Session.set("currentView", "adminInfoMsgCodes");
  },

  "click .btn-errcodes": function() {
    Session.set("currentView", "adminInfoErrCodes");
  }
});

Template.adminInfoUsers.helpers({
  user: function() {
    return Meteor.users.find();
  }
});

Template.adminInfoUsers.events({
  "click .btn-remove-user": function() {
    Meteor.call("removeUser", this._id);
  },

  "click .btn-back": function() {
    Session.set("currentView", "adminInfo");
  }
});

Template.adminInfoLobbies.helpers({
  lobby: function() {
    return Lobbies.find().fetch();
  }
});

Template.adminInfoLobbies.events({
  "click .btn-remove-lobby": function() {
    Meteor.call("removeLobby", this.lobbyId);
  },

  "click .btn-back": function() {
    Session.set("currentView", "adminInfo");
  }
});

Template.adminInfoMsgCodes.helpers({
  msgcode: function() {
    return msgCodes;
  }
});

Template.adminInfoMsgCodes.events({
  "click .btn-back": function() {
    Session.set("currentView", "adminInfo");
  }
});

Template.adminInfoErrCodes.helpers({
  errcode: function() {
    return errCodes;
  }
});

Template.adminInfoErrCodes.events({
  "click .btn-back": function() {
    Session.set("currentView", "adminInfo");
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

function makeGame(gameName) {
  if (gameName == "TTT") {
    Meteor.call(
      "makeTTT",
      Meteor.userId(),
      Lobbies.find({
        createdBy: this.userId
      }).fetch()[0].players[1].userId
    );
  } else {
    console.log("the game name is undefined: " + gameName);
  }
}

$(document).keypress(function(event) {
  if (event.which == "13") {
    event.preventDefault();
  }
});
