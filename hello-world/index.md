---
layout : page
title : Home Page
tagline : The sample kit homepage
---


### posts_list

<ul>
{{#posts_list}}
  <li><a href="{{url}}">{{title}}</a></li>
{{/posts_list}}
</ul>

### JB/analytics

  {{{analytics}}}
    
    {% include JB/analytics %}

### JB/categories_list


### JB/comments
{{{comments}}}

    {% include JB/comments %}


### JB/pages_list

<ul>
{{#pages_list site.navigation}}
  {{> pages_list }}
{{/pages_list}}  
</ul>

    {% assign pages_list = site.pages %}
    {% assign group = 'navigation' %}
    {% include JB/pages_list %}


### JB/posts_collate

{{#posts_collate}}
<h2>{{year}}</h2>
{{#months}}
  <h3>{{month}}</h3>
  <ul>
    {{#posts}}
    <li><span>{{date}}</span> &raquo; <a href="{{url}}">{{title}}</a></li>
    {{/posts}}
  </ul>
{{/months}}
{{/posts_collate}}

    {% assign posts_collate = site.posts %}
    {% include JB/posts_collate %}


### JB/setup

- ASSET\_PATH : {{ASSET_PATH}}
- HOME\_PATH : {{HOME_PATH}}
- BASE\_PATH : {{BASE_PATH}}

### JB/sharing

not implemented (same as comments/analytics)

### JB/tags_list

<ul class="tag_box inline">
{{#tags_list}}
  {{> tags_list }}
{{/tags_list }}
</ul>

    {% assign pages_list = site.pages %}
    {% assign group = 'navigation' %}
    {% include JB/pages_list %}
