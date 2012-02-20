define([
  'utils/log',
  'markdown',
  'yaml'
], function(Log, Markdown){
  
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
    
    // Internal: Parse content from a file.
    // Content in a file is everything below the Front Matter.
    // 
    //  content - Required [String] The file contents.
    //  id      - Optional [String] The file id which is the name.
    //            File extension determines parse method.
    //
    // Returns: [String] The parsed content.
    content : function(content, id){
      content = content.replace(this.FMregex, '');
      if( id  && ['md', 'markdown'].indexOf( id.split('.').pop().toLowerCase() ) !== -1 ){
        var converter = new Markdown.Converter();
        return converter.makeHtml(content);
      }
      
      return content;
    }
    
  }

});