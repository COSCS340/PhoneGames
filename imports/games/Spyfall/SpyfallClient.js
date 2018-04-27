import "./SpyfallUI.html";
import { Session } from 'meteor/session'

Template.Spyfall.onCreated(function() {
  Session.set("docTitle", "Spyfall");
  this.role = new ReactiveVar("You have not yet been assigned a role");
  this.ready = new ReactiveVar(0);
  this.timeLeft = new ReactiveVar("clock not yet started");
  Session.set('endTime', SpyfallGames.findOne({'players.userId': Meteor.userId()}).endTime);

  this.timer = Meteor.setInterval(function() {
    var left = (Session.get('endTime') - new Date().getTime())/1000;
    if (left <= 0){
      Session.set('timeLeft', "Time's up, make your choice!");
      return;
    }
    else{
      var min = Math.floor(left / 60);
      var sec = Math.floor(left % 60);
      if (sec < 10)
        sec = "0" + sec;
      Session.set('timeLeft', min + ":" + sec);
    }
  }, 1000);

  Meteor.call("getLocation", function(error, result){
    Session.set("location", "Your location: " + result);
  });

  Meteor.call("getRole", function(error, result){
    if (result == "Spy") {
      Session.set('role', "You are the Spy!");
    } else {
      Session.set('role', "Your role: " + result);
    }
  });
});

Template.Spyfall.helpers({
  role: function() {
    return Session.get("role");
  },
  timeLeft: function() {
    return Session.get("timeLeft");
  },
  endTime: function() {
    return Session.get("endTime");
  },
  ready: function() {
    return Template.instance().ready.get();
  },
  isSpy: function() {
    if (Session.get("role") == "You are the Spy!") {
      return true;
    }
    return false;
  },
  location: function() {
    return Session.get("location");
  }
});

Template.Spyfall.events({
  "click .btn-back": function(event, instance) {
    Session.set("currentView", "gameSelect");
    return instance.observe.stop();
  },

  "click .grid-item"(event, instance) {
    if (event.currentTarget.innerHTML[0] == '<')
      event.currentTarget.innerHTML = event.currentTarget.id;
    else
      event.currentTarget.innerHTML = event.currentTarget.id.strike();
  }
});

Template.Spyfall.onDestroyed(function() {
  clearInterval(this.timer);
  Meteor.call("removeSpyfallPlayer");
  Meteor.call("removePlayer");
});
