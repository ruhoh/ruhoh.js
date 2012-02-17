define([
  'jquery',
  'underscore',
  'backbone',
  'utils/log',
  'handlebars'
], function($, _, Backbone, Log, Handlebars){

  return {

    // Public: Load all partials for Handlebars.
    // Handlebars caches templates by default so we explicitly
    // fetch uncached versions upon every preview generation.
    // TODO: Load user partials.
    // 
    // Returns $.Deferred object which resolves after all partials are loaded.
    generate : function(){
      var dfds;
      
      // Framework partials only.
      // The user should not alter these partials, 
      // instead just create their own.
      var partials = [
        ['pages_list','pages_list'],
        ['tags_list','tags_list'],
        ['posts_collate','posts_collate'],

        ['analytics-providers/google','analytics.google'],
        ['analytics-providers/getclicky','analytics.getclicky'],

        ['comments-providers/disqus','comments.disqus'],
        ['comments-providers/intensedebate','comments.intensedebate'],
        ['comments-providers/livefyre','comments.livefyre'],
        ['comments-providers/facebook','comments.facebook']
      ];
      
      dfds = _.map(partials, function(partial){
        return $.get( this.config.getPath('/_framework/partials/'+partial[0]) )
          .done(function(data){
            Handlebars.registerPartial(partial[1], data);
          })
      }, this);

      return $.when.apply(this, dfds);
    }
  }
  
});