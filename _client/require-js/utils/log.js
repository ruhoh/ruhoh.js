define([
  'jquery',
  'underscore'
], function($, _){

  return { 

    // Public: Respond when a file fails to load.
    // Returns: Throws Exception.
    loadError : function(model, jqxhr){
      var message = jqxhr.status + ': ' + jqxhr.statusText;
      this.render(model.url, message, "Load Error");
      throw(message + ": " + model.url);
    },
    
    // Public: Respond when a file cannot be parsed
    // usually because the file is not formatted properly.
    // Returns: Throws Exception.
    parseError : function(fileId, message){
      this.render(fileId, message, "Parse Error");
      throw(message);
    },
    
    configError : function(message){
      this.render('_config.yml', message, "Configuration Error");
      throw(message);
    },
    
    // Public: Render a user friendly message into the DOM.
    // Returns: Nothing.
    render : function(fileId, message, type){
      $("body").html(
        '<h2 style="color:red">' + type + ': '+ message +'</h2>'
        + '<h3>File: ' + fileId + '</h3>'
      );
    }

  }

});
