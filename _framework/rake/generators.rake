require './_framework/lib/generators'

task :generate => 'generate:all'

namespace :generate do

  # Public: Generate data from the site assets (posts/pages).
  # The data structures are referred to as "dictionaries".
  #
  # Returns: Nothing.
  task :all => ['pages', 'posts']

  task :pages do 
    RuhOh::Pages::generate
  end
  
  task :posts do 
    RuhOh::Posts::generate
  end

end  
