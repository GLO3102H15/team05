/**
 * Created by mohamed on 2015-11-30.
 */
define(['jquery', 'underscore', 'backbone', 'collections/watchLists' ,'libraries/Authentification', 'libraries/crypto'], function($, _,  Backbone, WatchListCollections, auth, crypto) {

    function hasFollowingList(following){
        for(i=0; i<following.length; i++){
            following[i].email= crypto.md5(following[i].email);
        }
    }

    UserView = Backbone.View.extend({

        template: _.template($('#user-template').html()),

        userId: null,
        userEmail: null,
        userName: null,
        hashEmail:null,
        followersList: null,
        followedId: null,

        events: {
            "click .follow-user": "addToFollowedUsersList",
            "click .unfollow-user": "deleteFromFollowedUsersList",
        },

        initialize: function () {
            var self = this;

            this.model.bind("sync", function () {
                self.render();
            });
        },

        render: function () {
            var self = this;

            this.userId = self.model.id;
            this.userEmail = self.model.get('email');
            this.userName = self.model.get('name');
            this.hashEmail = crypto.md5(this.userEmail);

            var watchLists = new WatchListCollection();
            watchLists.fetch().done(function(data){
                watchLists.filterByOwner({email: self.model.get('email'), name: self.model.get('name'), id: self.model.id});
                var data = self.model;
                hasFollowingList(self.model.get('following'));
                self.$el.html(self.template({user:self.model, watchLists:watchLists, hashEmail: self.hashEmail}));
                if(self.model.id == auth.getId()){
                    $(".follow-user").hide();
                    $(".unfollow-user").hide();
                }
            })
        },

        addToFollowedUsersList: function(){
            self = this;

            var request = $.ajax({
                type: "POST",
                url: "https://umovie.herokuapp.com/follow",
                data: {id: this.userId},
                dataType: "json"
            });
            request.done(function() {
                $('.alert-added-follower').show("slow");
                setTimeout(function () {
                    $(".alert-added-follower").hide("slow");
                }, 5000)
            });
            request.fail(function(){
                $('.alert-not-added-follower').show("slow");
                setTimeout(function () {
                    $(".alert-not-added-follower").hide("slow");
                }, 5000)
            });
        },

        deleteFromFollowedUsersList: function(){
            self = this;

            var request = $.ajax({
                type: "DELETE",
                url: "https://umovie.herokuapp.com/follow/"+this.userId,
                dataType: "json"
            });
            request.done(function() {
                $('.alert-unfollow').show("slow");
                setTimeout(function () {
                    $(".alert-unfollow").hide("slow");
                }, 5000)
            });
            request.fail(function(){
                $('.alert-unfollow-fail').show("slow");
                setTimeout(function () {
                    $(".alert-unfollow-fail").hide("slow");
                }, 5000)
            });
        },

        cleanup : function(){
            this.undelegateEvents();
            $(this.el).empty();
        }

    });

    return UserView;
});
