var path    = require("path")
var fs      = require("fs")
var jade    = require("jade")
var helpers = require("./helpers")
var mime    = require("mime")
var polymer = require('polymer')

var send = require('../node_modules/connect/node_modules/send')
  , utils = require('../node_modules/connect/lib/utils')
  , parse = utils.parseUrl
  , url = require('url')


exports.hostProjectFinder = function(dirPath){
  return function(req, rsp, next){
    var host = req.headers.host.split(":")[0]
    var re = new RegExp("harp.nu$")
    
    // harp.nu path
    var iopath    = path.resolve(dirPath, host.replace(re, "harp.io"))
    
    // other paths
    var arr = host.split(".")
    arr.pop(); arr.pop()
    var projectName = arr.join(".")
    var plainpath = path.resolve(dirPath, projectName)
    
    if(fs.existsSync(iopath)){
      req.projectPath = path.resolve(dirPath, iopath)      
    }else{
      req.projectPath = path.resolve(dirPath, plainpath)
    }

    next()
  }
}

exports.regProjectFinder = function(projectPath){
  return function(req, rsp, next){
    req.projectPath = projectPath
    next()
  }
}

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
    if (404 == err.status) return resume();
    next(err);
  }

  send(req, pathn)
    .maxage(options.maxAge || 0)
    .root(path.resolve(req.projectPath, "public"))
    .hidden(options.hidden)
    .on('error', error)
    .on('directory', directory)
    .pipe(res)
}

exports.process = function(req, rsp, next){  
  var contents = fs.readFileSync(path.resolve(req.projectPath, "harp.json"))
  
  if(contents){
    try{
      var config = JSON.parse(contents)
    }catch(e){
      var locals = {
        project: req.projectPath.split("/")[req.projectPath.split("/").length -1],
        type: "Invalid harp.json",
        description: "There appers to be a syntax error in your harp.json file",
        stack: contents
      }
      return polymer.process("error.jade", { root: path.join(__dirname, "templates"), locals: locals }, function(error, info, body){
        rsp.statusCode = 500;
        rsp.setHeader('Content-Length', body.length);
        rsp.end(body)
      })
    }
  }else{
    var config = {}
  }
  
  var globals         = req.globals = helpers.globals(req.projectPath, config.globals, "development")
  var normalizedPath  = helpers.normalizeUrl(req.url)
  var priorityList    = helpers.buildPriorityList(normalizedPath)
  var source          = helpers.findFirstExistingFile(path.join(req.projectPath, "public"), priorityList)
  
  if(!source){
    next()
  }else{
    polymer.process(source, { root: path.join(req.projectPath, "public"), locals: { "globals": globals } }, function(error, info, body){
      if(error){
        if(info.outputType == "css"){
          var body = helpers.cssError({
            source: source,
            message: error.message
          })
          var type    = helpers.mimeType(info.outputType)
          var charset = mime.charsets.lookup(info.outputType)
          rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''))
          rsp.setHeader('Content-Length', body.length);
          rsp.end(body)          
        }else{
          var locals = {
            project: req.projectPath.split("/")[req.projectPath.split("/").length -1],
            type: "Jade Render Error",
            description: "There is an error in your Jade file.",
            stack: error.stack
          }
          polymer.process("error.jade", { root: path.join(__dirname, "templates"), locals: locals }, function(error, info, body){
            rsp.statusCode = 500;
            rsp.setHeader('Content-Length', body.length);
            rsp.end(body)
          })
        }
      }else{
        var type    = helpers.mimeType(source)
        var charset = mime.charsets.lookup(type)
        rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
        rsp.setHeader('Content-Length', body.length);
        rsp.end(body)
      }
    })
  }

}
    
exports.notFound = function(req, rsp){
  polymer.process("404.jade", { root: path.join(req.projectPath, "public"), locals: { "globals": req.globals } }, function(error, info, body){
    var type    = helpers.mimeType("html")
    var charset = mime.charsets.lookup(type)
    rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
    rsp.setHeader('Content-Length', body.length);
    rsp.statusCode = 404;
    rsp.end(body)
  })
}
