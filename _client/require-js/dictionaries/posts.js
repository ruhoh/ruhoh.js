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

    // stupid javascript Dates.
    Months : [
      'January', 'February', 'March','April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December',
    ],
    
    initialize : function(attrs){
      
    },
    
    generate : function(){
      return this.fetch({dataType : "html", cache : false });
    },
    
    url : function(){
      return this.config.getDataPath('/_database/posts_dictionary.yml');
    },

    parse : function(response){
      var data = jsyaml.load(response) || {};
      // Need to append the posts id to urls for client-side rendering.
      // i.e. We need to tell javascript where the file is.
      for(id in data['dictionary']){
        data['dictionary'][id]['url'] += ('?path='+ this.config.fileJoin(this.config.get('postsDirectory'), id))
      }
      
      this.set(data);
      return this.attributes;
    },
    
    // TODO: Need to optimize the post sorting for when post quantity gets unwieldy.
    // Sets a sorted Array containing Objects.
    buildChronology : function(){
      // Order by date descending
      this.set('chronoHash',
        _.sortBy(this.get('dictionary'), function(post){
          return new Date(post.date);
        }).reverse()
      )
      
      // Standardize this as a simple Array since pages operate in this way.
      // Sets a sorted Array containing Objects.
      this.set('chronological',
        _.map(this.get('chronoHash'), function(post){
          return post.id;
        })
      )
    },
    
    // Create a collated posts data structure.
    // [{ 'year': year, 
    //   'months' : [{ 'month' : month, 
    //      'posts': [{}, {}, ..] }, ..] }, ..]
    //
    collate : function(){
      var collated = [];
      _.each(this.get('chronoHash'), function(post, i, posts){
        var thisDate = new Date(post.date);
        var thisYear = thisDate.getFullYear().toString();
        var thisMonth = this.Months[thisDate.getMonth()];
        
        var prevDate, prevMonth, prevYear;
        if(posts[i-1]){
          prevDate = new Date(posts[i-1].date);
          prevYear = prevDate.getFullYear().toString();
          prevMonth = this.Months[prevDate.getMonth()];
        }

        if(prevYear && prevYear === thisYear) 
          if(prevMonth && prevMonth === thisMonth)
            collated[collated.length-1]
              .months[collated.months.length-1]
              .posts.push(post) // append to last year & month
          else
            collated[collated.length-1]
              .months.push({
                'month' : thisMonth,
                'posts' : new Array(post)
              }) // create new month
        else
          collated.push({ 
            'year' : thisYear,
            'months' : [{ 
              'month' : thisMonth,
              'posts' : new Array(post)
            }]
          }) // create new year & month

      }, this)

      this.set('collated', collated);
    },
    
    // Create the TagsDictionary
    parseTags : function(){
      var tags = {}
      
      _.each(this.get('dictionary'), function(post){
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