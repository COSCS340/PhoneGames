import SimpleSchema from "simpl-schema";
import "../imports/games/TTT/TTTcollection.js";
import "../imports/games/Spyfall/SpyfallCollection.js";
import "../imports/games/Celebrity/CelebrityCollection.js";

Lobbies = new Mongo.Collection("lobbies");
const Schemas = {};

const PlayerSchema = new SimpleSchema({
  name: {
    type: String
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});

Schemas.Lobbies = new SimpleSchema({
  lobbyId: {
    type: String
  },

  createdById: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },

  createdByUser: {
    type: String
  },

  gameName: {
    type: String
  },

  minPlayers: {
    type: Number
  },

  maxPlayers: {
    type: Number
  },

  players: Array,
  "players.$": PlayerSchema,

  started: {
    type: Boolean
  }
});

Lobbies.attachSchema(Schemas.Lobbies);
