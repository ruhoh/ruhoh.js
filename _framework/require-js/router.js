define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){

  return Backbone.Router.extend({

    routes: {
      "" : "home",
      ":page": "page",
    },

    home : function(){
      console.log("homepage");
    },
    
    page : function(page){
      console.log("page router triggerd");
      console.log(page);
    }

  });

});