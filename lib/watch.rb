require 'directory_watcher'

module RuhOh
  module Watch
    
    # Internal: Watch website source directory for file changes.
    # The observer triggers data regeneration as files change
    # in order to keep the data up to date in real time.
    #
    #  site_source - Required [String] Path to the root directory 
    #    of the website source files.
    #
    # Returns: Nothing
    def self.start(site_source)
      puts "=> Start watching: #{site_source}"
      glob = ''
      
      # Watch all files + all sub directories except for special folders e.g '_database'
      Dir.chdir(site_source) {
        dirs = Dir['*'].select { |x| File.directory?(x) }
        dirs -= ['_database']
        dirs = dirs.map { |x| "#{x}/**/*" }
        dirs += ['*']
        glob = dirs
      }

      dw = DirectoryWatcher.new(site_source, {
        :glob => glob, 
        :pre_load => true
      })
      dw.interval = 1
      dw.add_observer {|*args| 
        args.each {|event|
          path = event['path'].gsub(site_source, '')

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

