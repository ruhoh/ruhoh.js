define([
  'jquery',
  'underscore',
  'backbone',
  'models/layout',
  'models/post',
  'models/site',
  'models/navigation',
  'models/tags',
  'models/payload',
  'mustache'
], function($, _, Backbone, Layout, Post, Site, Navigation, Tags, Payload){

  // Preview object builds a preview of a given page/post
  //
  // There is only ever one preview at any given time.
  // page/posts exist as data-structures only.
  // Aggrregate data-structures can be built from those objects.
  //
  // However for the purpose of the _framework, the preview
  // object is what renders what you see in the browser.
  return Backbone.Model.extend({ 
    master : Layout,
    sub : Layout,
    post : Post,
    payload : Payload,

    initialize : function(attrs){

      this.page = new Post({id : attrs.page });
      this.site = new Site();
      this.navigation = new Navigation();
      this.tags = new Tags();
      
      var that = this;
      $.when(
        this.page.deferred, this.site.deferred,
        this.navigation.deferred, this.tags.deferred
      ).then(function(){
        that.process();
      }, function(a, status, message){
        var response = status + ": " + message;
        $("body").html('<h2>'+ response +'</h2><p>'+ this.url +'</p');
        throw(response + ": " + this.url);
      });
      
    },
    
    // - Build the payload.
    // - Process sub and master templates.
    // - Render the result.
    process : function(){

      this.payload = new Payload();
      this.payload.set({
        "site" : this.site.attributes,
        "ASSET_PATH" : this.getThemePath(),
        "HOME_PATH" : this.getPath(),
        "BASE_PATH" : this.getPath(),
        "navigation" : this.navigation.get("data"),
        "tags" : this.tags.get("data"),
        "page" : this.page.attributes,
        // Set page content as {{content}} for sub-template.
        "content" : this.page.get("content")
      });
      
      // Process the post+sub-template
      var processedSub = $.mustache(this.page.sub.get("content"), this.payload.attributes)

      // Set processed *post+sub-template* as content for master-template.
      this.payload.set("content", processedSub);
      
      // Process the master template with post+sub-template
      // Render the result into the browser.
      $("body").html($.mustache(this.page.master.get("content"), this.payload.attributes));
    }
  
  });
  
});