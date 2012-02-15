define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){

  return Backbone.Router.extend({

    routes: {
      "" : "home",
      "*page": "page"
    }

  });

});