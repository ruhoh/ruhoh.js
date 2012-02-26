require 'yaml'
require 'json'
require 'time'
require 'fileutils'
require 'cgi'

require 'directory_watcher'

module RuhOh
  class << self; attr_accessor :config end
  
  FMregex = /^---\n(.|\n)*---\n/
  Config = Struct.new(
    :site_source_path,
    :database_folder,
    :posts_path,
    :posts_data_path,
    :pages_data_path,
    :permalink
  )

  # Public: Setup RuhOh utilities relative to the current directory
  # of the application and its corresponding ruhoh.json file.
  #
  def self.setup
    base_directory = Dir.getwd
    config = File.open(File.join(base_directory, 'ruhoh.json'), "r").read
    config = JSON.parse(config)

    c = Config.new
    c.site_source_path = File.join(base_directory, config['site_source'])
    c.database_folder = '_database'
    c.posts_path = File.join(c.site_source_path, '_posts')
    c.posts_data_path = File.join(c.site_source_path, c.database_folder, 'posts_dictionary.yml')
    c.pages_data_path = File.join(c.site_source_path, c.database_folder, 'pages_dictionary.yml')
    c.permalink = config['permalink'] || :date # default is date in jekyll
    self.config = c
  end
  
  module Posts
    
    MATCHER = /^(.+\/)*(\d+-\d+-\d+)-(.*)(\.[^.]+)$/

    # Public: Generate the Posts dictionary.
    #
    def self.generate
      raise "RuhOh.config cannot be nil.\n To set config call: RuhOh.setup" unless RuhOh.config
      puts "=> Generating Posts..."

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
  
      if invalid_posts.empty?
        puts "=> #{dictionary.count}/#{dictionary.count + invalid_posts.count} posts processed."
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
        
            post = YAML.load(front_matter[0].gsub(/---\n/, "")) || {}
            
            m, path, file_date, file_slug, ext = *filename.match(MATCHER)
            post['date'] = post['date'] || file_date

            ## Test for valid date
            begin 
              Time.parse(post['date'])
            rescue
              puts "Invalid date format on: #{filename}"
              puts "Date should be: YYYY/MM/DD"
              invalid_posts << filename
              next
            end
            
            post['id'] = filename
            post['title'] = post['title'] || self.titleize(file_slug)
            post['url'] = self.permalink(post)
            dictionary[filename] = post
          end
        }
      }

      [dictionary, invalid_posts]
    end
    
    # my-post-title ===> My Post Title
    def self.titleize(file_slug)
      file_slug.gsub(/[\W\_]/, ' ').gsub(/\b\w/){$&.upcase}
    end
    
    # Another blatently stolen method from Jekyll
    def self.permalink(post)
      date = Date.parse(post['date'])
      title = post['title'].downcase.gsub(' ', '-').gsub('.','')
      format = case (post['permalink'] || RuhOh.config.permalink)
      when :pretty
        "/:categories/:year/:month/:day/:title/"
      when :none
        "/:categories/:title.html"
      when :date
        "/:categories/:year/:month/:day/:title.html"
      else
        post['permalink'] || RuhOh.config.permalink
      end
      
      url = {
        "year"       => date.strftime("%Y"),
        "month"      => date.strftime("%m"),
        "day"        => date.strftime("%d"),
        "title"      => CGI::escape(title),
        "i_day"      => date.strftime("%d").to_i.to_s,
        "i_month"    => date.strftime("%m").to_i.to_s,
        "categories" => Array(post['categories'] || post['category']).join('/'),
        "output_ext" => 'html' # what's this for?
      }.inject(format) { |result, token|
        result.gsub(/:#{Regexp.escape token.first}/, token.last)
      }.gsub(/\/\//, "/")

      # sanitize url
      url = url.split('/').reject{ |part| part =~ /^\.+$/ }.join('/')
      url += "/" if url =~ /\/$/
      url
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

          tags[tag]['posts'] << post['id']
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

          categories[cat]['posts'] << post['id']
        end
      end  
      categories
    end

  end # Post
  
  module Pages
    
    # Public: Generate the Pages dictionary.
    #
    def self.generate
      raise "RuhOh.config cannot be nil.\n To set config call: RuhOh.setup" unless RuhOh.config
      puts "=> Generating Pages..."

      invalid_pages = []
      dictionary = {}
      total_pages = 0
      FileUtils.cd(RuhOh.config.site_source_path) {
        Dir.glob("**/*.*") { |filename| 
          next if FileTest.directory?(filename)
          next if ['_', '.'].include? filename[0]
          total_pages += 1

          File.open(filename) do |page|
            front_matter = page.read.match(RuhOh::FMregex)
            if !front_matter
              invalid_pages << filename ; next
            end

            data = YAML.load(front_matter[0].gsub(/---\n/, "")) || {}
            data['id'] = filename
            data['url'] = self.permalink(data)
            data['title'] = data['title'] || self.titleize(filename)

            dictionary[filename] = data
          end
        }
      }

       open(RuhOh.config.pages_data_path, 'w') { |page|
         page.puts dictionary.to_yaml
       }

      if invalid_pages.empty?
        puts "=> #{total_pages - invalid_pages.count }/#{total_pages} pages processed."
      else
        puts "=> Invalid pages not processed:"
        puts invalid_pages.to_yaml
      end    
    end

    def self.titleize(filename)
      File.basename( filename, File.extname(filename) ).gsub(/[\W\_]/, ' ').gsub(/\b\w/){$&.upcase}
    end
    
    def self.permalink(page)
      url = page['id'].gsub(File.extname(page['id']), '.html')
      
      # sanitize url
      url = url.split('/').reject{ |part| part =~ /^\.+$/ }.join('/')
      url += "/" if url =~ /\/$/
      url
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
      raise "RuhOh.config cannot be nil.\n To set config call: RuhOh.setup" unless RuhOh.config
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
