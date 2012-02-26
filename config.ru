require 'rack'
require './lib/ruhoh'

RuhOh.setup
RuhOh::Posts.generate
RuhOh::Pages.generate
RuhOh::Watch.start

site_source_folder = RuhOh.config.site_source_path.split('/').pop

use Rack::Lint
use Rack::ShowExceptions
use Rack::Static, {
  :root => '.',
  :urls => ['/_client', "/#{site_source_folder}"]
}

run Proc.new { |env|
  [ 
    200, 
    {
      'Content-Type' => 'text/html', 
      'x-ruhoh-site-source-folder' => site_source_folder
    }, 
    [File.read('./index.html')]
  ]
}
