define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
  
  // Site Model
	return Backbone.Model.extend({
		
		initialize : function(attrs){
		  this.deferred = this.fetch({ cache : false });
		},

    url : function(){
      return this.getPath('/data/site.json');
    }
		
	});

});