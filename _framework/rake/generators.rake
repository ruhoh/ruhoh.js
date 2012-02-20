require 'yaml'
require 'json'

FMregex = /^---\n(.|\n)*---\n/

# Path configuration helper
module JB
  class Path
    SOURCE = "."
    Paths = {
      :site_path => "_framework/sample_kit",
      :layouts => "_layouts",
      :database => "_framework/sample_kit/_database",
      :posts => "_posts"
    }
    
    def self.base
      SOURCE
    end

    # build a path relative to configured path settings.
    def self.build(path, opts = {})
      opts[:root] ||= SOURCE
      path = "#{opts[:root]}/#{Paths[path.to_sym]}/#{opts[:node]}".split("/")
      path.compact!
      File.__send__ :join, path
    end
  
  end #Path
end #JB

# Public: Generate data from the site assets (posts/pages).
# The data structures are referred to as "dictionaries".
#
# Returns: Nothing.
task :generate do
  generate_pages
  generate_posts
end

# Public: Generate the Posts dictionary.
#
def generate_posts
  puts "=> Generating Posts"

  posts = []
  invalid_posts = []
  dictionary = {}
  
  FileUtils.cd(JB::Path.build(:site_path, :node => "_posts" )) {
    Dir.glob("**/*.*") { |filename| 
      next if FileTest.directory?(filename)
      next if ['_', '.'].include? filename[0]

      File.open(filename) do |page|
        front_matter = page.read.match(FMregex)
        if !front_matter
          invalid_posts << filename ; next
        end
        
        data = YAML.load(front_matter[0].gsub(/---\n/, "")) || {}
        data['id'] = filename
        data['url'] = filename

        posts << filename 
        dictionary[filename] = data
      end
    }
  }
  
  open(JB::Path.build(:database, :node => 'posts_dictionary.yml'), 'w') { |page|
    page.puts dictionary.to_yaml
  }
  
  puts "=> Posts Done!"
end

# Public: Generate the Pages dictionary.
#
def generate_pages 
  puts "=> Generating pages"

  pages = []
  invalid_pages = []
  dictionary = {}
  
  FileUtils.cd(JB::Path.build(:site_path)) {
    Dir.glob("**/*.*") { |filename| 
      next if FileTest.directory?(filename)
      next if ['_', '.'].include? filename[0]

      File.open(filename) do |page|
        front_matter = page.read.match(FMregex)
        if !front_matter
          invalid_pages << filename ; next
        end
        
        data = YAML.load(front_matter[0].gsub(/---\n/, "")) || {}
        data['id'] = filename
        data['url'] = filename

        pages << filename 
        dictionary[filename] = data
      end
    }
  }
  
   open(JB::Path.build(:database, :node => 'pages_dictionary.yml'), 'w') { |page|
     page.puts dictionary.to_yaml
   }
  
  puts 'Invalid Pages'
  puts invalid_pages
  puts "Pages Done!"
  puts '---'
end


