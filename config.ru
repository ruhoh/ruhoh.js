require 'rack'
require './_framework/lib/generators'

SiteSource = "#{Dir.pwd}/_framework/sample_kit"

# Generate our data structures
RuhOh::Posts::generate
RuhOh::Pages::generate

use Rack::Lint
use Rack::ShowExceptions
use Rack::Static, :urls => ['/_framework', '/themes'], :root => '.'

run Proc.new { |env|
  [200, {'Content-Type' => 'text/html'}, [File.read('./index.html')]]
}
