import './chat.html'
import '../../client/main.js'
import '../../lib/collection.js'

MessagesList = new Mongo.Collection('messages');

var autoScrollingIsActive = false;
unreadMessages = new ReactiveVar(false);
limitToLobbyChat = new ReactiveVar(false);
scrollToBottom = function scrollToBottom (duration) {
    var messageWindow = $(".message-window-container");
    var scrollHeight = messageWindow.prop("scrollHeight");
    messageWindow.stop().animate({scrollTop: scrollHeight}, duration || 0);
};

//if(Meteor.isClient){

    Meteor.subscribe('messages', {
	onReady: function () {
	    scrollToBottom();
	    autoScrollingIsActive = false;
	}
    });

    Template.chatterBox.helpers({

	'recentMessages': function(){
	    if(limitToLobbyChat.get() == false){
		return MessagesList.find({chatScope: "global"},{sort: {timeSent: 1}});
	    }else{
		//return MessagesList.find()
		var lobbyName = Lobbies.findOne({"players.userId":Meteor.userId()}).lobbyId;
		//if(!lobbyName) return;
		return MessagesList.find({
		    chatScope: Lobbies.findOne({"players.userId":Meteor.userId()}).lobbyId
		},{ 
		    sort: {timeSent: 1}});
	    }
	},

	unreadMessages: function () {
	    
	    return unreadMessages.get();
	},
	limitToLobbyChat: function (){
	    
	    return limitToLobbyChat.get();
	}
    });

    Template.chatterBox.events({

	'submit form' : function(event){

	    event.preventDefault();
	    var messageField = event.target.message.value;
	    if(limitToLobbyChat.get() == false){
		Meteor.call('sendMessage', messageField, "global");
	    }else{
		//test
		var lobbyName = Lobbies.findOne({"players.userId":Meteor.userId()}).lobbyId;
		//if(!lobbyName) return;
		Meteor.call('sendMessage', messageField, lobbyName);
		console.log(lobbyName);
	    }
	    event.target.message.value = "";
	    scrollToBottom(500);
	},
	'scroll .message-window-container': function () {
	    var howClose = 80;  // # pixels leeway to be considered "at Bottom"
	    var mWindowContainer = $(".message-window-container");
	    var scrollHeight = mWindowContainer.prop("scrollHeight");
	    var scrollBottom = mWindowContainer.prop("scrollTop") + mWindowContainer.height();
	    var atBottom = scrollBottom > (scrollHeight - howClose);
	    autoScrollingIsActive = atBottom ? true : false;
	    if(atBottom){
		unreadMessages.set(false);
	    }
	},
	'click .more-messages': function(){

	    scrollToBottom(250);
	    unreadMessages.set(false);
	},
	'click .no-more-messages': function(){

	    scrollToBottom(250);
	    unreadMessages.set(false);
	},
	'click .global-chat': function (){
	
	    limitToLobbyChat.set(false);
	},
	'click .lobby-chat': function (){
	
	    limitToLobbyChat.set(true);
	}
    });

    Template.message.onRendered(
	function() {
	    if(autoScrollingIsActive){
		scrollToBottom(250);
	    }else {
		if (Meteor.user() && this.data.username !== Meteor.user().username) {
		    unreadMessages.set(true);
		}
	    }
	}
    );

//}
