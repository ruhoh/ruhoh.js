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
      this.root = attrs.root;
      this.theme = attrs.theme;

      this.master = new Layout({id : attrs.master, path: this.assetPath() });
      this.sub = new Layout({id : attrs.sub, path: this.assetPath() });

      this.post = new Post();

      this.site = new Site();
      this.navigation = new Navigation();
      this.tags = new Tags();

      var that = this;
      $.when(
        this.master.deferred, this.sub.deferred, 
        this.post.deferred, this.site.deferred,
        this.navigation.deferred, this.tags.deferred
      ).then(function(){ 
        that.process();
      });
    },
    
    // - Build the payload.
    // - Process sub and master templates.
    // - Render the result.
    process : function(){

      this.payload = new Payload();
      this.payload.set("site", this.site.attributes);
      this.payload.set("ASSET_PATH", this.assetPath());
      this.payload.set("HOME_PATH", this.getPath());
      this.payload.set("BASE_PATH", this.getPath());
      
      this.payload.set("navigation", this.navigation.get("data"));
      this.payload.set("tags", this.tags.get("data"));
      this.payload.set("page", this.post.attributes);
      
      // Set post as content for sub-template.
      this.payload.set("content", this.post.get("content"));
      
      // Process the post+sub-template
      var processedSub = $.mustache(this.sub.get("content"), this.payload.attributes)

      // Set processed *post+sub-template* as content for master-template.
      this.payload.set("content", processedSub);
      
      // Process the master template with post+sub-template
      // Render the result into the browser.
      $("body").html($.mustache(this.master.get("content"), this.payload.attributes));
    },
    
    // Internal : Builds the absolute URL path to assets relative to enabled theme.
    // Returns: String - Normalized absolute URL paath to theme assets.
    assetPath : function(){
      return this.getPath("/themes/" + this.theme);
    },
    
    // Internal: Get a normalized, absolute path for this Preview instance.
    // Normalizes user-submitted paths into a well-formed url.
    // 
    // path - (Optional) String representing a relative path to an asset.
    //
    // Returns: String - Normalized absolute URL path to asset.
    getPath : function(path){
      return ( this.basePath || this.setBasePath() )
        .concat( 
          _.compact( ( path ? path.split('/') : [] ) )
        )
        .join('/');
    },
    
    // Internal: Normalizes 'this.basePath' into a well-formed URL.
    // This is used in 'getPath' initially, then cached for subsequent use.
    // Returns: String - Normalized absolute URL root.
    setBasePath : function(){
      var nodes = this.root.split('/');
      if(["", "index.html"].indexOf(_.last(nodes)) !== -1 ) nodes.pop();
      return (this.basePath = nodes);
    }
  
  });
  
});