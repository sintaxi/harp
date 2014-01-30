var path    = require("path")
var fs      = require("fs")
var helpers         = require("./helpers")
var mime            = require("mime")
var polymer         = require('terraform')
var pkg             = require('../package.json')
var skin            = require('./skin')
var connect         = require('connect')

var send = require('../node_modules/connect/node_modules/send')
  , utils = require('../node_modules/connect/lib/utils')
  , parse = utils.parseUrl
  , url = require('url')

exports.notMultihostURL = function(req, rsp, next){
  var host      = req.headers.host
  var hostname  = host.split(':')[0]
  var arr       = hostname.split(".")
  var port      = host.split(':')[1] ? ':' + host.split(':')[1] : ''

  if(hostname == "127.0.0.1" || hostname == "localhost"){
    rsp.statusCode = 307
    rsp.setHeader('Location', 'http://harp.nu' + port)
    rsp.end("redirecting you to http://harp.nu" + port)
  }else if(arr.length == 4){
    arr.pop()
    arr.push('io')
    var link = 'http://' + arr.join('.') + port
    var body = "Local server does not support history. Perhaps you are looking for <href='" + link + "'>" + link + "</a>."
    rsp.statusCode = 307
    rsp.end(body)
  }else if(arr.length > 4){
    arr.shift()
    var link = 'http://' + arr.join('.') + port
    rsp.statusCode = 307
    rsp.setHeader('Location', link)
    rsp.end("redirecting you to " + link)
  }else{
    next()
  }
}

exports.index = function(dirPath){
  return function(req, rsp, next){
    var host      = req.headers.host;
    var hostname  = host.split(':')[0];
    var arr       = hostname.split(".");
    var port      = host.split(':')[1] ? ':' + host.split(':')[1] : '';
    var poly      = polymer.root(__dirname + "/templates");

    if(arr.length == 2){
      fs.readdir(dirPath, function(err, files){
        var projects = [];

        files.forEach(function(file){
          var local = file.split('.');
          var appPart = local.shift();

          // DOT files are ignored.
          if (file[0] !== ".") {
            projects.push({
              "name"      : file,
              "localUrl"  : 'http://' + appPart + "." + host,
              "localPath" : path.resolve(dirPath, file)
            });
          }
        });
        
        poly.render("index.jade", { pkg: pkg, projects: projects, layout: "_layout.jade" }, function(error, body){
          rsp.end(body)
        });

      })
    } else {
      next();
    }

  }
}

exports.hostProjectFinder = function(dirPath){
  return function(req, rsp, next){
    var host        = req.headers.host;
    var hostname    = host.split(':')[0];
    var matches     = [];

    fs.readdir(dirPath, function(err, files){
      var appPart = hostname.split(".")[0];

      files.forEach(function(file){
        var fp = file.split('.');
        if (appPart == fp[0]) {
          matches.push(file);
        }
      });

      if(matches.length > 0){
        req.projectPath = path.resolve(dirPath, matches[0]);
        next();
      } else {
        rsp.end("Cannot find project")
      }

    });
  }
}

exports.regProjectFinder = function(projectPath){
  return function(req, rsp, next){
    req.projectPath = projectPath
    next()
  }
}


/**
 * Fallbacks
 *
 * This is the logic behind rendering fallback files.
 *
 *  1. return static 200.html file
 *  2. compile and return 200.xxx
 *  3. return static 404.html file
 *  4. compile and return 404.xxx file
 *  5. default 404
 *
 * It is broken into two public functions `fallback`, and `notFound`
 *
 */

var fallback = exports.fallback = function(req, rsp, next){
  skin(req, rsp, [custom200static, custom200dynamic, notFound], next)
}

var notFound = exports.notFound = function(req, rsp, next){
  skin(req, rsp, [custom404static, custom404dynamic, default404], next)
}


/**
 * Custom 200
 *
 *  1. return static 200.html file
 *  2. compile and return 200.xxx file
 *
 */

var custom200static = function(req, rsp, next){
  fs.readFile(path.resolve(req.setup.publicPath, "200.html"), function(err, contents){
    if(contents){
      var body    = contents.toString()
      var type    = helpers.mimeType("html")
      var charset = mime.charsets.lookup(type)
      rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''))
      rsp.setHeader('Content-Length', body.length)
      rsp.statusCode = 200
      rsp.end(body)
    }else{
      next()
    }
  })
}

/**
 * Custom 200 (jade, md, ejs)
 *
 *  1. return static 200.html file
 *  2. compile and return 404.xxx file
 *
 */

var custom200dynamic = function(req, rsp, next){
  skin(req, rsp, [poly], function(){
    var priorityList  = polymer.helpers.buildPriorityList("200.html")
    var sourceFile    = polymer.helpers.findFirstFile(req.setup.publicPath, priorityList)
    if(!sourceFile) return next()

    req.poly.render(sourceFile, function(error, body){
      if(error){
        // TODO: make this better
        rsp.statusCode = 404;
        rsp.end("There is an error in your " + sourceFile + " file")
      }else{
        if(!body) return next()
        var type    = helpers.mimeType("html")
        var charset = mime.charsets.lookup(type)
        rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
        rsp.setHeader('Content-Length', body.length);
        rsp.statusCode = 200;
        rsp.end(body)
      }
    })
  })
}


/**
 * Custom 404 (html)
 *
 *  1. return static 404.html file
 *  2. compile and return 404.xxx file
 *
 * TODO: cache readFile IO
 *
 */

var custom404static = function(req, rsp, next){
  fs.readFile(path.resolve(req.setup.publicPath, "404.html"), function(err, contents){
    if(contents){
      var body    = contents.toString()
      var type    = helpers.mimeType("html")
      var charset = mime.charsets.lookup(type)
      rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''))
      rsp.setHeader('Content-Length', body.length)
      rsp.statusCode = 404
      rsp.end(body)
    }else{
      next()
    }
  })
}


/**
 * Custom 404 (jade, md, ejs)
 *
 *  1. return static 404.html file
 *  2. compile and return 404.xxx file
 *
 */

var custom404dynamic = function(req, rsp, next){
  skin(req, rsp, [poly], function(){
    var priorityList  = polymer.helpers.buildPriorityList("404.html")
    var sourceFile    = polymer.helpers.findFirstFile(req.setup.publicPath, priorityList)
    if(!sourceFile) return next()

    req.poly.render(sourceFile, function(error, body){
      if(error){
        // TODO: make this better
        rsp.statusCode = 404;
        rsp.end("There is an error in your " + sourceFile + " file")
      }else{
        if(!body) return next()
        var type    = helpers.mimeType("html")
        var charset = mime.charsets.lookup(type)
        rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
        rsp.setHeader('Content-Length', body.length);
        rsp.statusCode = 404;
        rsp.end(body)
      }
    })
  })
}


/**
 * Default 404
 *
 * No 200 nor 404 files were found.
 *
 */

var default404 = function(req, rsp, next){
  var locals = {
    project: req.headers.host,
    name: "Page Not Found",
    pkg: pkg
  }
  polymer.root(__dirname + "/templates").render("404.jade", locals, function(err, body){
    var type    = helpers.mimeType("html")
    var charset = mime.charsets.lookup(type)
    rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
    rsp.statusCode = 404
    rsp.setHeader('Content-Length', body.length);
    rsp.end(body)
  })
}


/**
 * Underscore
 *
 * Returns 404 if path contains beginning underscore
 *
 */
exports.underscore = function(req, rsp, next){
  if(polymer.helpers.shouldIgnore(req.url)){
    notFound(req, rsp, next)
  }else{
    next()
  }
}

/**
 * Modern Web Language
 *
 * Returns 404 if file is a precompiled
 *
 */
exports.mwl = function(req, rsp, next){
  var ext = path.extname(req.url).replace(/^\./, '')

  if(polymer.helpers.processors["html"].indexOf(ext) !== -1 || polymer.helpers.processors["css"].indexOf(ext) !== -1 || polymer.helpers.processors["js"].indexOf(ext) !== -1){
    notFound(req, rsp, next)
  }else{
    next()
  }
}

/**
 * Static
 *
 * Serves up static page (if it exists).
 *
 */
exports.static = function(req, res, next) {
  var options  = {}
  var redirect = true

  if ('GET' != req.method && 'HEAD' != req.method) return next();
  var pathn = parse(req).pathname;
  var pause = utils.pause(req);

  function resume() {
    next();
    pause.resume();
  }

  function directory() {
    if (!redirect) return resume();
    var pathname = url.parse(req.originalUrl).pathname;
    res.statusCode = 301;
    res.setHeader('Location', pathname + '/');
    res.end('Redirecting to ' + utils.escape(pathname) + '/');
  }

  function error(err) {
    if (404 == err.status){
      // look for implicit `*.html` if we get a 404
      return path.extname(err.path) === ''
        ? serve(pathn + ".html")
        : resume()
    }
    next(err);
  }

  var serve = function(pathn){
    send(req, pathn)
    .maxage(options.maxAge || 0)
    .root(req.setup.publicPath)
    .hidden(options.hidden)
    .on('error', error)
    .on('directory', directory)
    .pipe(res)
  }

  serve(pathn)

}

/**
 * Opens the (optional) harp.json file and sets the config settings.
 */

exports.setup = function(req, rsp, next){
  if(req.hasOwnProperty('setup')) next()

  try{
    req.setup = helpers.setup(req.projectPath)
  }catch(error){
    error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno })

    var locals = {
      project: req.headers.host,
      error: error,
      pkg: pkg
    }

    return polymer.root(__dirname + "/templates").render("error.jade", locals, function(err, body){
      rsp.statusCode = 500
      rsp.end(body)
    })
  }

  next()
}

/**
 * Basic Auth
 */

exports.basicAuth = function(req, rsp, next){

  // default empty
  var creds = []

  // allow array
  if(req.setup.config.hasOwnProperty("basicAuth") && req.setup.config["basicAuth"] instanceof Array)
    creds = req.setup.config["basicAuth"]

  // allow string
  if(req.setup.config.hasOwnProperty("basicAuth") && typeof req.setup.config["basicAuth"] === 'string')
    creds = [req.setup.config["basicAuth"]]

  // move on if no creds
  if(creds.length === 0) return next()

  // use connect auth lib iterate over all creds provided
  connect.basicAuth(function(user, pass){
    return creds.some(function(cred){
      return cred === user + ":" + pass
    })
  })(req, rsp, next)
}

/**
 * Sets up the poly object
 */

var poly = exports.poly = function(req, rsp, next){
  if(req.hasOwnProperty("poly")) return next()

  try{
    req.poly = polymer.root(req.setup.publicPath, req.setup.config.globals)
  }catch(error){
    error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno })
    var locals = {
      project: req.headers.host,
      error: error,
      pkg: pkg
    }
    return polymer.root(__dirname + "/templates").render("error.jade", locals, function(err, body){
      rsp.statusCode = 500
      rsp.end(body)
    })
  }
  next()
}


/**
 * Asset Pipeline
 */

exports.process = function(req, rsp, next){
  var normalizedPath  = helpers.normalizeUrl(req.url)
  var priorityList    = polymer.helpers.buildPriorityList(normalizedPath)
  var sourceFile      = polymer.helpers.findFirstFile(req.setup.publicPath, priorityList)

  /**
   * We GTFO if we don't have a source file.
   */

  if(!sourceFile) return next()


  /**
   * Now we let Polymer handle the asset pipeline.
   */

  req.poly.render(sourceFile, function(error, body){
    if(error){
      error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno })

      var locals = {
        project: req.headers.host,
        error: error,
        pkg: pkg
      }
      if(polymer.helpers.outputType(sourceFile) == 'css'){
        var outputType = polymer.helpers.outputType(sourceFile)
        var mimeType   = helpers.mimeType(outputType)
        var charset    = mime.charsets.lookup(mimeType)
        var body       = helpers.cssError(locals)
        rsp.statusCode = 200
        rsp.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''))
        rsp.setHeader('Content-Length', Buffer.byteLength(body, charset))
        rsp.end(body)
      }else{

        // Make the paths relative but keep the root dir.
        // TODO: move to helper.
        //
        // var loc = req.projectPath.split(path.sep); loc.pop()
        // var loc = loc.join(path.sep) + path.sep
        // if(error.filename) error.filename = error.filename.replace(loc, "")

        polymer.root(__dirname + "/templates").render("error.jade", locals, function(err, body){
          var mimeType   = helpers.mimeType('html')
          var charset    = mime.charsets.lookup(mimeType)
          rsp.statusCode = 500
          rsp.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''))
          rsp.setHeader('Content-Length', Buffer.byteLength(body, charset))
          rsp.end(body)
        })
      }
    }else{
      // 404
      if(!body) return next()

      var outputType = polymer.helpers.outputType(sourceFile)
      var mimeType   = helpers.mimeType(outputType)
      var charset    = mime.charsets.lookup(mimeType)
      rsp.statusCode = 200
      rsp.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''))
      rsp.setHeader('Content-Length', Buffer.byteLength(body, charset));
      rsp.end(body);
    }
  })

}
