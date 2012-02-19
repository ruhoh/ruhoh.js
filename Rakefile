require "rubygems"
require 'rake'

# nastily stolen from Jekyll. http://github.com/mojombo/jekyll
task :server do
  require 'webrick'
  include WEBrick
  
  port = ENV["port"] || 4000
  base_url = ENV["base_url"] || ''
  
  mime_types = WEBrick::HTTPUtils::DefaultMimeTypes
  mime_types.store 'js', 'application/javascript'

  s = HTTPServer.new(
    :Port            => port,
    :MimeTypes       => mime_types
  )
  s.mount(base_url, HTTPServlet::FileHandler, '.')
  t = Thread.new {
    s.start
  }

  trap("INT") { s.shutdown }
  t.join()
end