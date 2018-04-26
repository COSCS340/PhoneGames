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
  // Games.remove({});
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

    Meteor.publish("games", function() {
      return Games.find();
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
      if (lobby.players.length > 1) {
        Lobbies.update(
          { _id: lobby._id },
          { $pull: { players: { userId: this.userId } } }
        );
        Lobbies.update(
          { _id: lobby._id },
          {
            $set: {
              createdById: lobby.players[0].userId,
              createdByUser: lobby.players[0].name
            }
          }
        );
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

      const game = Lobbies.findOne({
        lobbyId: gameId
      });
      if (typeof game == "undefined") {
        return errCodes.invalidLobbyCode;
      }

      if (game.players.length + 1 > game.maxPlayers) {
        return errCodes.fullLobby;
      }

      if (
        !!_.findWhere(game.players, {
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

      return Lobbies.update(
        {
          lobbyId: gameId
        },
        {
          $addToSet: {
            players: player
          }
        }
      );
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
