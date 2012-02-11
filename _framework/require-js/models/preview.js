define([
  'jquery',
  'underscore',
  'backbone',
  'models/layout',
  'models/post',
  'models/payload',
  'mustache'
], function($, _, Backbone, Layout, Post, Payload){

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

    initialize : function(){
      this.master = new Layout({id : "default"});
      this.sub = new Layout({id : "post"});
      this.post = new Post();
      this.payload = new Payload();
      
      var that = this;
      $.when(
        this.master.deferred, this.sub.deferred, 
        this.post.deferred
      ).then(function(){ 
        that.process();
        that.render();
      });
    },
  
    // Process the data we need to build the payload,
    // and parse the templates.
    process : function(){

      // Set the current pages data into the payload. {{ page }}
      this.payload.set("page", this.post.attributes);
    
      // Make {{ content }} return page.content for the sibling-template.
      // TODO: Parse post/page markup (markdown).
      this.payload.set("content", this.post.get("content"));
    
      // Mustachify the sibling-template w/page content
      // and re-place into payload in preparation for master template.
      this.payload.set("content", $.mustache(this.sub.get("content"), this.payload.attributes));
    },

    // The payload is now ready to go into master template
    //  Mustachify the master template and render it onto the page.
    render : function(){
      $("body").html($.mustache(this.master.get("content"), this.payload.attributes));
    }
  
  });
  
});