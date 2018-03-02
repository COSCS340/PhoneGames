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
	'click #btn-new-game': function () {
		console.log("worked2");
		Session.set("currentView", "newGame");
	},
	'click #btn-join-game': function () {
		console.log("worked3");
		Session.set("currentView", "joinGame");
	}
});

Template.main.helpers({
	currentView: function(){
		return Session.get("currentView");
	}
});