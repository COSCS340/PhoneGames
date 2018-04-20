import "./SpyfallUI.html";
import { Session } from 'meteor/session'

var endTime = 0;
var secLeft = 0;

Template.Spyfall.onCreated(function() {
  Session.set("docTitle", "Spyfall");
  this.role = new ReactiveVar("You have not yet been assigned a role");
  this.userId = Meteor.userId();
  this.gameID = new ReactiveVar(-1);
  this.ready = new ReactiveVar(0);
  //this.endTime = new ReactiveVar(0);
  this.timeLeft = new ReactiveVar(0);



  Meteor.setTimeout(function(){ //wait to make sure database is ready
    //var first = true;

      this.observe = SpyfallGames.find({'players.userId': Meteor.userId()}).observeChanges({
        added: function(id, fields) {
          console.log("added: " + id);
          /*if (first){
            first = false;
            var game = SpyfallGames.findOne(id);
            endTime = game.endTime;
            var t=setInterval(updateTimeLeft,500);
          }*/
        },
        changed: function(id, fields) {
          console.log("changed: " + id);
          var game = SpyfallGames.findOne(id);
        }
      });

      endTime = SpyfallGames.findOne({'players.userId': Meteor.userId()}).endTime;
      //var t=Meteor.setInterval(function(){updateTimeLeft(this.timeLeft)},1000);
      Meteor.setInterval(function() {
        Session.set('timeLeft', new Date().getTime());
        console.log(Session.get('timeLeft'));
      }, 1000);

  }, 500);



});

/*function updateTimeLeft() {
  //Session.set('timeLeft', (endTime - new Date().getTime())/1000);
  //console.log(Session.get('timeLeft'));
}*/

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
    return Template.instance().timeLeft.get();
  },
  //endTime: function() {
  //  return Template.instance().endTime.get();
  //},
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
