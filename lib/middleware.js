var path    = require("path")
var fs      = require("fs")
var jade    = require("jade")
var helpers = require("./helpers")
var mime    = require("mime")
var polymer = require('terraform')
var pkg     = require('../package.json')
var cache   = require('./cache')
var _ = require('underscore')

var send = require('../node_modules/connect/node_modules/send')
  , utils = require('../node_modules/connect/lib/utils')
  , parse = utils.parseUrl
  , url = require('url')

var _sentData = function(rsp, data){
  // console.log('call _sentData:', data)
  _.map(data.headers, function(value, key){
    rsp.setHeader(key, value)
  })
  rsp.statusCode = data.statusCode
  rsp.end(data.body)
}

exports.checkCache = function(req, rsp, next){
  var normalizedPath  = helpers.normalizeUrl(req.url)
  var priorityList    = polymer.helpers.buildPriorityList(normalizedPath)
  var sourceFile      = polymer.helpers.findFirstFile(req.setup.publicPath, priorityList)

  if(! sourceFile){
    return next()
  }

  if(sourceFile && cache.getFile(sourceFile)){
    return _sentData(rsp, cache.getFile(sourceFile))
  } else {
    return next()
  }
}

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
    var host      = req.headers.host
    var hostname  = host.split(':')[0]
    var arr       = hostname.split(".")
    var port      = host.split(':')[1] ? ':' + host.split(':')[1] : ''

    if(arr.length == 2){
      fs.readdir(dirPath, function(err, files){
        var projects = []

        files.forEach(function(file){
          if(file.split(".").length == 3){

            var portal = file.split('.')
            portal.shift()

            var local = file.split('.')
            local.pop()
            local.pop()
            local.push(host)

            projects.push({
              "name"      : file,
              "localUrl"  : 'http://' + local.join('.'),
              "remoteUrl" : 'http://' + file,
              "portalUrl" : 'http://' + portal.join('.') + '/apps/' + file,
              "localPath" : path.resolve(dirPath, file)
            })
          }
        })
        var poly = polymer.root(__dirname + "/templates")
        poly.render("index.jade", { pkg: pkg, projects: projects, layout: "_layout.jade" }, function(error, body){
          rsp.end(body)
        })

      })
    }else{
      next()
    }

  }
}

exports.hostProjectFinder = function(dirPath){
  return function(req, rsp, next){
    var host        = req.headers.host
    var hostname    = host.split(':')[0]
    var matches     = []

    fs.readdir(dirPath, function(err, files){

      [".io", ".me"].forEach(function(ext){
        var val = hostname.replace(/\.\w+$/, ext)
        if(files.indexOf(val) !== -1){
          matches.push(val)
        }
      })

      ;[".harpapp.io"].forEach(function(ext){
        var val = hostname.replace(/\.\w+\.\w+$/, ext)
        if(files.indexOf(val) !== -1){
          matches.push(val)
        }
      })

      if(matches.length > 0){
        req.projectPath = path.resolve(dirPath, matches[0])
        next()
      }else{
        rsp.end("Cannot find project")
      }

    })

  }
}

exports.regProjectFinder = function(projectPath){
  return function(req, rsp, next){
    req.projectPath = projectPath
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
      // console.log(typeof path)
      // look for implicit `*.html` if we get a 404
      return (err.path && path.extname(err.path) === '')
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

  try{
    req.setup = helpers.setup(req.projectPath)
  }catch(error){
    error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno })

    var locals = {
      project: req.headers.host,
      error: error
    }

    return polymer.root(__dirname + "/templates").render("error.jade", locals, function(err, body){
      rsp.statusCode = 500
      rsp.end(body)
    })
  }

  next()
}


/**
 * Sets up the poly object
 */

exports.poly = function(req, rsp, next){
  try{
    req.poly = polymer.root(req.setup.publicPath, req.setup.config.globals)
  }catch(error){
    error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno })
    var locals = {
      project: req.headers.host,
      error: error
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
   * let hack the fs, know what file will be opened.
   */

  var _fs_open = fs.open
  var _fs_openSync = fs.openSync
  // configs
  var except_paths = ["node_modules", "_data.json", "harp.json"]

  /* skip files */
  var valid_path = function(path){
    if(
        path.indexOf("node_modules") >= 0 ||
        path.indexOf("_data.json") >= 0 ||
        path.indexOf("harp.json") >= 0
      ){
      return false
    } else {
      return true
    }
  }

  var caller_map = function(caller, func){
    var _caller = caller
    while(true){
      // console.log(_caller)
      if(!_caller){
        return false
      }
      if(_caller === exports.process){
        // it's time to stop, no up
        return false
      }
      if(func(_caller)){
        return true
      }
      _caller = _caller.caller
    }
  }

  var before_open = function(file_path){
    file_path = path.relative(req.projectPath, arguments[0])
    // console.log('Opening', file_path)
    if(valid_path(file_path)){
      caller_map(before_open, function(caller){
        if(caller.__opened_files){
          if(_.indexOf(caller.__opened_files, file_path) < 0 ){
            caller.__opened_files.push(file_path)
            return true
          }
        } else {
          return false
        }
      })
    }
  }

  fs.open = function(){
    before_open(arguments[0])
    return _fs_open.apply(this, arguments)
  }

  fs.openSync = function(){
    before_open(arguments[0])
    return _fs_openSync.apply(this, arguments)
  }

  var __render = function(){
    __render.__opened_files = []
    return req.poly.render.apply(this, arguments)
  }

  /**
   * Now we let Polymer handle the asset pipeline.
   */
  __render(sourceFile, function(error, result){
    var body = null;
    // back to normal fs.open
    fs.open = _fs_open
    fs.openSync = _fs_openSync

    //console.log('Source:', sourceFile,
                //'Opened Files', opened_files)

    if(error){
      error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno })

      var locals = {
        project: req.headers.host,
        error: error
      }
      if(polymer.helpers.outputType(sourceFile) == 'css'){
        rsp.status = 500
        rsp.end(helpers.cssError(locals))
      }else{

        // Make the paths relative but keep the root dir.
        // TODO: move to helper.
        //
        // var loc = req.projectPath.split(path.sep); loc.pop()
        // var loc = loc.join(path.sep) + path.sep
        // if(error.filename) error.filename = error.filename.replace(loc, "")

        polymer.root(__dirname + "/templates").render("error.jade", locals, function(err, body){
          rsp.status = 500
          rsp.end(body)
        })
      }
    } else {
      if(!result) return next() // 404
      if(_.isString(result)){
        body = result
      } else if (_.isObject(result)) {
        // for coffee source map
        body = result.js;
      }

      var outputType = polymer.helpers.outputType(sourceFile)
      var mimeType   = helpers.mimeType(outputType)
      var charset    = mime.charsets.lookup(mimeType)
      var data = {
        'body': body,
        'headers': {
          'Content-Type': mimeType + (charset ? '; charset=' + charset : ''),
          'Content-Length': Buffer.byteLength(body, charset)
        },
        'statusCode': 200
      }
      var _results = {}
      _results[sourceFile] = data
      cache.setCache(_results, __render.__opened_files)
      return _sentData(rsp, data)
    }
  })

}

exports.staticNotFound = function(req, rsp, next) {
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

exports.dynamicNotFound = function(req, rsp, next){
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
}

exports.devFallbackNotFound = function(req, rsp){
  var locals = {
    project: req.headers.host,
    name: "Page Not Found",
    layout: "_layout.jade"
  }
  polymer.root(__dirname + "/templates").render("404.jade", locals, function(err, body){
    rsp.status = 500
    rsp.end(body)
  })
}
