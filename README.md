# Harp

> Harp is an open source Asset Pipeline Framework for developing Front-End applications.

**What is an Asset Pipeline Framework?** An Asset Pipeline Framework offers the best 
tradeoffs between Static Site Generator (such as Jekyll) and a Full Stack Framework such 
as (Ruby on Rails / ExpressJS). Harp comes with a built-in web-server that automatically 
pre-processes [jade](http://jade-lang.com/), [markdown](http://daringfireball.net/projects/markdown/), 
[stylus](http://learnboost.github.io/stylus/), [less](http://lesscss.org/), and [coffeescript](http://coffeescript.org/). Zero 
configuration is required.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quickstart)
- [The Rules (how it works)](#rules)
  - [Rule 1 - Convention over configuration](#rules-1)
  - [Rule 2 - Public directory is public](#rules-2)
  - [Rule 3 - Ignore those which start with underscore](#rules-3)
  - [Rule 4 - Dead simple asset pipeline](#rules-4)
  - [Rule 5 - Flexible metadata](#rules-5)
- [Docs](#docs)
  - [CLI Usage](#cli-usage)
  - [Lib Usage](#lib-usage)
- [Contributing](#contributing)
- [License](#license)

<a name="features"/>
### Features
  - **zero configuration** - just start building your app.
  - **asset pipeline** - built-in asset pipeline for seamlessly serving of [jade](http://jade-lang.com/), [markdown](http://daringfireball.net/projects/markdown/), [stylus](http://learnboost.github.io/stylus/), [less](http://lesscss.org/), and [coffeescript](http://coffeescript.org/) files.
  - **layouts and partials** - the beloved layout/partial templating paradigm you know and love.
  - **global variables** - specify global variables to be available in all your templates.
  - **selected state** - a `current` object is available in all your templates for determining the current page.
  - **traverse filesystem** - iterate over your filesystem to easily generate things like an html5 cache manifest file.
  - **asset ordering** - easy to list the order your assets are referenced.
  - **server** - harp ships with a built-in server (with LRU caching in production mode).

Maintained by [@sintaxi](http://twitter.com/sintaxi). Made for the [@HarpPlatform](http://twitter.com/HarpPlatform).

<a name="installation"/>
### Installation

    npm install -g harp

<a name="quickstart"/>
### Quick Start

Creating a new harp application is a breeze...

    harp init myproj; cd myproj
    harp server
  
Your Harp application is now running at http://localhost:9966
    
<a name="rules"/>
## The Rules

Rather than offering a complex feature set, harp has simple rules on how it works. Harp is a katana, not a swiss army knife. By understanding the rules, one will know how to effectively use harp.

<a name="rules-1"/>
### 1) Convention over Configuration.

Harp will function with as little as a `public/index.html` file and doesn't require any configuration to get going. To add more routes just add more files. All harp's features are based off conventions that you will discover by learning the rest of these rules. Harp is about offering a sane development framework which follows established best practices. Harp is not designed to be everything to everyone, but what it does, it does perfectly.

**Design Rationale:** By using convention over configuration, harp is easier to learn, which makes you more productive. 

**Anatomy of a typical harp application:**

    myapp.harp.io/                    <-- root of your application (assets in the root not served)
      |- harp.json                    <-- configuration, globals goes here.
      +- public/                      <-- your application assets belong in the public dir
          |- _layout.jade             <-- optional layout file
          |- index.jade               <-- must have an index.html or index.jade file
          |- _shared/                 <-- arbitrary directory for shared partials
          |   +- nav.jade             <-- a partial for navigation
          +- articles/                <-- pages in here will have "/articles/" in URL (old school style)
              |- _data.json           <-- articles metadata goes here
              +- hello-world.jade     <-- must have an index.html or index.jade file

<a name="rules-2"/>
### 2) Public Directory is public.

Your `public` directory is required to have a functioning harp application. It defines what will be served publicly and what URLs your application exposes. Public assets belong in the `public` directory and assets outside of the `public` directory will not be served.

    myapp.harp.io/
      |- README.md                    <--- won't be served
      |- secrets.txt                  <--- won't be served
      +- public/                      <--- required public directory
          +- index.html               <--- will be served

<a name="rules-3"/>
### 3) Ignore those which start with underscore.

Any files or directories that begin with underscore will be ignored by the server. This is the recommended naming convention for `layout` and `partial` files. Harp will honour this rule for both files and directories.

**Design Rationale:** By having a simple convention. It is easy to specify and identify which assets will not be served to the end user.

**Example:**

    myapp.harp.io/
      +- public/
          |- index.html               <--- will be served
          |- _some-partial.jade       <--- won't be served
          +- _shared-partials/        <--- won't be served
              +- nav.jade

<a name="rules-4"/>
### 4) Dead simple asset pipeline.

Both `jade` and `less` are built into harp. Just add an extension of `.jade` or `.less` to your file and harp's asset pipeline will do the rest.

Harp knows how to handle jade and less files as html and css respectively. Just add the file, and reference its counterpart.
    
    myfile.jade             ->        myfile.html
    myfile.less             ->        myfile.css

If you like, you may specify which mime type the file will be served with by prefixing the extension with the desired extension.

    myfile.jade             ->        myfile.html
    myfile.xml.jade         ->        myfile.xml

...but this is optional as every extension has a default output extension. The following is the same as above...

    myfile.less             ->        myfile.css
    myfile.css.less         ->        myfile.css

<a name="rules-5"/>
### 5) Flexible metadata

Your files named `_data.json` are special and make data available to templates.

    myapp.harp.io/
      +- public/
          |- index.jade
          +- articles/
              |- _data.json           <-- articles metadata goes here
              |- hello-world.jade     <-- hello world article
              +- hello-brazil.jade    <-- hello brazil article
              
Your `_data.json` file may look contain the following...

    {                                                       <-- avaliable to all templates as globals.public.articles.data
      "hello-world": {                                      <-- because this matches the filename, these variables will be
        "title": "Hello World. My very first Article.",         made available in the hello-world.jade template when being
        "date": "Feb 28, 2013"                                  served. This object is also available in all the templates
      },                                                        as globals.public.articles.data.hello-world.
      "hello-brazil": {
        "title": "Hello Brazil. I like Brazil too.",
        "date": "March 4, 2013"
      }
    }

In our templates we may iterate over the articles with the following in your jade file...

    for article, slug in globals.public.articles.data
      a(href="/articles/#{ slug }")
        h2= article.title

<a name="documentation"/>
## Documentation

Harp can be used as a library or as a command line utility.

<a name="cli-usage"/>
### CLI Usage

    Usage: harp [command] [options]

    Commands:

      init [path]                 initalize new harp application in current directory
      server [path] [options]     start harp server
      compile [path] [options]    compile project to static assets
      multihost [path] [options]  start harp server to host directory of harp apps

    Options:

      -h, --help     output usage information
      -V, --version  output the version number

Start the server in root of your application by running...

    harp server

You may optionally supply a port to listen on...

    harp server --port 8002

Compile an application from the root of your application by running...

    harp compile

You may optionally pass in a path to where you want the compiled assets to go...

    harp compile --output /path/to/phonegap/project/www

<a name="lib-usage"/>
### Lib Usage

You may also use harp as a node library for compiling or running as a server.

    var harp = require("harp")

serve up harp application

    harp.server(projectPath [,args] [,callback])

compile harp application

    harp.compile(projectPath [,outputPath] [, callback])
    
<a name="contributing"/>
## Contributing

### Bug Fixes

If you find a bug you would like fixed. Open up a [ticket](https://github.com/sintaxi/harp/issues/new) with a detailed description of the bug and the expected behaviour. If you would like to fix the problem yourself please do the following steps.

1. Fork it.
2. Create a branch (`git checkout -b fix-for-that-thing`)
3. Commit a failing test (`git commit -am "adds a failing test to demonstrate that thing"`)
3. Commit a fix that makes the test pass (`git commit -am "fixes that thing"`)
4. Push to the branch (`git push origin fix-for-that-thing`)
5. Open a [Pull Request](https://github.com/sintaxi/harp/pulls)

Please keep your branch up to date by rebasing upstream changes from master.

### New Functionality

If you wish to add new functionality to harp, please provide [@sintaxi](mailto:brock@sintaxi.com) a harp application that demonstrates deficiency in current design or desired additional behaviour. You may also submit a pull request with the steps above.

<a name="license"/>
## License

Copyright 2012 Chloi Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


