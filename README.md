# harp

## description

Harp is an opinionated static site generator for building apps. It also acts as a server for harp applications.

## install

    npm install -g harp
    
## usage

    Usage: harp [app-path] [options]

    Options:

        -g, --generate                Generates harp project files within current directory (if empty).
        -s, --server                  Start a server for harp app (dynamically compiles).
        -c, --compile <output-dir>    Compiles down to static assets.
        -h, --help                    Output usage information.


## usage as lib

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


