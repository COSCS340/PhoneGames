import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish('allUsers', function() {
   return Meteor.users.find({}, {fields:{username:1}})
  });
  
  Meteor.methods({
	  removeUser: function(userId) {
		Meteor.users.remove(userId);
	  }
  });
  
});
