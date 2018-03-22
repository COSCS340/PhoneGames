import SimpleSchema from 'simpl-schema';

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
	type: String,
//		max: 4,
//		regEx: SimpleSchema.RegEx.Id,
	autoValue: function() {
		return Random.id(4).toUpperCase();
	}
  },
  
  gameName: {
	type: String,
  },
  
  createdBy: {
	type: String,
	regEx: SimpleSchema.RegEx.Id
  },
  
  players: Array,
  "players.$": PlayerSchema
  
});
  
Lobbies.attachSchema(Schemas.Lobbies); 