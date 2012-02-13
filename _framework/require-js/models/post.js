define([
  'jquery',
  'underscore',
  'backbone',
  'models/layout',
  'js-yaml',
], function($, _, Backbone, Layout){

  // Post Model
  return Backbone.Model.extend({
    // Matcher for YAML Front Matter
    FMregex : /^---\n(.|\n)*---\n/,

    // Fetch the post and resolve all template dependencies.
    // TODO: This probably can be implemented a lot better.
    initialize : function(attrs){
      var dfd = $.Deferred();
      var that = this;

      $.when(this.fetch({dataType : "html", cache : false})).then(function(){

        that.sub = new Layout({id :  that.get("layout") });

        $.when(that.sub.deferred).then(function(){
          
          that.master = new Layout({id : "default" });
          
          $.when(that.master.deferred).then(function(){
            dfd.resolve();
          })
          
        }).fail(function(a, status, message){
            throw(status + ": " + message + ": " + this.url);
          })

      })
      
      this.deferred = dfd;
    },
    
    url : function(){
      return this.getPath('/data/'+this.id);
    },

    // Parse the raw post file.
    parse : function(response){ 
      this.parseFrontMatter(response);
      this.parseContent(response);
      return this.attributes;
    },
    
    // Parse and store the YAML Front Matter from the file.
    parseFrontMatter : function(response){
      var front_matter = this.FMregex.exec(response);
      if(!front_matter) throw("INVALID FRONT MATTER");
      front_matter = front_matter[0].replace(/---\n/g, "");
      this.set(jsyaml.load(front_matter));
      
      // transform tags array into an array of tag objects
      // for normalized use in templates.
      var tags  = [];
      _.each(this.get("tags"), function(name){
        tags.push({name : name, count : 0 })
      })
      this.set("tags", tags);
    },
    
    // parse and set the content data.
    // TODO: markdown/textile etc.
    parseContent : function(response){
      this.set("content", response.replace(this.FMregex, ""));
    }
    
  });

});