require 'rack'
require './_lib/ruhoh'

Ruhoh.setup
Ruhoh::Posts.generate
Ruhoh::Pages.generate
Ruhoh::Watch.start

site_source_folder = Ruhoh.config.site_source_path.split('/').pop

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
