import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import "../lib/collections.js";
import "../imports/games/TTT/TTTserver.js";
import "../imports/games/Spyfall/SpyfallServer.js";
import "../imports/games/Celebrity/CelebrityServer.js";
import {
  msgCodes,
  errCodes,
  minimumPlayers,
  maximumPlayers
} from "../lib/codes.js";
import "../imports/chatbox/chatlobby_server.js";

Meteor.startup(() => {
  Lobbies.remove({});
  TTT.remove({});
  SpyfallGames.remove({});
  Celebrity.remove({});

  Tracker.autorun(function() {
    Meteor.publish("lobbies", function() {
      return Lobbies.find();
    });

    Meteor.publish("allUsers", function() {
      return Meteor.users.find();
    });

    Meteor.publish("ttt", function() {
      return TTT.find();
    });

    Meteor.publish("celebrity", function() {
      return Celebrity.find();
    });

    Meteor.publish("SpyfallGames", function() {
      return SpyfallGames.find();
    });
  });

  Meteor.methods({
    removeUser: function(userId) {
      Meteor.users.remove(userId);
    },

    changeUsername: function(userName) {
      if (Meteor.users.find({ username: userName }).fetch().length == 0) {
        Meteor.users.update(
          {
            _id: Meteor.user()._id
          },
          {
            $set: {
              username: userName
            }
          }
        );
      } else {
        return errCodes["userTaken"];
      }
    },

    removePlayer: function() {
      var lobby = Lobbies.findOne({
        "players.userId": this.userId
      });
      console.log(lobby);
      if (lobby.players.length > 1) {

        Lobbies.update(
          { _id: lobby._id },
          { $pull: { players: { userId: this.userId } } }
        );
        for (let i = 0; i < lobby.players.length; i++){
          if (lobby.players[i].userId != this.userId){
            return Lobbies.update(
              { _id: lobby._id },
              {
                $set: {
                  createdById: lobby.players[i].userId,
                  createdByUser: lobby.players[i].name
                }
              }
            );
          }
        }
      } else {
        Lobbies.remove({ _id: lobby._id });
      }
    },

    removeLobby: function(lobbyId) {
      if (!lobbyId) {
        throw new Meteor.Error("lobby-invalid", errCodes[0]);
      }

      return Lobbies.remove({
        _id: Lobbies.findOne({
          lobbyId: lobbyId
        })._id
      });
    },

    createLobby: function(whatGame) {
      let id;
      if (!this.userId) {
        throw new Meteor.Error("access-denied", errCodes[1]);
      }

      const user = Meteor.users.findOne(this.userId);
      const player = {
        name: user.username,
        userId: this.userId
      };

      var min = minimumPlayers[whatGame];
      var max = maximumPlayers[whatGame];
      if (whatGame == "TTT") {
        whatGame = "Tic-Tac-Toe";
      }

      const newGame = {
        lobbyId: Random.id(4).toUpperCase(),
        createdById: this.userId,
        createdByUser: user.username,
        gameName: whatGame,
        players: [player],
        minPlayers: min,
        maxPlayers: max,
        started: false
      };

      return (id = Lobbies.insert(newGame));
    },

    startLobby: function() {
      Lobbies.update(
        {
          "players.userId": this.userId
        },
        {
          $set: {
            started: true
          }
        }
      );
    },

    joinGame: function(gameId) {
      if (Meteor.user() == null) {
        throw new Meteor.Error(
          "not-logged-in",
          "You must be logged in to join a game"
        );
      }

      const lobby = Lobbies.findOne({
        lobbyId: gameId
      });
      if (typeof lobby == "undefined") {
        return errCodes.invalidLobbyCode;
      }

      if (lobby.players.length + 1 > lobby.maxPlayers) {
        return errCodes.fullLobby;
      }

      if (
        !!_.findWhere(lobby.players, {
          userId: Meteor.userId()
        })
      ) {
        throw new Meteor.Error(
          "already-joined-game",
          "You (${Meteor.userId()}) have already joined game with id ${gameId} ${hasAlreadyJoined} ${player}"
        );
      }

      var player = {
        userId: Meteor.userId(),
        name: __guard__(Meteor.user(), x => x.username)
      };

      Lobbies.update(
        {
          lobbyId: gameId
        },
        {
          $addToSet: {
            players: player
          }
        }
      );
      return lobby.gameName;
    },

    removeCelebrity: function(celebId) {
      if (!celebId) {
        throw new Meteor.Error("celeb-invalid", errCodes[0]);
      }
      return Celebrity.remove({
        _id: celebId
      });
    },
  });

  Lobbies.allow({
    insert(userId, doc) {
      return Meteor.userId() !== null;
    },
    update(userId, doc, fieldNames, modifier) {
      const player = {
        userId: Meteor.userId(),
        name: Meteor.user().username
      };
      return (
        _.findWhere(doc.players, player) != null && doc.hasFinished === false
      );
    },
    remove(userId, doc) {
      return false;
    }
  });
});

function __guard__(value, transform) {
  return typeof value !== "undefined" && value !== null
    ? transform(value)
    : undefined;
}
