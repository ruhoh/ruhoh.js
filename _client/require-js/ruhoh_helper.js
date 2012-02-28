define([
  'jquery',
  'underscore',
], function($, _){

  return {
    
    // parse the mustache expression's name
    parseName : function(name){
      return name.split(':')[1] || null;
    },
    
    // Query based on helper name 
    // Helpers must start with "?"
    // If we can't find anything it's important to return undefined.
    query : function(name, context, stack){
      console.log('querying: ' + name);
      var helper = name.split(':')[0].replace(/^\?/,'');
      
      if(helper && typeof this[helper] === 'function')
        return this[helper](context, stack)
    },
    
    pages_list : function(context, stack){
      var pages = [];
      if ( _.isArray(context) )
        _.each(context, function(id){
          if(stack.pages[id]) pages.push(stack.pages[id])
        })
      else pages = stack.pages;

      return _.map(pages, function(page){
        if(stack.page.id === page.id) 
          page.isActivePage = true;
        return page
      })
    },
    
    tags_list : function(context, stack){
      return _.isArray(context)
        ?  _.map(context, function(name){
             if(stack._posts.tags[name])
              return stack._posts.tags[name]
           })
        :  _.map(stack._posts.tags, function(tag){
             return tag
           })
    },
    
    posts_list : function(context, stack){
      return _.map(
          _.isArray(context) 
            ? context 
            : stack._posts.chronological,
          function(id) { 
            if(stack._posts.dictionary[id])
              return stack._posts.dictionary[id]
          }
        )
    },
    
    categories_list : function(context, stack){
      return _.isArray(context)
        ?  _.map(context, function(name){
             if(stack._posts.categories[name])
              return stack._posts.categories[name]
           })
        :  _.map(stack._posts.categories, function(cat){
             return cat
           })      
    },

    // Probably not going to use this since its simple enough to
    // call the data structure directly.
    posts_collate : function(context, stack){
      return stack._posts.collated;
    }
    
  }
  
})
