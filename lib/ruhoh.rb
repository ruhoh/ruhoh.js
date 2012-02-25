require 'yaml'
require 'json'
require 'time'
require 'fileutils'

require 'directory_watcher'

module RuhOh
  class << self; attr_accessor :config end
  
  FMregex = /^---\n(.|\n)*---\n/
  Config = Struct.new(
    :site_source_path,
    :database_folder,
    :posts_path,
    :posts_data_path,
    :pages_data_path
  )

  # Public: Setup RuhOh utilities relative to the current directory
  # of the application and its corresponding config.json file.
  #
  def self.setup
    base_directory = Dir.getwd
    config = File.open(File.join(base_directory, 'config.json'), "r").read
    config = JSON.parse(config)

    c = Config.new
    c.site_source_path = File.join(base_directory, config['dataPath'])
    c.database_folder = '_database'
    c.posts_path = File.join(c.site_source_path, '_posts')
    c.posts_data_path = File.join(c.site_source_path, c.database_folder, 'posts_dictionary.yml')
    c.pages_data_path = File.join(c.site_source_path, c.database_folder, 'pages_dictionary.yml')
    self.config = c
  end
  
  module Posts
    
    # Public: Generate the Posts dictionary.
    #
    def self.generate
      raise "RuhOh.config cannot be nil.\n To set config call: RuhOh.set_config(<base_directory>)" unless RuhOh.config
      puts "=> Generating Posts"

      dictionary, invalid_posts = process_posts
      ordered_posts = []
      dictionary.each_value { |val| ordered_posts << val }
      
      ordered_posts.sort! {
        |a,b| Date.parse(b['date']) <=> Date.parse(a['date'])
      }
      
      data = {
        'dictionary' => dictionary,
        'chronological' => build_chronology(ordered_posts),
        'collated' => collate(ordered_posts),
        'tags' => parse_tags(ordered_posts),
        'categories' => parse_categories(ordered_posts)
      }

      open(RuhOh.config.posts_data_path, 'w') { |page|
        page.puts data.to_yaml
      }
  
      puts "=> Posts Done!\n"
      if invalid_posts.empty?
        puts "=> All posts processed!"
      else
        puts "=> Invalid posts not processed:"
        puts invalid_posts.to_yaml
      end
    end

    def self.process_posts
      dictionary = {}
      invalid_posts = []

      FileUtils.cd(RuhOh.config.posts_path) {
        Dir.glob("**/*.*") { |filename| 
          next if FileTest.directory?(filename)
          next if ['_', '.'].include? filename[0]

          File.open(filename) do |page|
            front_matter = page.read.match(RuhOh::FMregex)
            if !front_matter
              invalid_posts << filename ; next
            end
        
            data = YAML.load(front_matter[0].gsub(/---\n/, "")) || {}
            
            ## Test for valid date
            begin 
              Time.parse(data['date'])
            rescue
              puts "Invalid date format on: #{filename}"
              puts "Date should be: YYYY/MM/DD"
              invalid_posts << filename
              next
            end
            
            data['id'] = filename
            data['url'] = filename
            dictionary[filename] = data
          end
        }
      }

      [dictionary, invalid_posts]
    end
    
    def self.build_chronology(posts)
      posts.map { |post| post['id'] }
    end

    # Internal: Create a collated posts data structure.
    #
    # posts - Required [Array] 
    #  Must be sorted chronologically beforehand.
    #
    # [{ 'year': year, 
    #   'months' : [{ 'month' : month, 
    #     'posts': [{}, {}, ..] }, ..] }, ..]
    # 
    def self.collate(posts)
      collated = []
      posts.each_with_index do |post, i|
        thisYear = Time.parse(post['date']).strftime('%Y')
        thisMonth = Time.parse(post['date']).strftime('%B')
        if posts[i-1] 
          prevYear = Time.parse(posts[i-1]['date']).strftime('%Y')
          prevMonth = Time.parse(posts[i-1]['date']).strftime('%B')
        end
        
        if(prevYear == thisYear) 
          if(prevMonth == thisMonth)
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

    def self.parse_tags(posts)
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

    def self.parse_categories(posts)
      categories = {}

      posts.each do |post|
        cats = post['categories'] ? post['categories'] : Array(post['category']).join('/')
    
        Array(cats).each do |cat|
          cat = Array(cat).join('/')
          if categories[cat]
            categories[cat]['count'] += 1
          else
            categories[cat] = { 'count' => 1, 'name' => cat, 'posts' => [] }
          end 

          categories[cat]['posts'] << post['url']
        end
      end  
      categories
    end

  end # Post
  
  module Pages
    
    # Public: Generate the Pages dictionary.
    #
    def self.generate
      raise "RuhOh.config cannot be nil.\n To set config call: RuhOh.set_config(<base_directory>)" unless RuhOh.config
      puts "=> Generating pages"

      pages = []
      invalid_pages = []
      dictionary = {}

      FileUtils.cd(RuhOh.config.site_source_path) {
        Dir.glob("**/*.*") { |filename| 
          next if FileTest.directory?(filename)
          next if ['_', '.'].include? filename[0]

          File.open(filename) do |page|
            front_matter = page.read.match(RuhOh::FMregex)
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

       open(RuhOh.config.pages_data_path, 'w') { |page|
         page.puts dictionary.to_yaml
       }

      puts "=> Pages done!\n"
      if invalid_pages.empty?
        puts "=> All pages processed!"
      else
        puts "=> Invalid pages not processed:"
        puts invalid_pages.to_yaml
      end    
    end

  end # Page
  
  module Watch
    
    # Internal: Watch website source directory for file changes.
    # The observer triggers data regeneration as files change
    # in order to keep the data up to date in real time.
    #
    #  site_source - Required [String] Path to the root directory 
    #    of the website source files.
    #
    # Returns: Nothing
    def self.start
      raise "RuhOh.config cannot be nil.\n To set config call: RuhOh.set_config(<base_directory>)" unless RuhOh.config
      puts "=> Start watching: #{RuhOh.config.site_source_path}"
      glob = ''
      
      # Watch all files + all sub directories except for special folders e.g '_database'
      Dir.chdir(RuhOh.config.site_source_path) {
        dirs = Dir['*'].select { |x| File.directory?(x) }
        dirs -= [RuhOh.config.database_folder]
        dirs = dirs.map { |x| "#{x}/**/*" }
        dirs += ['*']
        glob = dirs
      }

      dw = DirectoryWatcher.new(RuhOh.config.site_source_path, {
        :glob => glob, 
        :pre_load => true
      })
      dw.interval = 1
      dw.add_observer {|*args| 
        args.each {|event|
          path = event['path'].gsub(RuhOh.config.site_source_path, '')

          if path =~ /^\/?_posts/
            RuhOh::Posts::generate
          else
            RuhOh::Pages::generate
          end
    
          t = Time.now.strftime("%H:%M:%S")
          puts "[#{t}] regeneration: #{args.size} files changed"
        }
      }

      dw.start
    end   

  end  # Watch

end # RuhOh  
