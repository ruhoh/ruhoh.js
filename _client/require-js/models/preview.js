define([
  'jquery',
  'underscore',
  'backbone',

  'dictionaries/pages',
  'dictionaries/posts',
  
  'models/config',
  'models/page',
  'models/layout',
  'models/payload',
  'models/partial',
  
  'collections/partials',
  
  'utils/log',
  'mustache',
  'helpers',
], function($, _, Backbone, 
  PagesDictionary, PostsDictionary, 
  Config, Page, Layout, Payload, Partial,
  Partials,
  Log, Mustache){

  TemplateEngine = "Mustache";
  ContentRegex = /\{\{\s*content\s*\}\}/i;

  // Preview object builds a preview of a given page/post
  //
  // There is only ever one preview at any given time.
  // page/posts exist as data-structures only.
  // Aggrregate data-structures can be built from those objects.
  //
  // However for the purpose of the _client, the preview
  // object is what renders what you see in the browser.
  return Backbone.Model.extend({ 
    master : Layout,
    sub : Layout,
    page : Page,
    payload : Payload,

    initialize : function(attrs, config){
      this.config = config;
      this.page = new Page;
      this.page.sub = new Layout;
      this.page.master = new Layout;
      
      this.payload = new Payload;
      this.pagesDictionary = new PagesDictionary;
      this.postsDictionary = new PostsDictionary;
      this.partials = new Partials;
      
      // Set pointers to a single Config.
      this.page.config = this.config,
      this.page.sub.config = this.config,
      this.page.master.config = this.config,
      this.payload.config = this.config,
      this.partials.config = this.config,
      this.pagesDictionary.config = this.config,
      this.postsDictionary.config = this.config;
      
      this.page.bind("change:id", function(){
        this.generate();
      }, this)
    },
    
    generate : function(){
      var that = this;
      $.when(
        this.page.generate(), 
        this.partials.generate(),
        this.pagesDictionary.generate(),
        this.postsDictionary.generate()
      ).done(function(){
        that.buildPayload();
        that.process();
      }).fail(function(jqxhr){
        Log.loadError(this, jqxhr)
      });
    },
    
    // Build the payload.
    buildPayload : function(){
      this.payload.set({
        "config" : this.config.attributes,
        "page" : this.page.attributes,
        "pages" : this.pagesDictionary.attributes,
        "_posts" : this.postsDictionary.attributes,
        "ASSET_PATH" : this.config.getThemePath(),
        "HOME_PATH" : "/",
        "BASE_PATH" : ""
      })
    },

    process : function(){
      var output = this.page.sub.get("content")
        .replace(ContentRegex, this.page.get("content"));

      // An undefined master means the page/post layouts is only one deep.
      // This means it expects to load directly into a master template.
      if(this.page.master.id){
        output = this.page.master.get("content")
          .replace(ContentRegex, output);
      }
      this[TemplateEngine](output);
    },
    
    // Public: Process content, sub+master templates then render the result.
    //  
    // TODO: Include YAML Front Matter from the templates.
    // Returns: Nothing. The finished preview is rendered in the Browser.
    Handlebars : function(output){
      var template = Handlebars.compile(output);
      $(document).html( template(this.payload.attributes) );
    },
    
    // Public: Process content, sub+master templates then render the result.
    //  
    // TODO: Include YAML Front Matter from the templates.
    // Returns: Nothing. The finished preview is rendered in the Browser.
    Mustache : function(output){
      $('body').html(
        Mustache.render(
          output, 
          this.payload.attributes, 
          this.partials.toHash()
        )
      );
    }
    
  
  });
  
});