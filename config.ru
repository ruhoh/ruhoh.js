require 'rack'
#require './_lib/ruhoh'
#Ruhoh.setup
#Ruhoh::Posts.generate
#Ruhoh::Pages.generate
#Ruhoh::Watch.start

use Rack::Lint
use Rack::ShowExceptions
use Rack::Static, {
  :root => '.',
  :urls => ['/_client', '/_database', '/_config.yml', '/_pages', '/_posts', '/_themes']
}

run Proc.new { |env|
  [ 
    200, 
    {
      'Content-Type' => 'text/html', 
      'x-ruhoh-site-source-folder' => '/'
    }, 
    [File.read('./index.html')]
  ]
}
