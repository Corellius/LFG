Comments = new Mongo.Collection("comments");

Router.route('/myGroupsPage', function () {
  this.render('myGroupsPage');
});

if (Meteor.isClient) {
  Meteor.subscribe("comments");

  Template.myGroupsPage.helpers({
	myGroups: function () {
		return Groups.find({memberIds: Meteor.userId()}, {sort: {createdAt: -1}});
	},
	isPublicEmail: function () {
		return this.publicEmail;
	}
  });
  
  Template.myGroupsPage.events({
  "submit .new-group": function (event) {
    // This function is called when the new task form is submitted

    var text = event.target.text.value;

    Meteor.call("addGroup", text);

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit
    return false;
    },
	"change .hide-completed input": function (event) {
		Session.set("hideCompleted", event.target.checked);
	}
  });
  
  Template.myGroup.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteGroup", this._id);
    },
	"click .toggle-private": function () {
		Meteor.call("setPrivate", this._id, ! this.private);
	},
	"submit .new-member": function (event) {
		var member = event.target.member.value;
		Meteor.call("addMember", member, this._id);
		event.target.member.value ="";
		return false;
	},
	"submit .remove-member": function (event) {
		var removemember = event.target.removemember.value;
		var isOwner = Players.findOne({owner: Meteor.userId()});
		if (removemember.localeCompare(isOwner.username) != 0) {
			Meteor.call("removeMember", removemember, this._id);
			event.target.removemember.value ="";
			return false;
		}
	},
	"submit .promote-member": function (event) {
		var promotemember = event.target.promotemember.value;
		var isOwner = Players.findOne({owner: Meteor.userId()});
		if (promotemember.localeCompare(isOwner.username) != 0) {
			Meteor.call("promoteMember", promotemember, this._id);
			event.target.promotemember.value ="";
			return false;
		}
	},
	"submit .leave-party": function (event) {
		if (event.target.leave.checked) {
			Meteor.call("removeSelf", this._id);
			return false;
		}
	},
	"submit .update-meetings": function (event) {
		var days =[];
		var daysCheck =[false, false, false, false, false, false, false];
		
		// Checks to see what days have been checked, and adds those that pass to the array
		if (event.target.monday.checked) {
			days.push(event.target.monday.value);
			daysCheck[0]=true;
		}
		if (event.target.tuesday.checked) {
			days.push(event.target.tuesday.value);
			daysCheck[1]=true;
		}
		if (event.target.wednesday.checked) {
			days.push(event.target.wednesday.value);
			daysCheck[2]=true;
		}
		if (event.target.thursday.checked) {
			days.push(event.target.thursday.value);
			daysCheck[3]=true;
		}
		if (event.target.friday.checked) {
			days.push(event.target.friday.value);
			daysCheck[4]=true;
		}
		if (event.target.saturday.checked) {
			days.push(event.target.saturday.value);
			daysCheck[5]=true;
		}
		if (event.target.sunday.checked) {
			days.push(event.target.sunday.value);
			daysCheck[6]=true;
		}
		Meteor.call("updateMeetings", days, daysCheck, this._id);
		
		return false;
	},
	"submit .update-rpgs": function (event) {
		var systems =[];
		var systemsCheck =[false, false, false, false, false, false, false, false, false];
		
		if (event.target.dnd.checked) {
			systems.push(event.target.dnd.value);
			systemsCheck[0]=true;
		}
		if (event.target.saga.checked) {
			systems.push(event.target.saga.value);
			systemsCheck[1]=true;
		}
		if (event.target.dnd4.checked) {
			systems.push(event.target.dnd4.value);
			systemsCheck[2]=true;
		}
		if (event.target.dnd5.checked) {
			systems.push(event.target.dnd5.value);
			systemsCheck[3]=true;
		}
		if (event.target.path.checked) {
			systems.push(event.target.path.value);
			systemsCheck[4]=true;
		}
		if (event.target.shadow.checked) {
			systems.push(event.target.shadow.value);
			systemsCheck[5]=true;
		}
		if (event.target.spirit.checked) {
			systems.push(event.target.spirit.value);
			systemsCheck[6]=true;
		}
		if (event.target.gurps.checked) {
			systems.push(event.target.gurps.value);
			systemsCheck[7]=true;
		}
		if (event.target.call.checked) {
			systems.push(event.target.call.value);
			systemsCheck[8]=true;
		}
		other = event.target.other.value;
		
		Meteor.call("updateRPGs", systems, systemsCheck, this._id, other);
		
	},
	"submit .post-comment": function (event) {
		// This function is called when the new task form is submitted

		var post = event.target.post.value;

		Meteor.call("postComment", post, this._id);

		// Clear form
		event.target.post.value = "";

		// Prevent default form submit
		return false;
	}
  });
  
  Template.myGroup.helpers({
	isLeader: function () {
		return this.leader === Meteor.userId();
	},
	isntLeader: function () {
		return this.leader !== Meteor.userId();
	},
	isMember: function () {
		//return this.members === Meteor.userId();
		//return Groups.find({members: {$elemMatch: Meteor.userId()}});
		if (this.members.indexOf(Meteor.userId() != -1)) {
			return true;
		}
		else {
			return false;
		}
	},
	comments: function () {
		return Comments.find({group: this._id}, {sort: {createdAt: -1}});
	},
	commentCount: function () {
		return Comments.find({group: this._id}).count();
	}
  });
  
  Template.comment.helpers({
	isLeaderOrPoster: function () {
		var group = Groups.findOne({_id: this.group});
		if (group.leader != Meteor.userId()) {
			return this.posterId === Meteor.userId();
		}
		else {
			return group.leader === Meteor.userId();
		}
	}
  });
  
  Template.comment.events({
    "click .delete": function () {
      Meteor.call("deletePost", this._id);
    }
  });
}

Meteor.methods({
  updateMeetings: function (days, daysCheck, groupId) {
    // Make sure the user is logged in before inserting a task
    /*if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }*/

    Groups.update(
      { _id: groupId},
	  {
		$set: {
		  availability: days,
		  daysCheck: daysCheck
		}
	  },
	  { upsert: true }
	);
  },
  updateRPGs: function (systems, systemsCheck, groupId, other) {
    // Make sure the user is logged in before inserting a task
    /*if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }*/

    Groups.update(
      { _id: groupId},
	  {
		$set: {
		  rpgs: systems,
		  rpgsCheck: systemsCheck,
		  others: other
		}
	  },
	  { upsert: true }
	);
  },
  removeMember: function (leave, groupId) {
	if (Players.findOne({username: leave})) {
		var player = Players.findOne({username: leave});
		Groups.update(groupId, { $pull: { members: leave} });
		Groups.update(groupId, { $pull: { memberIds: player.owner} });
	}
  },
  deletePost: function (commentId) {
	Comments.remove(commentId);
  },
  promoteMember: function (promote, groupId) {
	if (Players.findOne({username: promote})) {
		var player = Players.findOne({username: promote});
		Groups.update({_id: groupId}, {$set: {leader: player.owner, username: player.username}});
	}
  },
  removeSelf: function (groupId) {
	//if (Players.findOne({owner: Meteor.userId()})) {
	var player = Players.findOne({owner: Meteor.userId()});
	Groups.update(groupId, { $pull: { members: player.username} });
	Groups.update(groupId, { $pull: { memberIds: player.owner} });
  },
  postComment: function (comment, groupId) {
    // Make sure the user is logged in before sending a message
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Comments.insert({
      comment: comment,
	  group: groupId,
	  posterId: Meteor.userId(),
	  posterName: Meteor.user().services.google.name,
      createdAt: new Date(),
	  posterEmail: Meteor.user().services.google.email
    });
  }
  
});

if (Meteor.isServer) {
  Meteor.publish("comments", function () {
	return Comments.find({});
  });

}