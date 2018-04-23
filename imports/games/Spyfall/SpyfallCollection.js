import SimpleSchema from "simpl-schema";

SpyfallGames = new Mongo.Collection("SpyfallGames");
const Schemas = {};

const PlayerInfoSchema = new SimpleSchema({
  name: {
    type: String
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  role: {
    type: String
  }
});

Schemas.SpyfallGames = new SimpleSchema({

  players: Array,
  "players.$": PlayerInfoSchema,

  location: {
    type: String
  },

  endTime: {
    type: Number
  }

});

SpyfallGames.attachSchema(Schemas.SpyfallGames);
