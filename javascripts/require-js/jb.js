define([
  'jquery',
  'payload',
  'js-yaml.min',
  'mustache',
], function($, Payload){

  var JB = { 
    init : function(boot){
      if(typeof boot === "function") boot();
    },
    
    build : function (){

      $.get("layouts/default.html", function(master){
        $.get("layouts/post.html", function(sub){ 

          JB.payload.content = JB.payload.page.content;

          JB.payload.content = $.mustache(sub, JB.payload);

          $("body").prepend($.mustache(master, JB.payload));
        })
      })

    }
  };
  
  JB.payload = Payload;
  
  return JB;
});
