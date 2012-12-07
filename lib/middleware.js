var path = require("path")
var fs   = require("fs")
var jade = require("jade")
var parsers = require("./parsers")
var config = require("./config")

module.exports = function(projectPath){
  return {

    filePath: function(req, rsp, next){

      // take off query string
      var base = req.url.split('?')[0]

      // normalize path
      var file_path = path.normalize(base)

      // index.html support
      if ('/' == file_path[file_path.length - 1]) file_path += 'index.html'

      // add extension if none exists
      if(path.extname(file_path) === '') file_path += '.html'

      // set filePath to request object
      req.filePath = file_path

      // call next function
      next()

    },
    
    config: function(req, rsp, next){
      req.harpConfig = config(projectPath)
      next()
    },

    jade: function(req, rsp, next){
      
      // assign current
      var locals = req.harpConfig.locals || {}
      var current = req.filePath.split(".")[0].split("/")
      current.shift()
      locals.current = current
      
      var absolutePath  = path.join(projectPath, "public", req.filePath)
      var jadePath      = absolutePath.replace(".html", ".jade")
      
      parsers.jade(jadePath, locals, function(err, html){
        if(err){
          if(err === "NoMatch"){
            next()
          }else{
           // TODO: handle jade compile problem 
           // perhaps render 500 file?
           rsp.end("Page: Not found")
          }
        }else{
          rsp.setHeader("Content-Type", "text/html")
          rsp.end(html)
        }
      })
    },
    
    notFound: function(req, rsp){
      rsp.end("Not Found")
    }

  } 
}

