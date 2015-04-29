Notifications = new Mongo.Collection("notifications");

Router.route('/notificationsPage', function () {
  this.render('notificationsPage');
});

if (Meteor.isClient) {
  Meteor.subscribe("notifications");
  
  Template.notificationsPage.helpers({
	notifications: function () {
		return Notifications.find({recipient: Meteor.userId()}, {sort: {createdAt: -1}});
	}
  });
  
  
  
  
  
}


Meteor.methods({
  sendRequestNotification: function (recipient, groupId, groupName) {
    // Make sure the user is logged in before sending a message
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Notifications.insert({
      group: groupName,
	  groupId: groupId,
	  recipient: recipient,
	  senderId: Meteor.userId(),
	  senderName: Meteor.user().services.google.name,
      createdAt: new Date(),
	  senderEmail: Meteor.user().services.google.email
    });
  }
});
  

  
if (Meteor.isServer) {
  Meteor.publish("notifications", function () {
	return Notifications.find({});
  });

}