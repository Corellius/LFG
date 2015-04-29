Groups = new Mongo.Collection("groups");

Router.route('/groupsPage', function () {
  this.render('groupsPage');
});

Router.route('/', function () {
  this.render('home');
});

if (Meteor.isClient) {
  Meteor.subscribe("groups");
  
  // This code only runs on the client
  Template.body.helpers({
		messagesCount: function () {
			return Messages.find({recipient: Meteor.userId()}).count();
		}
	});
  
  
  Template.groupsPage.helpers({
	groups: function () {
		if (Session.get("hideCompleted")) {
		// If hide completed is checked, filter tasks
			return Groups.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
		} else {
			// Otherwise, return all of the tasks
			return Groups.find({}, {sort: {createdAt: -1}});
		}
	},
	hideCompleted: function () {
		return Session.get("hideCompleted");
	},
	openCount: function () {
		return Groups.find({checked: {$ne: true}}).count();
	}
  });

  
  Template.group.events({
  "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
	"click .request-membership": function () {
		Meteor.call("sendRequestNotification", this.leader, this._id, this.text);
	}
  });

  
  Template.group.helpers({
	isLeader: function () {
		return this.leader === Meteor.userId();
	},
	isntMember: function () {
		//return this.members === Meteor.userId();
		//return Groups.find({members: {$elemMatch: Meteor.userId()}});
		if (this.members.indexOf(Meteor.userId() != -1)) {
			return false;
		}
		else {
			return true;
		}
	}
  });

  Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addGroup: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Groups.insert({
      text: text,
      createdAt: new Date(),
      leader: Meteor.userId(),
	  members: [Meteor.user().services.google.name],
	  memberIds: [Meteor.userId()],
      //username: ((Meteor.user().services.google.given_name) + " " + (Meteor.user().services.google.family_name)),
	  username: Meteor.user().services.google.name,
	  email: Meteor.user().services.google.email
    });
  },
  addMember: function (member, groupId) {
	if (Players.findOne({username: member})) {
		var player = Players.findOne({username: member});
		Groups.update(groupId, { $push: { members: member} });
		Groups.update(groupId, { $push: { memberIds: player.owner} });
	}
  },
  deleteGroup: function (groupId) {
	var group = Groups.findOne(groupId);
	if (group.leader !== Meteor.userId()) {
		// If the task is private, make sure only the owner can delete it
		throw new Meteor.Error("not-authorized");
	}
    else {
		Groups.remove(groupId);
	}
  },

  /*setChecked: function (groupId, setChecked) {
    Groups.update(groupId, { $set: { checked: setChecked} });
  },*/
  setPrivate: function (groupId, setToPrivate) {
	var group = Groups.findOne(groupId);

	// Make sure only the task owner can make a task private
	if (group.leader !== Meteor.userId()) {
		throw new Meteor.Error("not-authorized");
	}

	Groups.update(groupId, { $set: { private: setToPrivate } });
  }
});

if (Meteor.isServer) {
  Meteor.publish("groups", function () {
	return Groups.find({
		$or: [
			{ private: {$ne: true} },
			{ memberIds: this.userId }
		]
	});
  });

}

