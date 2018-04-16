import SimpleSchema from 'simpl-schema';

TTT = new Mongo.Collection("ttt");
const Schemas = {};

Schemas.TTT = new SimpleSchema({
  player1: {
    type: String,
  },
  player2: {
    type: String,
  },
  turn: {
    type: String,
  },
  board: {
    type: String,
  },
  win: {
    type: Number,
  }
});

TTT.attachSchema(Schemas.TTT);
