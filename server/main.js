import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import '../lib/collection.js';

Meteor.startup(() => {
  // code to run on server at startup
  
Lobbies.remove({});

Tracker.autorun(function() {  
  Meteor.publish('lobbies', function() {
	return Lobbies.find(/*{"createdBy": this.userId}*/);
  });
  
  Meteor.publish('allUsers', function() {
   return Meteor.users.find()
  });
});

  Meteor.methods({
	  removeUser: function(userId) {
		Meteor.users.remove(userId);
	  },
	  
	  changeUsername: function(userName) {
		Meteor.users.update({_id:Meteor.user()._id}, {$set:{"username":userName}});
	  },
	  
	  createLobby: function(whatGame) {
		let id;
		if (!this.userId) { 
			throw new Meteor.Error('access-denied', 'You must be logged in to create a game.'); 
		}

		const user = Meteor.users.findOne(this.userId);
		const player = {
		  name: user.username,
		  userId: this.userId
		};
		const newGame = {
		  createdBy: this.userId,
		  players: [ player ],
		  gameName: whatGame,
		};

		return id = Lobbies.insert(newGame);
	  },
	  
	  joinGame(gameId) {

		  if ((Meteor.user() == null)) { 
			throw new Meteor.Error('not-logged-in', 'You must be logged in to join a game'); 
		  }

		  const criteria = {lobbyId: gameId};
		  const game = Lobbies.findOne(criteria);
		  if (typeof(game) == 'undefined') {
			  return false;
		  }
		  const hasAlreadyJoined = !!_.findWhere(game.players, {userId: Meteor.userId()});

		  if (hasAlreadyJoined) { 
			throw new Meteor.Error('already-joined-game', `You (${Meteor.userId()}) have already joined game with id ${gameId} ${hasAlreadyJoined} ${player}`); 
		  }
		  
		  var player = {
			userId: Meteor.userId(),
			name: __guard__(Meteor.user(), x => x.username)
		  };
		  const action = {$addToSet: {players: player}};
		  
		  return Lobbies.update(criteria, action);
		}
		  
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
		return ((_.findWhere(doc.players, player)) != null) && (doc.hasFinished === false);
	  },
	  remove(userId, doc) { return false; }
  });
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
