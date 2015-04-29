Messages = new Mongo.Collection("messages");

Router.route('/suggestionsPage', function () {
  this.render('suggestionsPage');
});

if (Meteor.isClient) {
	Meteor.subscribe("messages");
	
	Template.suggestionsPage.helpers({
		highCompats: function () {
			var player = Players.findOne({owner: Meteor.userId()});
			var days = player.availability;
			var systems = player.rpgs;
			return Players.find({ $and: [{ $or: [{availability: days[0]}, 
			{availability: days[1]}, 
			{availability: days[2]},
			{availability: days[3]},
			{availability: days[4]},
			{availability: days[5]},
			{availability: days[6]}
			]},
			{ $or: [{rpgs: systems[0]},
			{rpgs: systems[1]},
			{rpgs: systems[2]},
			{rpgs: systems[3]},
			{rpgs: systems[4]},
			{rpgs: systems[5]},
			{rpgs: systems[6]},
			{rpgs: systems[7]},
			{rpgs: systems[8]}
			]}
			//{ $not: [{owner: player.owner}]}
			]}
			);	
		},
		modCompats: function () {
			var player = Players.findOne({owner: Meteor.userId()});
			var days = player.availability;
			var systems = player.rpgs;
			return Players.find({ $and: [{ $or: [{availability: days[0]}, 
			{availability: days[1]}, 
			{availability: days[2]},
			{availability: days[3]},
			{availability: days[4]},
			{availability: days[5]},
			{availability: days[6]}
			]},
			{ $nor: [{rpgs: systems[0]},
			{rpgs: systems[1]},
			{rpgs: systems[2]},
			{rpgs: systems[3]},
			{rpgs: systems[4]},
			{rpgs: systems[5]},
			{rpgs: systems[6]},
			{rpgs: systems[7]},
			{rpgs: systems[8]}
			]}
			//{ $not: [{owner: player.owner}]}
			]}
			);	
		},
		lowCompats: function () {
			var player = Players.findOne({owner: Meteor.userId()});
			var days = player.availability;
			var systems = player.rpgs;
			return Players.find({ $and: [{ $nor: [{availability: days[0]}, 
			{availability: days[1]}, 
			{availability: days[2]},
			{availability: days[3]},
			{availability: days[4]},
			{availability: days[5]},
			{availability: days[6]}
			]},
			{ $or: [{rpgs: systems[0]},
			{rpgs: systems[1]},
			{rpgs: systems[2]},
			{rpgs: systems[3]},
			{rpgs: systems[4]},
			{rpgs: systems[5]},
			{rpgs: systems[6]},
			{rpgs: systems[7]},
			{rpgs: systems[8]}
			]}
			//{ $not: [{owner: player.owner}]}
			]}
			);	
		},
		groupCompats: function () {
			var player = Players.findOne({owner: Meteor.userId()});
			var days = player.availability;
			var systems = player.rpgs;
			return Groups.find({ $and: [{ $or: [{availability: days[0]}, 
			{availability: days[1]}, 
			{availability: days[2]},
			{availability: days[3]},
			{availability: days[4]},
			{availability: days[5]},
			{availability: days[6]}
			]},
			{ $or: [{rpgs: systems[0]},
			{rpgs: systems[1]},
			{rpgs: systems[2]},
			{rpgs: systems[3]},
			{rpgs: systems[4]},
			{rpgs: systems[5]},
			{rpgs: systems[6]},
			{rpgs: systems[7]},
			{rpgs: systems[8]}
			]}
			//{ $not: [{owner: player.owner}]}
			]}
			);	
		},
		groupModCompats: function () {
			var player = Players.findOne({owner: Meteor.userId()});
			var days = player.availability;
			var systems = player.rpgs;
			return Groups.find({ $and: [{ $or: [{availability: days[0]}, 
			{availability: days[1]}, 
			{availability: days[2]},
			{availability: days[3]},
			{availability: days[4]},
			{availability: days[5]},
			{availability: days[6]}
			]},
			{ $nor: [{rpgs: systems[0]},
			{rpgs: systems[1]},
			{rpgs: systems[2]},
			{rpgs: systems[3]},
			{rpgs: systems[4]},
			{rpgs: systems[5]},
			{rpgs: systems[6]},
			{rpgs: systems[7]},
			{rpgs: systems[8]}
			]}
			//{ $not: [{owner: player.owner}]}
			]}
			);	
		},
		
		groupLowCompats: function () {
			var player = Players.findOne({owner: Meteor.userId()});
			var days = player.availability;
			var systems = player.rpgs;
			return Groups.find({ $and: [{ $nor: [{availability: days[0]}, 
			{availability: days[1]}, 
			{availability: days[2]},
			{availability: days[3]},
			{availability: days[4]},
			{availability: days[5]},
			{availability: days[6]}
			]},
			{ $or: [{rpgs: systems[0]},
			{rpgs: systems[1]},
			{rpgs: systems[2]},
			{rpgs: systems[3]},
			{rpgs: systems[4]},
			{rpgs: systems[5]},
			{rpgs: systems[6]},
			{rpgs: systems[7]},
			{rpgs: systems[8]}
			]}
			//{ $not: [{owner: player.owner}]}
			]}
			);	
		}
		
	
	});
	Template.highCompat.events({
		"submit .send-message": function (event) {
		// This function is called when the new task form is submitted

		var message = event.target.message.value;

		Meteor.call("sendMessage", message, this.owner);

		// Clear form
		event.target.message.value = "";

		// Prevent default form submit
		return false;
		}
	});
	Template.highCompat.helpers({
		isntSelf: function () {
			return this.owner !== Meteor.userId();
		}
	});
	Template.modCompat.events({
		"submit .send-message": function (event) {
		// This function is called when the new task form is submitted

		var message = event.target.message.value;

		Meteor.call("sendMessage", message, this.owner);

		// Clear form
		event.target.message.value = "";

		// Prevent default form submit
		return false;
		}
	});
	Template.modCompat.helpers({
		isntSelf: function () {
			return this.owner !== Meteor.userId();
		}
	});
	Template.lowCompat.events({
		"submit .send-message": function (event) {
		// This function is called when the new task form is submitted

		var message = event.target.message.value;

		Meteor.call("sendMessage", message, this.owner);

		// Clear form
		event.target.message.value = "";

		// Prevent default form submit
		return false;
		}
	});
	Template.lowCompat.helpers({
		isntSelf: function () {
			return this.owner !== Meteor.userId();
		}
	});
	
	Template.groupCompat.events({
		"submit .send-message-leader": function (event) {
		// This function is called when the new task form is submitted

		var message = event.target.messageleader.value;

		Meteor.call("sendMessage", message, this.leader);

		// Clear form
		event.target.message.value = "";

		// Prevent default form submit
		return false;
		}
	});
	
	Template.groupCompat.helpers({
		isntMember: function () {
			//return this.members === Meteor.userId();
			//return Groups.find({members: {$elemMatch: Meteor.userId()}});
			if (this.memberIds.indexOf(Meteor.userId()) != -1) {
				return false;
			}
			else {
				return true;
			}
		}
	});
	
	Template.groupModCompat.events({
		"submit .send-message-leader": function (event) {
		// This function is called when the new task form is submitted

		var message = event.target.messageleader.value;

		Meteor.call("sendMessage", message, this.leader);

		// Clear form
		event.target.message.value = "";

		// Prevent default form submit
		return false;
		}
	});
	
	Template.groupModCompat.helpers({
		isntMember: function () {
			//return this.members === Meteor.userId();
			//return Groups.find({members: {$elemMatch: Meteor.userId()}});
			if (this.memberIds.indexOf(Meteor.userId()) != -1) {
				return false;
			}
			else {
				return true;
			}
		}
	});
	
	Template.groupLowCompat.events({
		"submit .send-message-leader": function (event) {
		// This function is called when the new task form is submitted

		var message = event.target.messageleader.value;

		Meteor.call("sendMessage", message, this.leader);

		// Clear form
		event.target.message.value = "";

		// Prevent default form submit
		return false;
		}
	});
	
	Template.groupLowCompat.helpers({
		isntMember: function () {
			//return this.members === Meteor.userId();
			//return Groups.find({members: {$elemMatch: Meteor.userId()}});
			if (this.memberIds.indexOf(Meteor.userId()) != -1) {
				return false;
			}
			else {
				return true;
			}
		}
	});
	
}

Meteor.methods({
  sendMessage: function (message, recipient) {
    // Make sure the user is logged in before sending a message
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Messages.insert({
      message: message,
	  recipient: recipient,
	  senderId: Meteor.userId(),
	  senderName: Meteor.user().services.google.name,
      createdAt: new Date(),
	  senderEmail: Meteor.user().services.google.email
    });
  }
});




	