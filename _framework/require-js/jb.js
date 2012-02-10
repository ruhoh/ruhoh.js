define([
  'jquery',
  'payload',
  'layouts',
  'js-yaml',
  'mustache',
], function($, Payload, Layouts){

  var JB = { 
    init : function(boot){
      if(typeof boot === "function") boot();
    },
    
    build : function (){
      JB.payload.content = JB.payload.page.content;
      JB.payload.content = $.mustache(JB.layouts.post, JB.payload);
      $("body").html($.mustache(JB.layouts.master, JB.payload));
    }
  };
  
  JB.payload = Payload;
  JB.layouts = Layouts;
  
  return JB;
});
