import SimpleSchema from 'simpl-schema';

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
  hand: {
    type: Array
  }
});

Schemas.Celebrity = new SimpleSchema({
  team1: Array,
  "team1.$": PlayerInfoSchema,

  team2: Array,
  "team2.$": PlayerInfoSchema,
});

Celebrity.attachSchema(Schemas.Celebrity);
