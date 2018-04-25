import "./TTTUI.html";

Template.TTT.onCreated(function() {
  this.winner = new ReactiveVar("");
  this.userId = Meteor.userId();
  this.gameID = new ReactiveVar(-1);
  this.currentBoard = new ReactiveVar("---------");
  this.ready = new ReactiveVar(0);

  this.observe = TTT.find({
    $or: [
      {
        player1: Meteor.userId()
      },
      {
        player2: Meteor.userId()
      }
    ]
  }).observeChanges({
    changed: function(id, fields) {
      console.log("changed");
      var game = TTT.findOne({
        $or: [
          {
            player1: Meteor.userId()
          },
          {
            player2: Meteor.userId()
          }
        ]
      });

      //check if board has changed
      if (game.board != this.currentBoard) {
        console.log("board has changed");
        this.currentBoard = game.board;

        for (var i = 0; i <= 8; i++) {
          document.getElementById(i).innerText = game.board[i];
        }

        if (game.win > 0) {
          if (game.win == this.userId) this.winner = "You Win!";
          else this.winner = "You Lost";
        }
      }
    }
  });
});

Template.TTT.helpers({
  winner: function() {
    return Template.instance().winner.get();
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

Template.TTT.events({
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

Template.TTT.onDestroyed(function() {
  Meteor.call("removePlayer");
});
