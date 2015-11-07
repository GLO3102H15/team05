define(['jquery', 'underscore', 'backbone'], function($, _,  Backbone) {

    Token = Backbone.Model.extend({
        urlRoot: 'https://umovie.herokuapp.com/tokenInfo',
        defaults: {
            email: '',
            token: '',
            name: '',
            id: ''
        }
    });

    function Authentication() {
        this.GetTokenId = function () {
            return localStorage.getItem("token");
        }

        this.GetUserAndTokenInfoWithCallback = function (callback) {
            var token = new Token();
            if (typeof(callback) == "function")
                return token.fetch({
                    success: function () {
                        callback(token)
                    }
                });
            else
                return token.fetch();
        }

        this.IsLoggedIn = function () {
            return this.GetTokenId() != null;
        }

        this.Login = function (token) {
            localStorage.setItem("token", token);
            return this;
        }

        this.Logout = function () {
            localStorage.removeItem("token")
            return this;
        }

        this.SetHeaders = function () {
            if (this.IsLoggedIn())
                $.ajaxSetup({
                    headers: {'Authorization': this.GetTokenId()}
                });
            return this;
        }
    }

    return new Authentication()
        .Login("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NjJmZjdhYzJiYmRmNTAzMDA2OGViOTMiLCJleHAiOjE0NDY5NDc0MDc5Mjl9.LKKOLqt4t8KY-Tf7VatecjsKbjt69iUzNTn7a8xMGSI").SetHeaders();
});