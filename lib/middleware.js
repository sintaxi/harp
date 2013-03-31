var path    = require("path")
var fs      = require("fs")
var jade    = require("jade")
var parsers = require("./parsers")
var helpers = require("./helpers")
var mime    = require("mime")

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
  // console.log(req.connection.remoteAddress)
  // console.log(req.url)
  // console.log(req.headers)
  
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
      return jade.renderFile(__dirname + "/templates/error.jade", locals, function(err, html){
        rsp.statusCode = 500;
        rsp.end(html)
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
    
    try{
      parsers({ "globals": globals }, req.projectPath).render(source, function(err, content){
        if(err){
          var projectName = req.projectPath.split("/").pop()
          var output = err.toString().replace(req.projectPath, projectName)

          if(path.basename(source) == "index.html" && err.message.indexOf("ENOENT") !== -1){
            var templ = __dirname + "/templates/start.jade"
          }else{
            var templ = __dirname + "/templates/error.jade"
          }

          rsp.setHeader("Content-Type", "text/html")

          jade.renderFile(templ, { projectName: projectName, error: { title: "Render Error", output: JSON.stringify(err, null, 2) }}, function(e, html){
            rsp.end(html)
          })
        }else{
          // set headers
          var type    = helpers.mimeType(source)
          var charset = mime.charsets.lookup(type);
          rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
          rsp.end(content)  
        }
      })      
    }catch(e){
      var locals = {
        project: req.projectPath.split("/").pop(),
        type: "Jade Template - " + e.name,
        description: "There appers to be a problem in your jade file.",
        stack: e.stack
      }
      jade.renderFile(__dirname + "/templates/error.jade", locals, function(err, html){
        rsp.statusCode = 500;
        rsp.end(html)
      })
    }

  }

}
    
exports.notFound = function(req, rsp){
  parsers({ "globals": req.globals }, req.projectPath).render("404.jade", function(err, html){
    rsp.statusCode = 404
    rsp.setHeader("Content-Type", "text/html")
    rsp.end(html)
  })
}
