import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import "../imports/games/Hangman/Hangman.js";
import "../imports/startup/accounts-config.js";
import "../imports/games/TTT/TTTclient.js";
import "../imports/games/Spyfall/SpyfallClient.js";
import "../imports/games/Celebrity/CelebrityClient.js";
import "../lib/collections.js";
import { msgCodes, errCodes } from "../lib/codes.js";
import "../imports/chatbox/chatlobby_client.js";

Meteor.startup(() => {
  Session.set("docTitle", "Phone Games");
  Session.set("currentView", "homepage");
  Session.set("whatGame", "none");
  Session.set("mainDivClass", "center-center-container");
  Meteor.subscribe("allUsers");
  Meteor.subscribe("lobbies");
  Meteor.subscribe("ttt");
  Meteor.subscribe("celebrity");
  Meteor.subscribe("SpyfallGames");
  Tracker.autorun(function() {
    if (!Meteor.user()) {
      AccountsAnonymous.login();
    }
  });
});

Tracker.autorun(function() {
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
  "click .btn-hangman": function() {
    Session.set("currentView", "gameHangmanUI");
    Session.set("docTitle", "Hangman");
  },

  "click .btn-ttt": function() {
    Session.set("docTitle", "Tic-Tac-Toe");
    Session.set("whatGame", "TTT");
    if (!Meteor.user().username) {
      Session.set("currentView", "newGame");
    } else {
      Meteor.call("createLobby", Session.get("whatGame"), function() {
        Session.set("currentView", "lobby");
      });
    }
  },

  "click .btn-celebrity": function() {
    Session.set("docTitle", "Celebrity");
    Session.set("whatGame", "Celebrity");
    if (!Meteor.user().username) {
      Session.set("currentView", "newGame");
    } else {
      Meteor.call("createLobby", Session.get("whatGame"), function() {
        Session.set("currentView", "lobby");
      });
    }
  },

  "click .btn-spyfall": function() {
    Session.set("whatGame", "Spyfall");
    Session.set("docTitle", "Spyfall");
    if (!Meteor.user().username) {
      Session.set("currentView", "newGame");
    } else {
      Meteor.call("createLobby", Session.get("whatGame"), function() {
        Session.set("currentView", "lobby");
      });
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
  'blur input[name = "username"]': function(event, template) {
    if (!event.target.value || event.target.value.length > 15) {
      $("#textbox-name").css("border-color", "#e52213");
      if (event.target.value.length > 15) {
        $("#errName").html("names must be less than 15 characters");
      } else {
        $("#errName").html("names must be more than 0 characters");
      }
    } else {
      $("#textbox-name").css("border-color", "#e3e3e3");
      $("#errName").html("");
    }
  },

  "submit .userInfo": function(event, template) {
    event.preventDefault();
    var name = document.getElementById("textbox-name").value;
    if (name && name.length > 0 && name.length < 15) {
      Meteor.call("changeUsername", name, function(error, result) {
        if (result == errCodes["userTaken"]) {
          $("#errName").html(result);
          $("#textbox-name").css("border-color", "#e52213");
          return;
        } else {
          Meteor.call("createLobby", Session.get("whatGame"), function() {
            Session.set("currentView", "lobby");
          });
        }
      });
    } else if (name) {
      if (name.length == 0) {
        $("#errName").html("names must be more than 0 characters");
        $("#textbox-name").css("border-color", "#e52213");
      } else if (name.length >= 15) {
        $("#errName").html("names must be less than 15 characters");
        $("#textbox-name").css("border-color", "#e52213");
      }
    }
  },

  "click .btn-back": function(event) {
    event.preventDefault();
    Session.set("currentView", "gameSelect");
  }
});

Template.joinGame.events({
  'blur input[name = "username"]': function(event, template) {
    var tVal = event.target.value;
    if (!tVal || tVal.length > 15) {
      $("#textbox-name").css("border-color", "#e52213");
      if (tVal.length > 15) {
        $("#errName").html("names must be less than 15 characters");
      } else {
        $("#errName").html("names must be more than 0 characters");
      }
    } else {
      $("#textbox-name").css("border-color", "#e3e3e3");
      $("#errName").html("");
    }
  },

  'blur input[name = "lobbyID"]': function(event, template) {
    if (event.target.value.length != 4) {
      $("#textbox-lobby").css("border-color", "#e52213");
      $("#errLobby").html("lobby ids must be exactly 4 characters");
    } else {
      $("#textbox-lobby").css("border-color", "#e3e3e3");
      $("#errLobby").html("");
    }
  },

  "submit .userInfo": function(event, template) {
    event.preventDefault();
    if (document.getElementById("textbox-name")) {
      name = document.getElementById("textbox-name").value;
    }
    var lobbyId = document.getElementById("textbox-lobby").value.toUpperCase();
    if (name && name.length > 0 && name.length < 15) {
      Meteor.call("changeUsername", name, function(error, result) {
        if (result == errCodes["userTaken"]) {
          $("#errName").html(result);
          $("#textbox-name").css("border-color", "#e52213");
          return;
        }
      });
    } else if (name) {
      if (name.length == 0) {
        $("#errName").html("names must be more than 0 characters");
        $("#textbox-name").css("border-color", "#e52213");
      } else if (name.length >= 15) {
        $("#errName").html("names must be less than 15 characters");
        $("#textbox-name").css("border-color", "#e52213");
      } else {
        Meteor.call("joinGame", lobbyId, function(error, result) {
          if (result == errCodes.invalidLobbyCode || result == errCodes.fullLobby) {
            $("#errLobby").html(result);
            $("#textbox-lobby").css("border-color", "#e52213");
          } else {
            Session.set("docTitle", result);
            Session.set("currentView", "lobby");
          }
        });
      }
    }
  },

  "click .btn-back": function(event) {
    event.preventDefault();
    Session.set("currentView", "homepage");
  }
});

var lobbyObserve;
Template.lobby.onCreated(function() {
  lobbyObserve = Lobbies.find({
    "players.userId": Meteor.userId()
  }).observeChanges({
    changed: function(id, fields) {
      var lobby = Lobbies.find({
        "players.userId": Meteor.userId()
      }).fetch();
      if (lobby[0].started == true) {
        Session.set("whatGame", lobby[0].gameName);
        Session.set("currentView", lobby[0].gameName);
      } else {
        console.log(lobby);
        console.log(lobby[0].started);
      }
    }
  });
  lobby = Lobbies.findOne({
    "players.userId": Meteor.userId()
  });
  Session.set("whatGame", lobby.gameName);
});

Template.lobby.onDestroyed(function() {
  lobbyObserve.stop();
  if (Session.get("whatGame") != Session.get("currentView")) {
    Meteor.call("removePlayer");
  }
});

Template.lobby.events({
  "click .btn-start": function() {
    console.log(Session.get("whatGame"));
    makeGame(Session.get("whatGame"));
  },

  "click .btn-back": function() {
    Session.set("currentView", "gameSelect");
    Session.set("docTitle", "Phone Games");
  }
});

Template.lobby.helpers({
  whatGame: function() {
    let game = Session.get("whatGame");
    if (game == "TTT") {
      return "Tic-Tac-Toe";
    }
    return game;
  },

  lobbyId: function() {
    var lobby = Lobbies.find({"players.userId": Meteor.userId()}).fetch();
    if (lobby && lobby[0] && lobby[0].lobbyId) {
      return lobby[0].lobbyId;
    }
  },

  users: function() {
    var lobby = Lobbies.find({"players.userId": Meteor.userId()}).fetch();
    if (lobby && lobby[0] && lobby[0].players) {
      return lobby[0].players;
    }
  },

  names: function() {
    return this.name;
  },

  playerCountMet: function() {
    var lobby = Lobbies.find({"players.userId": Meteor.userId()}).fetch();
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
  },

  "click .btn-celeb": function() {
    Session.set("currentView", "adminInfoCelebrity");
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

Template.adminInfoCelebrity.helpers({
  celeb: function() {
    return Celebrity.find().fetch();
  }
});

Template.adminInfoCelebrity.events({
  "click .btn-remove-celeb": function() {
    Meteor.call("removeCelebrity", this._id);
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

function makeGame(gameName) {
  if (gameName == "TTT") {
    Meteor.call(
      "makeTTT",
      Meteor.userId(),
      Lobbies.find({
        createdBy: this.userId
      }).fetch()[0].players[1].userId
    );
    Meteor.call("startLobby", function() {
      Session.set("currentView", Session.get("whatGame"));
    });
  } else if (gameName == "Spyfall") {
    let players = Lobbies.findOne({ createdBy: this.userId }).players;
    if (players) {
      Meteor.call("makeSpyfall", players);
    }
    Meteor.call("startLobby");
  } else if (gameName == "Celebrity") {
    Session.set("whatGame", "celebrityLobbyOptions");
    Session.set("currentView", Session.get("whatGame"));
  } else {
    console.log("the game name is undefined: " + gameName);
  }
}
