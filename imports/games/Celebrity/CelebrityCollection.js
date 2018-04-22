import SimpleSchema from "simpl-schema";

Celebrity = new Mongo.Collection("celebrity");
const Schemas = {};

const PlayerInfoSchema = new SimpleSchema({
  name: {
    type: String
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  hand: Array,
  "hand.$": Object,
  "hand.$.name": String,
  "hand.$.points": Number,
  "hand.$.safe": String,
  "hand.$.path": String,

  team: {
    type: String
  },

  order: {
    type: Number
  }
});

Schemas.Celebrity = new SimpleSchema({
  players: Array,
  "players.$": PlayerInfoSchema,

  team1score: {
    type: Number
  },

  team2score: {
    type: Number
  },

  round: {
    type: Number
  },

  deck: Array,
  "deck.$": Object,
  "deck.$.name": String,
  "deck.$.points": Number,
  "deck.$.safe": String,
  "deck.$.path": String,

  ready: {
    type: Number
  },

  started: {
    type: Boolean
  },

  finished: {
    type: Boolean
  },

  turn: {
    type: PlayerInfoSchema
  },

  time: {
    type: Number
  }
});

Celebrity.attachSchema(Schemas.Celebrity);
