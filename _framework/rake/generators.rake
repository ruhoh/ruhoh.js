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
  #generate_pages
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
  
  posts_array = []
  dictionary.each_value { |val| posts_array << val }

  chronological = build_chronology(posts_array)
  collated_posts = collate(posts_array)
  tags = parse_tags(posts_array)
  
  data = {
    'chronological' => chronological,
    'collated' => collated_posts,
    'dictionary' => dictionary,
    'tags' => tags
  }
  open(JB::Path.build(:database, :node => 'posts_dictionary.yml'), 'w') { |page|
    page.puts data.to_yaml
  }
  
  puts "=> Posts Done!"
end

def build_chronology(posts)
  posts.sort {
    |a,b| Date.parse(b['date']) <=> Date.parse(a['date'])
  }.map { |post| post['id'] }
end

# // Create a collated posts data structure.
# // [{ 'year': year, 
# //   'months' : [{ 'month' : month, 
# //      'posts': [{}, {}, ..] }, ..] }, ..]
# //
def collate(posts)
  collated = []

  posts.each_with_index do |post, i|
    thisYear = Time.new(post['date']).strftime('%Y')
    thisMonth = Time.new(post['date']).strftime('%B')
    prevDate = ''
    prevMonth = ''
    prevYear = ''

    if posts[i-1] 
      prevDate = posts[i-1]['date']
      prevYear = Time.new(posts[i-1]['date']).strftime('%Y')
      prevMonth = Time.new(posts[i-1]['date']).strftime('%B')
    end

    if(prevYear && prevYear === thisYear) 
      if(prevMonth && prevMonth === thisMonth)
        collated.last['months'].last['posts'] << post # append to last year & month
      else
        collated.last['months'] << {
            'month' => thisMonth,
            'posts' => [post]
          } # create new month
      end
    else
      collated << { 
        'year' => thisYear,
        'months' => [{ 
          'month' => thisMonth,
          'posts' => [post]
        }]
      } # create new year & month
    end

  end

  collated
end

def parse_tags(posts)
  tags = {}
  
  posts.each do |post|
    Array(post['tags']).each do |tag|
      if tags[tag]
        tags[tag]['count'] += 1
      else
        tags[tag] = { 'count' => 1, 'name' => tag, 'posts' => [] }
      end 

      tags[tag]['posts'] << post['url']
    end
  end  
  tags
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


