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

  ready: {
    type: Boolean
  }
});

Schemas.Celebrity = new SimpleSchema({
  team1players: Array,
  "team1players.$": PlayerInfoSchema,

  team2players: Array,
  "team2players.$": PlayerInfoSchema,

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
  "deck.$.path": String
});

Celebrity.attachSchema(Schemas.Celebrity);
