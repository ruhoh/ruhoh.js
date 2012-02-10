require.config({
  baseUrl : "_framework/require-js/",
  urlArgs: "bust=" + (new Date()).getTime()
});

require(['order!jquery','jb'], function($, JB){
  JB.init(function(){
    JB.build();
  });
});