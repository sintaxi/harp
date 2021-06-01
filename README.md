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

- [EJS](https://ejs.co/)
- [Jade](http://jade-lang.com/)
- [Markdown](http://daringfireball.net/projects/markdown/) (Unsanitized)
- [Sass (SCSS)](http://sass-lang.com/)
- [Sass](http://sass-lang.com/)

### Resources

- **Server Documentation** - [harpjs.com/docs/](http://harpjs.com/docs/)
- **Source Code** - [github.com/sintaxi/harp](https://github.com/sintaxi/harp)

Authored and maintained by [@sintaxi](http://twitter.com/sintaxi).

---

### Installation

    sudo npm install -g harp

### Quick Start

Start Harp server by pointing oit

    mkdir ./public
    harp  ./public

Your Harp application is now running at [http://localhost:9000](http://localhost:9000)
You can now fill your project with ejs, jade, md, sass, scss files to be processed autmatically.

Compile your project...

    harp ./public ./build

Yor dist folder is now ready to be published at a static host such as [Surge.sh](https://surge.sh)

---

## Documentation

Harp can be used as a library or as a command line utility.

### CLI Usage

```
 
  Harp 〜 Static Web Server v0.40.0

  USAGE
    harp <source>                                   serves project locally
    harp <source> <build>                           compiles for static host

  OPTIONS
    -p, --port                      9000            server port to listen on
    -h, --host                      0.0.0.0         server host to answer to
    -h, --help                                      server/compile keep whitespace
    -v, --version                                   server/compile keep whitespace

 ╭───────────────────────────────────────────────────────────────────────────────╮
 │                                                                               │
 │  PROCESSING                          DATA                                     │
 │    .ejs  ->  .html                     _data.json  -  directory data          │
 │    .jade ->  .html                     _data.js    -  dynamic build data      │
 │    .md   ->  .html                                                            │
 │    .sass ->  .css                    GENERATION                               │
 │    .scss ->  .css                      partial("_path/to/partial", {          │
 │    .cjs  ->  .js                         "title": "Hello World"               │
 │    .jsx  ->  .js                       })                                     │
 │                                                                               │
 ╰───────────────────────────────────────────────────────────────────────────────╯

```

### Lib Usage

You may also use harp as a node library for compiling or running as a server.

Serve up a harp application...

```js
var harp = require("harp")
harp.server(projectPath [,args])
server.listen(port, host)
```

**Or** compile harp application

```js
var harp = require("harp")
harp.compile(projectPath [,outputPath] [, callback])
```

**Or** use as Connect/ExpressJS middleware

```js

```

```js 
// Express
var express = require("express");
var harp = require("harp");
var app = express();

app.use(express.static(__dirname + "/public"));
app.use(harp.mount(__dirname + "/public"));

app.listen(port, host)
```


## License

Copyright © 2012–2021 [Chloi Inc](http://chloi.io). All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
