
Router.route('/map2', function () {
  this.render('mapper');
});


if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.mapper.helpers({
    exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(38.3019, -77.4750),
          zoom: 15
        };
      }
    console.log(this)}
  });

  Template.mapper.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {
      // Add a marker to the map once it's ready
      var marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
        var marker2 = new google.maps.Marker({
                position: google.maps.LatLng(-25.363882,131.044922),
        map: map.instance
        });
    });
  });
}
