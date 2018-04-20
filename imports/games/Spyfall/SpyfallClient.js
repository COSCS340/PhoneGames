import "./SpyfallUI.html";
import { Session } from 'meteor/session'

Template.Spyfall.onCreated(function() {
  Session.set("docTitle", "Spyfall");
  this.role = new ReactiveVar("You have not yet been assigned a role");
  this.userId = Meteor.userId();
  this.gameID = new ReactiveVar(-1);
  this.ready = new ReactiveVar(0);
  this.timeLeft = new ReactiveVar("clock not yet started");

  Meteor.setTimeout(function(){ //wait to make sure database is ready

      this.observe = SpyfallGames.find({'players.userId': Meteor.userId()}).observeChanges({
        added: function(id, fields) {
          //console.log("added: " + id);
        },
        changed: function(id, fields) {
          //console.log("changed: " + id);
          //var game = SpyfallGames.findOne(id);
        }
      });

      Session.set('endTime', SpyfallGames.findOne({'players.userId': Meteor.userId()}).endTime);

      //Update time remaining on screen every second
      Meteor.setInterval(function() {
        var left = (Session.get('endTime') - new Date().getTime())/1000;
        var min = Math.floor(left/60);
        var sec = Math.floor(left%60);
        if (sec<10)
          sec = "0" + sec;
        Session.set('timeLeft', min + ":" + sec);
        console.log(Session.get('timeLeft'));
      }, 1000);

  }, 500);

});

Template.Spyfall.helpers({
  role: function() {
    return Template.instance().role.get();
  },
  ID: function() {
    return Template.instance().userId;
  },
  gameID: function() {
    return Template.instance().gameID.get();
  },
  timeLeft: function() {
    return Session.get("timeLeft");
  },
  endTime: function() {
    return Session.get("endTime");
  },
  ready: function() {
    return Template.instance().ready.get();
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
