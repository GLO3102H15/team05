define(['underscore', 'backbone'], function(_, Backbone) {

    var ActorLight = Backbone.Model.extend({
        urlRoot: 'https://umovie.herokuapp.com/actors/',
        defaults: {
            artworkUrl: '',
            movies: []
        },
        idAttribute: "artistId",
        parse: function (response) {
            if (response.hasOwnProperty("results"))
                response = response.results[0];
            return response;
        }
    });


    return ActorLight;
});
