
Router.route('/myAccount', function () {
  this.render('accountPage');
});

if (Meteor.isClient) {
	
	Template.accountPage.helpers({
		users: function () {
			Meteor.call("initUser");
			return Players.find({owner: Meteor.userId()});
		}
	
	/*openCount: function () {
		return Players.find({checked: {$ne: true}}).count();
	}*/
	});
	
	Template.user.helpers({
		isPublicEmail: function () {
			return this.publicEmail;
		}
	});
	
	
	Template.accountPage.events({
		"submit .update-info": function (event) {
		// This function is called when a user updates their account
		var days =[];
		var systems =[];
		var publicEmail = false;
		var daysCheck =[false, false, false, false, false, false, false];
		var systemsCheck=[false, false, false, false, false, false, false, false, false]
		var nickname = event.target.nickname.value;
		var other = event.target.other.value;
		
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
		
		if (event.target.chooseemail.checked) {
			publicEmail = true;
		}
		
		var type = event.target.type.value;

		Meteor.call("updateUser", nickname, systems, other, days, type, systemsCheck, daysCheck, publicEmail);

		
		// Clear form
		/*event.target.nickname.value = "";
		event.target.system.value = "";
		event.target.availability.value = "";
		event.target.type.value = "";*/

		// Prevent default form submit
		return false;
		}
	});
	
}

Meteor.methods({
  updateUser: function (nickname, systems, other, days, type, systemsCheck, daysCheck, publicEmail) {
    // Make sure the user is logged in before inserting a task
    /*if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }*/

    Players.update(
      { owner: Meteor.userId()},
	  {
		$set: {
		  characterName: nickname,
		  system: other,
		  availability: days,
		  type: type,
		  createdAt: new Date(),
		  owner: Meteor.userId(),
		  username: Meteor.user().services.google.name,
		  email: Meteor.user().services.google.email,
		  rpgs: systems,
		  rpgsCheck: systemsCheck,
		  daysCheck: daysCheck,
		  publicEmail: publicEmail
		}
	  },
	  { upsert: true }
	);
	},
	initUser: function () {
    // Make sure the user is logged in before inserting a task
    /*if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }*/

    Players.update(
      { owner: Meteor.userId()},
	  {
		$set: {
		  createdAt: new Date(),
		  owner: Meteor.userId(),
		  username: Meteor.user().services.google.name,
		  email: Meteor.user().services.google.email
		}
	  },
	  { upsert: true }
	);
  }
});


