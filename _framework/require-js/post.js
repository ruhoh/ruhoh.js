// Post is responsible for generating/parsing 
// formatted post files.
define([
  'js-yaml'
], function(){

  var Post = {
    // Matcher for YAML Front Matter
    FMregex : /^---\n(.|\n)*---\n/,
    
    //TODO: throw an error is there is no Front Matter
    //      or the Front Matter is invalid YAML.
    generate : function(file_contents){
      var front_matter = Post.FMregex.exec(file_contents);
      if(!front_matter) console.log("INVALID FRONT MATTER");
      front_matter = front_matter[0].replace(/---\n/g, "");

      var data = jsyaml.load(front_matter);
      data.content = file_contents.replace(Post.FMregex, "");
      return data;
    }
    
  }

  return Post;
});