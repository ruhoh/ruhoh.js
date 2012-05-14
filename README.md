## Ruhoh Front-end Client

This is a proof-of-concept **DEMO** application for a ruhoh parser implemented entirely client-side.

**ruhoh** is a universal static blogging specification as defined here: <http://ruhoh.com>


## How it works

The client allows you to preview a ruhoh compatible blog in your web-browser.
It's made with backbone.js, require.js, mustache.js and jQuery.

There is no File I/O so the client cannot pragmatically scan your blog directory for files.
Currently it merely reads from pre-generated dictionary files contained in the `_database` folder.

## Requirements

- Modern Web Browser
- Localhost Web server

## Run the Application

The client can be launched by spawning a web-server at the application's root directory:

### Ruby

````bash
$ rackup -p9292
```` 
Available at: <http://localhost:9292>

### Python

````bash
$ python -m SimpleHTTPServer
````
Available at: <http://localhost:8000>

<http://www.linuxjournal.com/content/tech-tip-really-simple-http-server-python>

### PHP

#### PHP  5.4.x

    $ php -S localhost:8000

Available at: <http://localhost:8000>

<http://php.net/manual/en/features.commandline.webserver.php>
    
### Javascript - NOT IMPLEMENTED

    $ node server.js

require connect ??
<http://www.senchalabs.org/connect/>

(this flickers a lot and does css as text/plain)    
<http://www.nodebeginner.org/#a-basic-http-server>
<https://gist.github.com/701407>
