import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Session } from 'meteor/session';
import App from '../imports/ui/App.jsx';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Meteor.startup(() => {
	Session.set("currentView", "homepage");
	Session.set("whatGame", "none");
	Session.set("userName", "test user name");
    //render(<App />, document.getElementById('render-target'));
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
	
	isLoggedIn: function() {
		return true;
	}
});

Template.userPage.helpers({
	userName: function() {
		return Session.get("userName");
	}
});

Template.gameSelect.events({

	'click .btn-game-1': function() {
		Session.set("whatGame", "game1");
		Session.set("currentView", "newGame");
	},
	
	'click .btn-game-2': function() {
		Session.set("whatGame", "game2");
		Session.set("currentView", "newGame");
	},
	
	'click .btn-game-3': function() {
		Session.set("whatGame", "game3");
		Session.set("currentView", "newGame");
	},
	
	'click .btn-game-4': function() {
		Session.set("whatGame", "game4");
		Session.set("currentView", "newGame");
	},
	
	'click .btn-game-5': function() {
		Session.set("whatGame", "game5");
		Session.set("currentView", "newGame");
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
		Session.set("currentView", "forTesting");
	},
	
	'click .btn-back': function() {
		Session.set("whatGame", "none");
		Session.set("currentView", "gameSelect");
	}
});

Template.joinGame.events({
	
	isLoggedIn: function() {
		//for login functionality later on
		return false;
	},
	
	'click .btn-join-game': function() {
		Session.set("currentView", "forTesting");
	},
	
	'click .btn-back': function() {
		Session.set("currentView", "homepage");
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
	}
});