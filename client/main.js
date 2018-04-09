// import React from 'react';
import { Meteor } from 'meteor/meteor';
// import { render } from 'react-dom';
import { Session } from 'meteor/session';
// import App from '../imports/ui/App.jsx';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/games/Hangman/Hangman.js';
import '../imports/startup/accounts-config.js';
// Import chat functionality from chatter box
import '../imports/chatbox/chatlobby.js';
import '../imports/games/TTT/TTT.js';
//import '../imports/ui/body.js';
import '../lib/collection.js';

Meteor.startup(() => {
	Session.set("docTitle", "Phone Games");
	Session.set("currentView", "homepage");
	Session.set("whatGame", "none");
	Session.set("mainDivClass", "center-center-container");
    //render(<App />, document.getElementById('render-target'));
	Meteor.subscribe('allUsers');
	Meteor.subscribe('lobbies');
//	Tracker.autorun(function() {
		if (!Meteor.user()) {
			AccountsAnonymous.login();
		}
//	});
});

Deps.autorun(function(){
	document.title = Session.get("docTitle");
});

Template.homepage.events({
	
	'click .btn-new-game': function () {
		Session.set("currentView", "gameSelect");
	},
	
	'click .btn-join-game': function () {
		Session.set("currentView", "joinGame");
	}
});

Template.header.events({
	
	'click .btn-home': function() {
		Session.set("currentView", "homepage");
		Session.set("docTitle", "Phone Games");
	},
	
	'click .btn-login': function() {
		Session.set("currentView", "loginPage");
	},
	
	'click .btn-user-profile': function() {
		Session.set("currentView", "userPage");
	}
});

Template.gameSelect.events({

	'click .btn-game-1': function() {
		Session.set("currentView", "gameHangmanUI");
		Session.set("docTitle", "Hangman");
	},
	
	'click .btn-game-2': function() {
		Session.set("currentView", "gameTTTUI");
		Session.set("docTitle", "Tic-Tac-Toe");
	},
	
	'click .btn-game-3': function() {
		Session.set("whatGame", "game3");
		if (!Meteor.user().username) {
			Session.set("currentView", "newGame");
		} else {
			Meteor.call('createLobby', Session.get("whatGame"));
			Session.set("currentView", "lobby");
		}
	},
	
	'click .btn-game-4': function() {
		Session.set("whatGame", "game4");
		if (!Meteor.user().username) {
			Session.set("currentView", "newGame");
		} else {
			Session.set("currentView", "lobby");
		}
	},
	
	'click .btn-game-5': function() {
		Session.set("whatGame", "game5");
		if (!Meteor.user().username) {
			Session.set("currentView", "newGame");
		} else {
			Session.set("currentView", "lobby");
		}
	},
	
	'click .btn-back': function() {
		Session.set("currentView", "homepage");
	}
});

Template.newGame.helpers({
	whatGame: function() {
		return Session.get("whatGame");
	}
});

Template.newGame.events({

	/* TODO */
	'blur input[name = "username"]': function(event, template) {
		if (!event.target.value || event.target.value.length > 15) {
			document.getElementById('textbox-name').style.borderColor = '#e52213';
			if (event.target.value.length > 15) {
				document.getElementById('errName').innerHTML = "names must be less than 15 characters";
			} else {
				document.getElementById('errName').innerHTML = "names must be more than 0 characters";
			}
		} else {
			document.getElementById('textbox-name').style.borderColor = '#e3e3e3';
			document.getElementById('errName').innerHTML = "";
		}
	},
	
	'click .btn-new-game': function(event, template) {
		var name = document.getElementById('textbox-name').value;
		if (name.length > 0 && name.length < 15) {
			Meteor.call('changeUsername', name);
			Meteor.call('createLobby', Session.get("whatGame"))
			Session.set("currentView", "lobby");
		} else {
			if (name.length == 0) {
				document.getElementById('errName').innerHTML = "names must be more than 0 characters";
				document.getElementById('textbox-name').style.borderColor = '#e52213';
			}
		}
		
	},
	
	'click .btn-back': function() {
		Session.set("whatGame", "none");
		Session.set("currentView", "gameSelect");
	}
});

Template.joinGame.events({
	
	'blur input[name = "username"]': function(event, template) {
		var tVal = event.target.value;
		if (!tVal || tVal.length > 15) {
			document.getElementById('textbox-name').style.borderColor = '#e52213';
			if (tVal.length > 15) {
				document.getElementById('errName').innerHTML = "names must be less than 15 characters";
			} else {
				document.getElementById('errName').innerHTML = "names must be more than 0 characters";
			}
		} else {
			document.getElementById('textbox-name').style.borderColor = '#e3e3e3';
			document.getElementById('errName').innerHTML = "";
		}
	},
	
	/* change to event.target.length != # of chars lobby strings are later when lobbies are implemented */
	'blur input[name = "lobbyID"]': function(event, template) {
		var tVal = event.target.value;
		if (!tVal) {
			document.getElementById('textbox-lobby').style.borderColor = '#e52213';
			document.getElementById('errLobby').innerHTML = "lobby ids must be exactly x characters";
		} else {
			document.getElementById('textbox-lobby').style.borderColor = '#e3e3e3';
			document.getElementById('errLobby').innerHTML = "";
		}
	},
	
	'click .btn-join-game': function(event, template) {
		event.preventDefault();
		if (document.getElementById('textbox-name')) {
			name = document.getElementById('textbox-name').value;
		}
		var lobbyId = document.getElementById('textbox-lobby').value;
		if (name && name.length > 0 && name.length < 15) {
			Meteor.call('changeUsername', name);
//			Session.set("currentView", "lobby");
		} else if (name) {
			if (name.length == 0) {
				document.getElementById('errName').innerHTML = "names must be more than 0 characters";
				document.getElementById('textbox-name').style.borderColor = '#e52213';
			} else {
				document.getElementById('errName').innerHTML = "names must be less than 15 characters";
				document.getElementById('textbox-name').style.borderColor = '#e52213';
			}
		}
		if (Meteor.call('joinGame', lobbyId) > 0) {
			console.log("returning false");
			document.getElementById('errLobby').innerHTML = "this lobby code is not valid";
			document.getElementById('textbox-lobby').style.borderColor = '#e52213';
		} else {
			console.log("returning true");
			Session.set("currentView", "lobby");
		}
		
//		Session.set("currentView", "forTesting");
	},
	
	'click .btn-back': function() {
		Session.set("currentView", "homepage");
	}
});

Template.lobby.events({
	'click .btn-back': function() {
		Session.set("currentView", "gameSelect");
	}
});

Template.lobby.helpers({
	whatGame: function() {
		return Session.get("whatGame");
	},
	
	lobbyId: function() {
		var lobby = Lobbies.find({}).fetch();
		if (lobby && lobby[0] && lobby[0].lobbyId) {
			return lobby[0].lobbyId;
		}
	},
	
	users: function() {
		return Lobbies.find({}).fetch()[0].players;
	},
	
	names: function() {
		return this.name;
	}
});

/* this is used for testing so you can get back to the homepage after testing buttons or forms */
Template.forTesting.events({
	
	'click .btn-for-testing': function() {
		Session.set("currentView", "homepage");
	}
});

Template.main.helpers({
	currentView: function(){
		return Session.get("currentView");
	},
	
	mainDivClass: function() {
		return Session.get("mainDivClass");
	}
});

Template.footer.events({
	'click .btn-admin-info': function() {
		Session.set("currentView", "adminInfo");
	}
});

Template.adminInfo.helpers({
	user: function() {
		return Meteor.users.find();
	}
});

Template.adminInfo.events({
	'click .btn-remove-user': function() {
		Meteor.call('removeUser', this._id);
	}
});



