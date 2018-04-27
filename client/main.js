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
import { msgCodes, errCodes, minimumPlayers, maximumPlayers } from "../lib/codes.js";
import "../imports/chatbox/chatlobby_client.js";

Meteor.startup(() => {
  Session.set("docTitle", "Phone Games");
  Session.set("currentView", "homepage");
  Session.set("whatGame", "none");
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
        $("#errName").html(errCodes.nameTooLong);
      } else {
        $("#errName").html(errCodes.nameTooShort);
      }
    } else {
      $("#textbox-name").css("border-color", "#e3e3e3");
      $("#errName").html("");
    }
  },

  'blur input[name = "lobbyID"]': function(event, template) {
    if (event.target.value.length != 4) {
      $("#textbox-lobby").css("border-color", "#e52213");
      $("#errLobby").html(errCodes.lobbyIdLen);
    } else {
      $("#textbox-lobby").css("border-color", "#e3e3e3");
      $("#errLobby").html("");
    }
  },

  "submit .userInfo": function(event, template) {
    event.preventDefault();
    var lobbyId = document.getElementById("textbox-lobby").value.toUpperCase();
    if (document.getElementById("textbox-name")) {
      name = document.getElementById("textbox-name").value;
      if (name && name.length > 0 && name.length < 15) {
        Meteor.call("changeUsername", name, function(error, result) {
          if (result == errCodes.userTaken) {
            $("#errName").html(result);
            $("#textbox-name").css("border-color", "#e52213");
            return;
          }
        });
      } else if (name) {
        if (name.length == 0) {
          $("#errName").html(errCodes.nameTooShort);
          $("#textbox-name").css("border-color", "#e52213");
        } else if (name.length >= 15) {
          $("#errName").html(errCodes.nameTooLong);
          $("#textbox-name").css("border-color", "#e52213");
        } else {
          Meteor.call("joinGame", lobbyId, function(error, result) {
            if (
              result == errCodes.invalidLobbyCode ||
              result == errCodes.fullLobby
            ) {
              $("#errLobby").html(result);
              $("#textbox-lobby").css("border-color", "#e52213");
            } else {
              Session.set("docTitle", result);
              Session.set("currentView", "lobby");
            }
          });
        }
      }
    } else {
      Meteor.call("joinGame", lobbyId, function(error, result) {
        if (
          result == errCodes.invalidLobbyCode ||
          result == errCodes.fullLobby
        ) {
          $("#errLobby").html(result);
          $("#textbox-lobby").css("border-color", "#e52213");
        } else {
          Session.set("docTitle", result);
          Session.set("currentView", "lobby");
        }
      });
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
        if (lobby[0].gameName != "Tic-Tac-Toe") {
          Session.set("whatGame", lobby[0].gameName);
          Session.set("currentView", lobby[0].gameName);
        } else {
          Session.set("currentView", "TTT");
        }
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
    Meteor.call("removePlayer", Meteor.userId());
  }
});

Template.lobby.events({
  "click .btn-start": function() {
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
    var lobby = Lobbies.find({ "players.userId": Meteor.userId() }).fetch();
    if (lobby && lobby[0] && lobby[0].lobbyId) {
      return lobby[0].lobbyId;
    }
  },

  users: function() {
    var lobby = Lobbies.find({ "players.userId": Meteor.userId() }).fetch();
    if (lobby && lobby[0] && lobby[0].players) {
      return lobby[0].players;
    }
  },

  names: function() {
    return this.name;
  },

  playerCountMet: function() {
    var lobby = Lobbies.find({ "players.userId": Meteor.userId() }).fetch();
    if (lobby && lobby[0] && lobby[0].players) {
      return (
        lobby[0].players.length >= lobby[0].minPlayers &&
        lobby[0].players.length <= lobby[0].maxPlayers &&
        lobby[0].createdById == Meteor.user()._id
      );
    }
  },
  min: function() {
    return minimumPlayers[Session.get("whatGame")];
  },
  max: function() {
    return maximumPlayers[Session.get("whatGame")];
  }
});

Template.main.helpers({
  currentView: function() {
    return Session.get("currentView");
  }
});

Template.footer.events({
  "click .btn-admin-info": function() {
    Session.set("currentView", "adminInfo");
  }
});

Template.footer.helpers({
  isAdmin: function() {
    let user = Meteor.users.findOne({ _id: Meteor.userId() });
    if (user) {
      let name = user.username;
      if (
        name == "Jerry" ||
        name == "Preston" ||
        name == "Cameron" ||
        name == "Howard"
      ) {
        return true;
      }
      return false;
    }
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
  },

  "click .btn-ttt": function() {
    Session.set("currentView", "adminInfoTTT");
  },

  "click .btn-spyfall": function() {
    Session.set("currentView", "adminInfoSpyfall");
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

Template.adminInfoTTT.helpers({
  TTT: function() {
    return TTT.find().fetch();
  }
});

Template.adminInfoTTT.events({
  "click .btn-remove-ttt": function() {
    Meteor.call("removeTTT", this._id);
  },

  "click .btn-back": function() {
    Session.set("currentView", "adminInfo");
  }
});

Template.adminInfoSpyfall.helpers({
  spyfall: function() {
    return SpyfallGames.find().fetch();
  }
});

Template.adminInfoSpyfall.events({
  "click .btn-remove-spyfall": function() {
    Meteor.call("removeSpyfall", this._id);
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
  if (gameName == "Tic-Tac-Toe") {
    Meteor.call(
      "makeTTT",
      Meteor.userId(),
      Lobbies.find({
        createdBy: this.userId
      }).fetch()[0].players[1].userId
    );
    Meteor.call("startLobby", function() {
      Session.set("currentView", "TTT");
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
