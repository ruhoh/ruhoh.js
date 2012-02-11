define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
  
  // Site Model
	return Backbone.Model.extend({

    url : function(){
      return '/~jade/data/site.json';
    },
		
		initialize : function(){
		  this.deferred = this.fetch({ cache : false });
		}

		
	});

});