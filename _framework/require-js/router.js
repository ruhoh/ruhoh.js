define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){

  return Backbone.Router.extend({

    routes: {
      "" : "home",
      "index.html" : "home",
      "*page": "page"
    }

  });

});