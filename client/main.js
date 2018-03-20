// import React from 'react';
import { Meteor } from 'meteor/meteor';
// import { render } from 'react-dom';
import { Session } from 'meteor/session';
// import App from '../imports/ui/App.jsx';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/games/Hangman/Hangman.js';
import '../imports/startup/accounts-config.js';
//import '../imports/ui/body.js';

Meteor.startup(() => {
	Session.set("currentView", "homepage");
	Session.set("whatGame", "none");
	Session.set("userName", "test user name");
	Session.set("docTitle", "Phone Games");
	Session.set("mainDivClass", "center-center-container");
    //render(<App />, document.getElementById('render-target'));
	Meteor.subscribe('allUsers');
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

Template.header.helpers({
	
	userName: function() {
		return Session.get("userName");
	},

});

Template.userPage.helpers({
	userName: function() {
		return Session.get("userName");
	}
});

Template.gameSelect.events({

	'click .btn-game-1': function() {
		Session.set("whatGame", "Hangman");
		Session.set("currentView", "gameHangmanUI");
		Session.set("docTitle", "Hangman");
	},
	
	'click .btn-game-2': function() {
		Session.set("whatGame", "game2");
		if (!Meteor.userId()) {
			Session.set("currentView", "newGame");
		} else {
			Session.set("currentView", "lobby");
		}
	},
	
	'click .btn-game-3': function() {
		Session.set("whatGame", "game3");
		if (!Meteor.userId()) {
			Session.set("currentView", "newGame");
		} else {
			Session.set("currentView", "lobby");
		}
	},
	
	'click .btn-game-4': function() {
		Session.set("whatGame", "game4");
		if (!Meteor.userId()) {
			Session.set("currentView", "newGame");
		} else {
			Session.set("currentView", "lobby");
		}
	},
	
	'click .btn-game-5': function() {
		Session.set("whatGame", "game5");
		if (!Meteor.userId()) {
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
	'click .btn-new-game': function() {
		Session.set("currentView", "lobby");
	},
	
	'click .btn-back': function() {
		Session.set("whatGame", "none");
		Session.set("currentView", "gameSelect");
	}
});

Template.joinGame.events({
	
	'click .btn-join-game': function() {
		Session.set("currentView", "forTesting");
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



