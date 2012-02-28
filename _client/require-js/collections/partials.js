define([
  'jquery',
  'underscore',
  'backbone',
  'utils/log',
  'handlebars',
  'models/partial'
], function($, _, Backbone, Log, Handlebars, Partial){
  
  // Partial Colletion
  return Backbone.Collection.extend({
    model : Partial,
    
    // Framework partials only.
    // The user should not alter these partials, 
    // instead just create their own.
    // [path, name]
    FrameworkPartials : [
      ['pages_list','pages_list'],
      ['posts_list','posts_list'],
      ['tags_list','tags_list'],
      ['categories_list','categories_list'],
      ['posts_collate','posts_collate'],

      ['analytics-providers/google','analytics.google'],
      ['analytics-providers/getclicky','analytics.getclicky'],

      ['comments-providers/disqus','comments.disqus'],
      ['comments-providers/intensedebate','comments.intensedebate'],
      ['comments-providers/livefyre','comments.livefyre'],
      ['comments-providers/facebook','comments.facebook']
    ],
    
    initialize : function(attrs){
      _.each(this.FrameworkPartials, function(partial){
        this.add({id: partial[1], path: partial[0]})
      }, this)
    },
    
    // Generate each partial in this collection.
    // 
    // Returns: $.Deferred resolved only after all partials are loaded.
    generate : function(){
      var dfds = this.map(function(partial){
        partial.config = this.config;
        return partial.generate();
      }, this)

      return $.when.apply(this, dfds);
    },
    
    toHash : function(){
      var hash = {}
      _.each(this.toJSON(), function(p){
        hash[p.id] = p.content;
      })
      return hash;
    }
    
  });

});