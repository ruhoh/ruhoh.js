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
  :urls => ['/_client', '/themes', "/#{site_source_folder}", '/ruhoh.json']
}

run Proc.new { |env|
  [200, {'Content-Type' => 'text/html'}, [File.read('./index.html')]]
}
