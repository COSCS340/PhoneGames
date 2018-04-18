import "./SpyfallUI.html";

Template.Spyfall.onCreated(function() {
  this.role = new ReactiveVar("You have not yet been assigned a role");
  this.userId = Meteor.userId();
  this.gameID = new ReactiveVar(-1);
  this.currentBoard = new ReactiveVar("---------");
  this.ready = new ReactiveVar(0);

    this.observe = SpyfallGames.find({'players.userId': Meteor.userId()}).observeChanges({
      added: function (id, message) {
        console.log("added: " + id);
      },

      changed: function(id, fields) {
        console.log("changed: " + id);
        var game = SpyfallGames.findOne(id);
      }
    });

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
  currentBoard: function() {
    return Template.instance().currentBoard.get();
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
    var gameID = instance.gameID.get();
    var userId = instance.userId;
    if (gameID && userId && event.currentTarget.id) {
      return Meteor.call("makeMove", gameID, userId, event.currentTarget.id);
    } else {
      console.log(gameID);
      console.log(userId);
    }
  }
});
