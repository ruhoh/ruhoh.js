define([
  'jquery',
  'underscore',
  'backbone',
  'models/layout',
  'models/config',
  'utils/parse',
  'utils/log',
  'yaml',
], function($, _, Backbone, Layout, Config, Parse, Log){

  // Page Model 
  // Represents a post or page.
  return Backbone.Model.extend({

    initialize : function(attrs){

     this.bind('change:path', function(){
       this.set('id', this.get('path').replace(/^_posts\//, '') )
     },this)
    },
    
    // Public: Fetch a page/post and resolve all template dependencies.
    // Template promises are *piped* up to the parent page promise.
    // TODO: This probably can be implemented a lot better.
    // Returns: jQuery Deferred object. This ensures all despendencies
    //   are resolved before the generate promise is kept.
    generate : function(){
      var that = this;

      return this.fetch({dataType : "html", cache : false}).pipe(function(){
        if(!that.get("layout")) 
          Log.parseError(that.url(), "Page/Post requires a valid layout setting. (e.g. layout: post)")
        
        that.sub.set("id", that.get("layout"));
        return that.sub.generate().pipe(function(){
          if(that.sub.get("layout")){
            that.master.set("id", that.sub.get("layout"))
            return that.master.generate();
          }
        })
      }).fail(function(jqxhr){
        Log.loadError(this, jqxhr)
      })
    },
    
    url : function(){
      return this.config.getDataPath(this.get('path'));
    },

    // Parse the raw page/post file.
    parse : function(data){ 
      this.set(Parse.frontMatter(data, this.url()), { silent : true});
      this.set("content", Parse.content(data, this.id), { silent : true});
      return this.attributes;
    }

  });

});