// Load layouts
define([
  'jquery',
  'js-yaml.min',
  'text!/~jade/layouts/default.html',
  'text!/~jade/layouts/post.html',
  'text!/~jade/layouts/page.html'
], function($, z, master, post, page){

  var Layouts = {
    master : master,
    post : post,
    page : page
  }
  return Layouts;
});