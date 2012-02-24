require 'rack'
require './_framework/lib/generators'
require './_framework/lib/watch'

SiteSource = "#{Dir.pwd}/_framework/sample_kit"

# Generate our data structures
RuhOh::Posts::generate
RuhOh::Pages::generate

# Watch site files for changes.
# Change events trigger data structure regeneration.
RuhOh::Watch::start(SiteSource)

use Rack::Lint
use Rack::ShowExceptions
use Rack::Static, :urls => ['/_framework', '/themes'], :root => '.'

run Proc.new { |env|
  [200, {'Content-Type' => 'text/html'}, [File.read('./index.html')]]
}
