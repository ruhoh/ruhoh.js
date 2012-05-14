
task :m do
  Ruhoh::Generate.test
end

task :generate => 'generate:all'

namespace :generate do

  # Public: Generate data from the site assets (posts/pages).
  # The data structures are referred to as "dictionaries".
  #
  # Returns: Nothing.
  task :all => ['pages', 'posts']

  task :pages do 
    Ruhoh::Pages::generate
  end
  
  task :posts do
    Ruhoh::Posts::generate
  end

end  
