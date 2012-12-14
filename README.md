# Harp
----------------

Harp is an open source static site generator for rapidly building responsive HTML5 applications. What makes Harp unique is that is has a Platform built from the ground up for hosting Harp applications through Dropbox. See [harp.io](http://harp.io) for more details.

### Features

  - **asset pipeline** - built-in asset pipeline for seamlessly serving of [jade](http://jade-lang.com/) and [less](http://lesscss.org/) files.
  - **local variables** - specify local data in `harp.json` file for passing local variables into your templates.
  - **selected state** - harp passes in a `current` variable on every request for determining the current page.
  - **app cache** - auto-generates html `cache manifest` file for offline support (coming soon).
  - **server** - harp ships with a built-in server (great for development).

### Uses

  - building **mobile web** applications. Or **hybrid** applications (via PhoneGap)
  - **client-side** web applications with frameworks such as Backbone
  - keeping a **blog**
  - building an maintaining **documentation**
  - experiments and demos

# Quick Start
-----------------

### Install

Harp may be installed as a global package by running the following...

    npm install -g harp

### Anatomy of a Harp Application

    yourproject/                  <-- root of your application
      |
      |- public/                  <-- your application assets belong in the public dir
      |   |
      |   ` index.jade            <-- must have an index.html or index.jade file
      |
      `- harp.json                <-- configuration, locals goes here.

### Run the Server

Start the server in root of your application by running...

    harp -s
    
You may optionally supply a port to listen on...

    harp -s 8002
    
### Compile the Assets

Compile an application from the root of your application by running...

    harp -c
    
You may optionally pass in a path to where you want the compiled assets to go...

    harp -c /path/to/phonegap/project/www

# Documentation
--------------------

### CLI Usage

    Usage: harp [app-path] [options]

    Options:

        -g, --generate                Generates harp project files within current directory (if empty).
        -s, --server                  Start a server for harp app (dynamically compiles).
        -c, --compile <output-dir>    Compiles down to static assets.
        -h, --help                    Output usage information.


### Lib Usage

You may also use harp as a node library for compiling or running as a server.

    var harp = require("harp")

serve up harp application

    harp.server(projectPath, port)

compile harp application

    harp.compile(projectPath, outputPath, callback)

## License

Copyright 2012 Chloi Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


