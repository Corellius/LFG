Players = new Mongo.Collection("players");

Router.route('/playersPage', function () {
  this.render('playersPage');
});

Router.route('/searchPage', function () {
  this.render('searchPage');
});

if (Meteor.isClient) {
	Meteor.subscribe("players");
	
	Template.playersPage.helpers({
		players: function () {
			return Players.find({}, {sort: {username: 1}});
		}
		/*openCount: function () {
			return Players.find({checked: {$ne: true}}).count();
		}*/
	  });
	  
	Template.searchPage.helpers({
		searches: function () {
			//if (Session.get("search-player")) {
				return Meteor.call("searchPlayer", searchtext);
			//}
		}
	});
	
	//Obsolete now
	Template.playersPage.events({
		"submit .new-player": function (event) {
		// This function is called when the new task form is submitted

		var text2 = event.target.text2.value;
		var text3 = event.target.text3.value;
		var text4 = event.target.text4.value;
		var text5 = event.target.text5.value;

		Meteor.call("addPlayer", text2, text3, text4, text5);

		// Clear form
		event.target.text2.value = "";
		event.target.text3.value = "";
		event.target.text4.value = "";
		event.target.text5.value = "";

		// Prevent default form submit
		return false;
		}
	});
	
	Template.searchPage.events({
		"submit .search-player": function (event) {
		
		var searchtext = event.target.searchtext.value;
		
		//Meteor.call("searchPlayer", searchtext);
		
		event.target.searchtext.value = "";
		
		return false;
		}
	});
	
	Template.player.events({
		"click .delete": function () {
			Meteor.call("deletePlayer", this._id);
		},
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
	
	Template.player.helpers({
		isOwner: function () {
			return this.owner === Meteor.userId();
		},
		isntSelf: function () {
			return this.owner !== Meteor.userId();
		},
		isPublicEmail: function () {
			return this.publicEmail;
		}
	});
}

Meteor.methods({
  // Obsolete now
  addPlayer: function (text2, text3, text4, text5) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Players.insert({
      characterName: text2,
	  system: text3,
	  availability: text4,
	  type: text5,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().services.google.name,
	  email: Meteor.user().services.google.email
    });
  },
  deletePlayer: function (playerId) {
	var player = Players.findOne(playerId);
	if (player.owner !== Meteor.userId()) {
		// If the task is private, make sure only the owner can delete it
		throw new Meteor.Error("not-authorized");
	}
    else {
		Players.remove(playerId);
	}
  },
  searchPlayer: function (searchtext) {
	return Players.find({characterName: Artemis})
  }
});

if (Meteor.isServer) {
  Meteor.publish("players", function () {
	return Players.find({
		$or: [
			{ private: {$ne: true} },
			{ owner: this.userId }
		]
	});
  });
}