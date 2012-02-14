define([
  'jquery',
  'underscore',
  'backbone',
  'models/layout',
  'models/page',
  'models/site',
  'models/navigation',
  'models/tags',
  'models/payload',
  'models/config',
  'mustache'
], function($, _, Backbone, Layout, Page, Site, Navigation, Tags, Payload, Config){

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
    page : Page,
    payload : Payload,

    initialize : function(attrs){
      this.page = new Page;
      this.page.sub = new Layout;
      this.page.master = new Layout;
      
      this.site = new Site;
      this.navigation = new Navigation;
      this.tags = new Tags;
      this.payload = new Payload;
      
      // Set pointers to a single Config.
      this.config = new Config,
      this.page.config = this.config,
      this.page.sub.config = this.config,
      this.page.master.config = this.config,
      this.site.config = this.config,
      this.navigation.config = this.config,
      this.tags.config = this.config,
      this.payload.config = this.config;

      this.page.bind("change:id", function(){
        console.log("THE PAGE ID HAS CHANGED TO: "+ this.page.id);
        this.generate();
      }, this)
    },
    
    generate : function(){
      var that = this;
      $.when(
        this.page.generate(), this.site.generate(),
        this.navigation.generate(), this.tags.generate()
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

      this.payload.set({
        "site" : this.site.attributes,
        "ASSET_PATH" : this.config.getThemePath(),
        "HOME_PATH" : this.config.getPath(),
        "BASE_PATH" : this.config.getPath(),
        "navigation" : this.navigation.get("data"),
        "tags" : this.tags.get("data"),
        "page" : this.page.attributes,
        // Set page content as {{content}} for sub-template.
        "content" : this.page.get("content")
      });
      

      // Process the page/post+sub-template
      var output = $.mustache(this.page.sub.get("content"), this.payload.attributes);
      
      // An undefined master means the page/post layouts is only one deep.
      // This means it expects to load directly into a master template.
      if(this.page.master.id){
        
        // Set processed *page/post+sub-template* as content for master-template.
        this.payload.set("content", output);

        // Process the master template with post+sub-template
        // Render the result into the browser.
        output = $.mustache(this.page.master.get("content"), this.payload.attributes);
      }
      
      $("body").html(output);
    }
  
  });
  
});