MessagesList = new Mongo.Collection('messages');

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

//if(Meteor.isServer){

    Meteor.publish('messages', function (){
	//return MessagesList.find({}, {sort: {timeSent: -1}, limit: 8});
	return MessagesList.find();
    });
//}
