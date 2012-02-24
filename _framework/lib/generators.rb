require 'yaml'
require 'json'
require 'time'
require 'fileutils'

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

module RuhOh
  
  module Posts

    # Public: Generate the Posts dictionary.
    #
    def self.generate
      puts "=> Generating Posts"

      dictionary, invalid_posts = self.process_posts
      ordered_posts = []
      dictionary.each_value { |val| ordered_posts << val }
      
      ordered_posts.sort! {
        |a,b| Date.parse(b['date']) <=> Date.parse(a['date'])
      }
      
      data = {
        'dictionary' => dictionary,
        'chronological' => self.build_chronology(ordered_posts),
        'collated' => self.collate(ordered_posts),
        'tags' => self.parse_tags(ordered_posts),
        'categories' => self.parse_categories(ordered_posts)
      }

      open(JB::Path.build(:database, :node => 'posts_dictionary.yml'), 'w') { |page|
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

      puts "=> Pages done!\n"
      if invalid_pages.empty?
        puts "=> All pages processed!"
      else
        puts "=> Invalid pages not processed:"
        puts invalid_pages.to_yaml
      end    
    end

  end # Page
  
end # RuhOh