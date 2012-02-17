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
  
  Handlebars.registerHelper('pages_list', function(context, block) {
    console.log("pages_list block");
    var template = block.fn;
    var cache = '';
    _.each(context, function(data){
      if(this.page.id.replace(/^\//,'') === data.url.replace(/^\//,'')) data.isActivePage = true;
      cache += template(data);
    }, this);
    
    return new Handlebars.SafeString(cache);
  });
  
  Handlebars.registerHelper('tags_list', function(context, block) {
    console.log("tags_list");
    var template = block.fn;
    var cache = '';
    _.each(context, function(data){
      cache += template(data);
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