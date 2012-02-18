define([
  'jquery',
  'underscore',
  'backbone',
  'utils/parse',
  'utils/log',
  'yaml',  
], function($, _, Backbone, Parse, Log){
  
  // Posts Dictionary is a hash representation of all posts in the app.
  // This is used as the primary posts database for the application.
  // A post is referenced by its unique url attribute.
  // When working with posts you only need to reference its url identifier.
  // Valid id nodes are expanded to the full post object via the dictionary.
  return Backbone.Model.extend({

    initialize : function(attrs){

    },
    
    generate : function(){
      return this.fetch({dataType : "html", cache : false });
    },
    
    url : function(){
      return this.config.getDataPath('/data/posts.yml');
    },

    // TODO: 
    // Need to optimize the post sorting for when post quantity gets unwieldy.
    parse : function(response){
      var posts = jsyaml.load(response);
      this.set(posts);
      
      // Order by date descending
      this.chronological = _.sortBy(posts, function(post){
        return new Date(post.date);
      }).reverse();
      
      // Standardize this as a simple Array since pages operate in this way.
      this.chronological = _.map(this.chronological, function(post){
        return post.url;
      })
      
      this.parseTags();

      return this.attributes;
    },
    
    
    // Create the TagsDictionary
    parseTags : function(){
      var tags = {}
      
      _.each(this.attributes, function(post){
        _.each(post.tags, function(tag){
          if( tags.hasOwnProperty(tag) )
            tags[tag].count += 1;
          else
            tags[tag] = { count : 1, name : tag, posts : [] }
            
          tags[tag].posts.push(post.url)  
        })
      })

      this.tagsDictionary = tags;
    }

  });

});