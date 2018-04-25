// import { Accounts } from 'meteor/accounts-base';
import './chat.html'

MessagesList = new Mongo.Collection('messages');


var autoScrollingIsActive = false;
unreadMessages = new ReactiveVar(false);
scrollToBottom = function scrollToBottom (duration) {
    var messageWindow = $(".message-window-container");
    var scrollHeight = messageWindow.prop("scrollHeight");
    messageWindow.stop().animate({scrollTop: scrollHeight}, duration || 0);
};

Meteor.methods({

    'sendMessage': function(messageText){

	if(!Meteor.userId()) {return}
	if(messageText == "") {return}
	MessagesList.insert({

	    createdBy: Meteor.user().username,
	    timeSent: new Date(),
	    messageText: messageText
	});
    }
});

if(Meteor.isClient){

    Meteor.subscribe('messages', {
	onReady: function () {
	    scrollToBottom();
	    autoScrollingIsActive = false;
	}
    });

    Template.chatterBox.helpers({

	'recentMessages': function(){

	    return MessagesList.find({},{sort: {timeSent: 1}});
	},    

	unreadMessages: function () {
	    return unreadMessages.get();
	}
    });

    Template.chatterBox.events({

	'submit form' : function(event){

	    event.preventDefault();
	    var messageField = event.target.message.value;
	    Meteor.call('sendMessage', messageField);
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

}

if(Meteor.isServer){

    Meteor.publish('messages', function (){
	//return MessagesList.find({}, {sort: {timeSent: -1}, limit: 8});
	return MessagesList.find();
    });
}

