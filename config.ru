require 'rack'

use Rack::Lint
use Rack::CommonLogger
use Rack::ShowExceptions
use Rack::Static, :urls => ['/_framework', '/themes'], :root => '.'

run Proc.new { |env|
  [200, {'Content-Type' => 'text/html'}, [File.read('./index.html')]]
}
