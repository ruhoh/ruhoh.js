define([
  'jquery',
  'underscore',
  'backbone',
  'utils/log',
  'handlebars',
  'text!/JB/pages_list',
  'text!/JB/tags_list',
  'text!/JB/posts_collate',
  'text!/JB/analytics-providers/google',
  'text!/JB/analytics-providers/getclicky',

  'text!/JB/comments-providers/disqus',
  'text!/JB/comments-providers/intensedebate',
  'text!/JB/comments-providers/livefyre',
  'text!/JB/comments-providers/facebook',
], function($, _, Backbone, Log, Handlebars,
  pages_list, tags_list, posts_collate,
  google, getclicky,
  disqus, intensedebate, livefyre, facebook
){

  Handlebars.registerPartial('tags_list', tags_list);
  Handlebars.registerPartial('pages_list', pages_list);
  Handlebars.registerPartial('posts_collate', posts_collate);
  
  Handlebars.registerPartial('analytics.google', google);
  Handlebars.registerPartial('analytics.getclicky', getclicky);

  Handlebars.registerPartial('comments.disqus', disqus);
  Handlebars.registerPartial('comments.intensedebate', intensedebate);
  Handlebars.registerPartial('comments.livefyre', livefyre);
  Handlebars.registerPartial('comments.facebook', facebook);
  
  return Handlebars;
});