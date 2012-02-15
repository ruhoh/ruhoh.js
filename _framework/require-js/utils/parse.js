define([
  'utils/log',
  'yaml'
], function(Log){
  
  return {
    
    // Matcher for YAML Front Matter
    FMregex : /^---\n(.|\n)*---\n/,
    
    // Parse and store the YAML Front Matter from the file.
    frontMatter : function(content, file){
      var front_matter = this.FMregex.exec(content);
      if(!front_matter) Log.parseError(file, "Invalid YAML Front Matter");
      front_matter = front_matter[0].replace(/---\n/g, "");
      return this.tags(jsyaml.load(front_matter) || {});
    },
    
    // parse and set the content data.
    // TODO: markdown/textile etc.
    content : function(content){
      return content.replace(this.FMregex, "");
    },
    
    // Transform tags array into an array of tag objects
    // for normalized use in templates.
    tags : function(data){
      if(data.tags && data.tags.length > 0){
        var tags  = [];
        _.each(data.tags, function(name){
          tags.push({name : name, count : 0 })
        })
        data.tags = tags;
      }

      return data;
    }
    
  }

});