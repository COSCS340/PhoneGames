import SimpleSchema from 'simpl-schema';

Lobbies = new Mongo.Collection("lobbies");
Games = new Mongo.Collection("games");
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
		},

		createdById: {
			type: String,
			regEx: SimpleSchema.RegEx.Id
		},

		createdByUser: {
			type: String,
		},

		gameName: {
			type: String,
		},

		minPlayers: {
			type: Number,
		},

		maxPlayers: {
			type: Number,
		},

		players: Array,
		"players.$": PlayerSchema

	});

Schemas.Games = new SimpleSchema({
		name: {
			type: String,
		},

		createdBy: {
			type: String,
		},

		minPlayers: {
			type: Number,
		},

		maxPlayers: {
			type: Number,
		},

		players: Array,
		"players.$": PlayerSchema

	});

Lobbies.attachSchema(Schemas.Lobbies);
Games.attachSchema(Schemas.Game);