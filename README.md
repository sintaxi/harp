# harp

## description

Harp is an open source static site generator for rapidly building responsive HTML5 applications.

What makes Harp unique is that is has a Platform built from the ground up for hosting Harp applications through Dropbox. See [harp.io](http://harp.io) for more details.

Harp makes it easy to build single codebase applications for PhoneGap.

## features

  - *Asset Pipeline:* built-in asset pipeline for seamlessly serving of `jade` and `less` files.
  - *Selected State:* harp gives you helpers for determining current page on every request.
  - *AppCache:* auto-generates html `cache manifest` file for offline support (coming soon)
  - *Server:* harp ships with a built-in server (great for development).
  - *PhoneGap:* dead simple way to generate your `www` folder for PhoneGap.

## install

Harp may be install as a global package by running the following...

    npm install -g harp

## anatomy of a harp application

    yourproject/                  <-- root of your application
      |
      |- public                   <-- your application assets belong in the public dir
      |   |
      |   ` index.jade            <-- must have an index.html or index.jade file
      |
      `- harp.json                <-- configuration and such goes here

## run the server

Start the server in root of your application by running...

    harp -s
    
You may optionally supply a port for the assets...

    harp -s 8002
    
## compile the assets

Compile an application from the root of your application by running...

    harp -c
    
You may optionally pass in a path to where you want the compiled assets to go...

    harp -c /path/to/phonegap/project/www

## cli usage

    Usage: harp [app-path] [options]

    Options:

        -g, --generate                Generates harp project files within current directory (if empty).
        -s, --server                  Start a server for harp app (dynamically compiles).
        -c, --compile <output-dir>    Compiles down to static assets.
        -h, --help                    Output usage information.


## lib usage

You may also use harp as a node library for compiling or running as a server.

    var harp = require("harp")

serve up harp application

    harp.server(projectPath, port)

compile harp application

    harp.compile(projectPath, outputPath, callback)

## license

Copyright 2011/2012 Chloi Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


