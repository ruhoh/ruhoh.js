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
      console.log('querying');
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
        if(stack.page.id === page.id) page['isActivePage'] = true;
        return page
      })
    }
    
  }
  
})
