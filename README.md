# Harp

> zero-configuration web server with built in pre-processing

### What is Harp?

Harp is a static web server that also serves Jade, Markdown, EJS, Less, Stylus, Sass, and CoffeeScript **as** HTML, CSS, and JavaScript without any configuration. It supports the beloved layout/partial paradigm and it has flexible metadata and global objects for traversing the file system and injecting custom data into templates. Optionally, Harp can also compile your project down to static assets for hosting behind any valid HTTP server.

### Why?

Pre-compilers are becoming extremely powerful and shipping front-ends as static assets has many upsides. It's simple, it's easy to maintain, it's low risk, easy to scale, and requires low cognitive overhead. I wanted a lightweight web server that was powerful enough for me to abandon web frameworks for dead simple front-end publishing.

### Features

- easy installation, easy to use
- fast and lightweight
- robust (clean urls, intelligent path redirects)
- built in pre-processing
- first-class layout and partial support
- built in LRU caching in production mode
- can export assets to HTML/CSS/JS
- does not require a build steps or grunt task
- fun to use

### Supported Pre-Processors

|                 | Language Superset                                                 | Whitespace Sensitive  
| --------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------
| **HTML**        | [EJS](http://embeddedjs.com/)                                     | [Jade](http://jade-lang.com/), [Markdown](http://daringfireball.net/projects/markdown/)
| **CSS**         | [LESS](http://lesscss.org/), [Sass (SCSS)](http://sass-lang.com/) | [Stylus](http://learnboost.github.io/stylus/)
| **JavaScript**  | (TBD)                                                             | [CoffeeScript](http://coffeescript.org/)

### Resources

- **Server Documentation** - [harpjs.com/docs/](http://harpjs.com/docs/)
- **Platform Documentation** - [harp.io/docs](https://harp.io/docs)
- **Source Code** - [github.com/sintaxi/harp](https://github.com/sintaxi/harp)


Authored and maintained by [@sintaxi](http://twitter.com/sintaxi). Made for the [@HarpPlatform](http://twitter.com/HarpPlatform).

---

### Installation

    sudo npm install -g harp

### Quick Start

Creating a new harp application is a breeze...

    harp init myproj
    harp server myproj

Your Harp application is now running at [http://localhost:9000]()

---

## Documentation

Harp can be used as a library or as a command line utility.

### CLI Usage

    Usage: harp [command] [options]

    Commands:

      init [path]                 initalize new harp application (defaults to current directory)
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

    harp compile --output /path/to/cordova/project/www

### Lib Usage

You may also use harp as a node library for compiling or running as a server.

Serve up a harp application...

```js
var harp = require("harp")
harp.server(projectPath [,args] [,callback])
```

**Or** compile harp application

```js
var harp = require("harp")
harp.compile(projectPath [,outputPath] [, callback])
```

**Or** use as Connect/ExpressJS middleware

```js
var express = require("express");
var harp = require("harp");
var app = express();

app.configure(function(){
  app.use(express.static(__dirname + "/public"));
  app.use(harp.mount(__dirname + "/public"));
});
```

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

## License

Copyright 2012 Chloi Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/a0e15683fd92ec96089118f483a112cf "githalytics.com")](http://githalytics.com/sintaxi/harp)