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
      return (jsyaml.load(front_matter) || {});
    },
    
    // parse and set the content data.
    // TODO: markdown/textile etc.
    content : function(content){
      return content.replace(this.FMregex, "");
    }
    
  }

});