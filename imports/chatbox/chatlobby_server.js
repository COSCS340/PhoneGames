MessagesList = new Mongo.Collection("messages");

var autoScrollingIsActive = false;
unreadMessages = new ReactiveVar(false);
limitToLobbyChat = new ReactiveVar(false);
scrollToBottom = function scrollToBottom(duration) {
  var messageWindow = $(".message-window-container");
  var scrollHeight = messageWindow.prop("scrollHeight");
  messageWindow.stop().animate({ scrollTop: scrollHeight }, duration || 0);
};

Meteor.methods({
  sendMessage: function(messageText, chatSelection) {
    if (!Meteor.userId()) {
      return;
    }
    if (messageText == "") {
      return;
    }
    MessagesList.insert({
      createdBy: Meteor.user().username,
      timeSent: new Date(),
      chatScope: chatSelection,
      messageText: messageText
    });
  }
});

Meteor.publish("messages", function() {
  //return MessagesList.find({}, {sort: {timeSent: -1}, limit: 8});
  return MessagesList.find();
});
