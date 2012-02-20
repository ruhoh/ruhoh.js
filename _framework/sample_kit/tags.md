---
layout: page
title: Tags
header: Posts By Tag
group: navigation
---


The posts listings should work with 'posts_list' helper
so we can fetch the post objects. To do this I need to
look into Handlebars more.

<ul class="tag_box inline">
{{#tags_list}}
  {{>tags_list}}
{{/tags_list}}
</ul>


{{#tags_list}}
  <h2 id="{{name}}-ref">{{name}}</h2>
  {{#posts}}
    <li><a href="{{.}}">{{.}}</a></li>
  {{/posts}}
{{/tags_list}}
