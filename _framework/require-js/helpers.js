define([
  'jquery',
  'underscore',
  'backbone',
  'utils/log',
  'handlebars',
], function($, _, Backbone, Log, Handlebars){

  // Internal: Register debug helper
  //  debug the passed in data-structure, log to console and output JSON.
  //
  // data - Required [Object] The object to debug.
  //
  // Examples
  //
  //   {{ debug [Object] }}
  //
  // Returns: [String] - JSON string of data.
  Handlebars.registerHelper('debug', function(data) {
    console.log("debug:");
    console.log(data);
    return JSON.stringify(data);
  });
  
  // Internal: Register analytics helper
  //  Output analytics code as defined by the configuration settings.
  //
  // Examples
  //
  //   {{{ analytics }}}
  //
  // Returns: [String] - The parsed analytics template.
  Handlebars.registerHelper('analytics', function() {
    var provider = this.site.JB.analytics.provider;
    if(!provider) throw new Error('Analytics provider must be specified at: "site.JB.analytics.provider"');
    
    return (this.site.production) 
      ? Handlebars.compile(Handlebars.partials['analytics.'+provider])(this)
      : '<p class="development-notice" style="background:lightblue">'+ provider +' Loaded!</p>';
  });  
  
  // Internal: Register comments helper
  //  Output comments code as defined by the configuration settings.
  //
  // Examples
  //
  //   {{{ comments }}}
  //
  // Returns: [String] - The parsed comments template.
  Handlebars.registerHelper('comments', function() {
    var provider = this.site.JB.comments.provider;
    if(!provider) throw new Error('Comment provider must be specified at: "site.JB.comments.provider"');

    return (this.site.production) 
      ? Handlebars.compile(Handlebars.partials['comments.'+provider])(this)
      : '<p class="development-notice" style="background:orange">'+ provider +' Loaded!</p>';
  });
  
  // Internal: Register pages_list helper
  // Iterate through a list of pages.
  // TODO: setting any variables in the pages dictionary will alter the dictionary.
  //   Consider deep-cloning each page object.
  //   It works now because the dictionary is renewed on every preview generation.
  //
  // context - Optional [Array] 
  //   Pass an array of page ids (page.id)
  //   The ids are expanded into objects from the page dictionary.
  //   If there is no context, we assume the pages dictionary.
  //   TODO: Log unfound pages.
  //
  // Examples
  //
  //   {{#pages_list}} ... {{/pages_list}}
  //
  // Returns: [String] - The parsed block content.
  Handlebars.registerHelper('pages_list', function(context, block) {
    var template = block ? block.fn : context.fn;

    var pages = [];
    if ( _.isArray(context) )
      _.each(context, function(id){
        if(this.pages[id]) pages.push(this.pages[id])
      }, this)
    else pages = this.pages;

    var cache = '';
    _.each(pages, function(page){
      if(this.page.id.replace(/^\//,'') === page.id.replace(/^\//,'')) page.isActivePage = true;
      cache += template(page);
    }, this);
    
    return new Handlebars.SafeString(cache);
  });
  
  // Internal: Register posts_list helper 
  // Iterate through a list of ordered posts.
  // Default order is reverse chronological.
  //
  // context - Optional [Array]
  //   Pass an array of post ids (post.id)
  //   The ids are expanded into objects from the post dictionary.
  //   If there is no context, we assume the ordered post array from posts dictionary..
  //
  // Examples
  //
  //   {{#posts_list}} ... {{/posts_list}}
  //
  // Returns: [String] - The parsed block content.
  Handlebars.registerHelper('posts_list', function(context, block) {
    var template = block ? block.fn : context.fn;
    var posts = _.map( 
      ( _.isArray(context) ? context : this._posts.chronological ),
      function(id){ return this._posts.dictionary[id] },
      this
    );

    var cache = '';
    _.each(posts, function(posts){
      cache += template(posts);
    }, this);
    
    return new Handlebars.SafeString(cache);
  });
  
  // Internal: Register tags_list helper.
  // Iterate through a list of tags.
  //
  // context - Optional [Array] Pass an array of tag names.
  //   The names are expanded into objects from the tags dictionary.
  //   If there is no context, we assume all tags in the dictionary.
  //
  // Examples
  //
  //   {{#tags_list}} ... {{/tags_list}}
  //
  // Returns: [String] - The parsed block content.  
  Handlebars.registerHelper('tags_list', function(context, block) {
    var template = block ? block.fn : context.fn;
    var tags = _.isArray(context) 
      ? _.map( context, function(name){ return this._tags[name] }, this)
      : this._tags;

    var cache = '';
    _.each(tags, function(tag){
      cache += template(tag);
    }, this);
    
    return new Handlebars.SafeString(cache);
  });
  
  // Internal: Register categories_list helper.
  // Iterate through a list of categories.
  //
  // context - Optional [Array] Pass an array of category names.
  //   The names are expanded into objects from the categories dictionary.
  //   If there is no context, we assume all categories in the dictionary.
  //
  // Examples
  //
  //   {{#categories_list}} ... {{/categories_list}}
  //
  // Returns: [String] - The parsed block content.
  Handlebars.registerHelper('categories_list', function(context, block) {
    var template = block.fn;
    var cache = '';
    _.each(context, function(data){
      cache += template(data);
    }, this);
    
    return new Handlebars.SafeString(cache);
  });
  
  // Internal: Register posts_collate block helper
  // Collate posts by year and month descending.
  //
  // Examples
  //
  //   {{#posts_collate }} ... {{/posts_collate}}
  //
  // Returns: [String] - The parsed block content.
  Handlebars.registerHelper('posts_collate', function(block) {
    var template = block.fn;
    var cache = '';
    _.each(this._posts.collated, function(data){
      cache += template(data);
    }, this);
    
    return new Handlebars.SafeString(cache);
  });
  
  
  return Handlebars;
});