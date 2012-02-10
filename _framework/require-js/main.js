require.config({
  baseUrl : "_framework/require-js/",
  urlArgs: "bust=" + (new Date()).getTime()
});

require(['order!jquery','app'], function($, App){
  App.init(function(){
    App.build();
  });
});