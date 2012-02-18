define([
  'jquery',
  'underscore',
  'backbone',
  'utils/log',
  'handlebars',
], function($, _, Backbone, Log, Handlebars){

  Handlebars.registerHelper('debug', function(data) {
    console.log("debug:");
    console.log(data);
    return JSON.stringify(data);
  });
  
  Handlebars.registerHelper('analytics', function(context, block) {
    console.log("analytics");
    var provider = this.site.JB.analytics.provider;
    if(!provider) throw new Error('Analytics provider must be specified at: "site.JB.analytics.provider"');
    var a = Handlebars.partials['analytics.'+provider];
    var b = Handlebars.compile(a)(this);
    return b;
    //return new Handlebars.SafeString(Handlebars.partials['analytics.'+provider]);
  });  
  
  Handlebars.registerHelper('comments', function(context, block) {
    console.log("comments");
    var provider = this.site.JB.comments.provider;
    if(!provider) throw new Error('Comment provider must be specified at: "site.JB.comments.provider"');
    var a = Handlebars.partials['comments.'+provider];
    var b = Handlebars.compile(a)(this);
    return b;
  });
  
  // Public: Iterate through a list of pages.
  // TODO: setting any variables in the pages dictionary will alter the dictionary.
  //   Consider deep-cloning each page object.
  //   It works now because the dictionary is renewed on every preview generation.
  //
  // context - (Optional) - [Array] 
  //   Pass an array of page ids (urls)
  //   The ids are expanded into objects from the page dictionary.
  //   If there is no context, we assume the pages dictionary.
  //
  // Returns: Parsed HTML template.
  Handlebars.registerHelper('pages_list', function(context, block) {
    console.log("pages_list block");
    var template = block ? block.fn : context.fn;
    var pages = _.isArray(context) 
      ? _.map( context, function(url){ return this.pages[url] }, this)
      : this.pages;

    var cache = '';
    _.each(pages, function(page){
      if(this.page.id.replace(/^\//,'') === page.url.replace(/^\//,'')) page.isActivePage = true;
      cache += template(page);
    }, this);
    
    return new Handlebars.SafeString(cache);
  });
  
  // Public : Iterate through a list of ordered posts.
  // Default order is reverse chronological.
  //
  // context - (Optional) - [Array] 
  //   Pass an array of post ids (urls)
  //   The ids are expanded into objects from the post dictionary.
  //   If there is no context, we assume the ordered post array from posts dictionary..
  //
  // Returns: Parsed HTML template.
  Handlebars.registerHelper('posts_list', function(context, block) {
    console.log("posts_list block");
    var template = block ? block.fn : context.fn;
    var posts = _.map( 
      ( _.isArray(context) ? context : this._posts_chronological ),
      function(url){ return this._posts[url] },
      this
    );

    var cache = '';
    _.each(posts, function(posts){
      cache += template(posts);
    }, this);
    
    return new Handlebars.SafeString(cache);
  });
  
  
  Handlebars.registerHelper('tags_list', function(context, block) {
    console.log("tags_list");
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
  
  Handlebars.registerHelper('categories_list', function(context, block) {
    console.log("categories_list");
    var template = block.fn;
    var cache = '';
    _.each(context, function(data){
      cache += template(data);
    }, this);
    
    return new Handlebars.SafeString(cache);
  });
  
  Handlebars.registerHelper('posts_collate', function(context, block) {
    console.log("posts_collate");
    var template = block.fn;
    var cache = '';
    _.each(context, function(data){
      cache += template(data);
    }, this);
    
    return new Handlebars.SafeString(cache);
  });
  
  
  return Handlebars;
});