import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Session } from 'meteor/session';
import App from '../imports/ui/App.jsx';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';



Meteor.startup(() => {
	Session.set("currentView", "homepage");
    //render(<App />, document.getElementById('render-target'));
});

Template.homepage.events({
	'click .btn-new-game': function () {
		Session.set("currentView", "newGame");
	},
	'click .btn-join-game': function () {
		Session.set("currentView", "joinGame");
	}
});

Template.newGame.events({
	isLoggedIn: function() {
		//for login functionality later on
		return false;
	},
	
	/* TODO */
	'click .btn-new-game': function() {
		Session.set("currentView", "forTesting");
	},
	
	'click .btn-back': function() {
		Session.set("currentView", "homepage");
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