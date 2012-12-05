var path = require("path")
var fs   = require("fs")
var jade = require("jade")
var parsers = require("./parsers")

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

    jade: function(cfg){
      
      return function(req, rsp, next){
        var absolutePath  = path.join(projectPath, "public", req.filePath)
        var jadePath      = absolutePath.replace(".html", ".jade")
      
        parsers.jade(jadePath, {}, function(err, html){
          if(err){
            if(err == "NoMatch"){
              next()
            }else{
             // TODO: handle jade compile problem 
             // perhaps render 500 file?
             rsp.end(err)
            }
          }else{
            rsp.setHeader("Content-Type", "text/html")
            rsp.end(html)
          }
        })
      }
      
    }

  } 
}

