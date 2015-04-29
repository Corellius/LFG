
Router.route('/inboxPage', function () {
  this.render('inboxPage');
});

if (Meteor.isClient) {
	Meteor.subscribe("messages");
	
	Template.inboxPage.helpers({
		messages: function() {
			return Messages.find({recipient: Meteor.userId()}, {sort: {createdAt: -1}});
		},
		messageCount: function () {
			return Messages.find({recipient: Meteor.userId()}).count();
		}
	
	});
	
	Template.message.events({
		"click .delete": function () {
			Meteor.call("deleteMessage", this._id);
		},
		"submit .reply-message": function (event) {
			// This function is called when the new task form is submitted

			var reply = event.target.reply.value;

			Meteor.call("sendMessage", reply, this.senderId);

			// Clear form
			event.target.reply.value = "";

			// Prevent default form submit
			return false;
		}
	});
}
	
Meteor.methods({
  deleteMessage: function (messageId) {
	var message = Messages.findOne(messageId);
	Messages.remove(messageId);
  }	
});

if (Meteor.isServer) {
  Meteor.publish("messages", function () {
	return Messages.find();
  });
}