var path = require("path")
var fs   = require("fs")
var jade = require("jade")
var parsers = require("./parsers")
var config = require("./config")

module.exports = function(projectPath){
  return {
    
    config: function(req, rsp, next){
      req.harpConfig = config(projectPath)
      next()
    },
    
    process: function(req, rsp, next){
      
      /**
       * Ensure we have a path and an extention.
       */
       
      var ext = path.extname(req.filePath)
      
      // take off query string
      var base = req.url.split('?')[0]

      // normalize path
      var file_path = path.normalize(base)

      // index.html support
      if ('/' == file_path[file_path.length - 1]) file_path += 'index.html'

      // add extension if none exists
      if(path.extname(file_path) === '') file_path += '.html'
      
      file_path = file_path.replace(/^\/|\/$/g, '');
      
      /**
       * Lets do this
       */
       
      var ext = path.extname(file_path)
      
      var processor
      switch (ext){
        case ".html" : 
          processor = ".jade"
          break
        case ".css" : 
          processor = ".less"
          break
        default: null
      }
      
      if(!processor){
        next()
      }else{
        var srcPath = file_path.replace(ext, processor)
        //var publicSrcPath = path.resolve(projectPath, "public", srcPath)
        
        parsers(req.harpConfig, projectPath).render(srcPath, function(err, content){
          if(err){
            next()
          }else{
            rsp.end(content)  
          }
        })
      }
    },

    // jade: function(req, rsp, next){
    //   
    //   // assign current
    //   var locals = req.harpConfig.locals || {}
    //   var current = req.filePath.split(".")[0].split("/")
    //   current.shift()
    //   locals.current = current
    //   
    //   var absolutePath  = path.join(projectPath, "public", req.filePath)
    //   var jadePath      = absolutePath.replace(".html", ".jade")
    //   
    //   parsers.jade(jadePath, locals, function(err, html){
    //     if(err){
    //       if(err === "NoMatch"){
    //         next()
    //       }else{
    //        // TODO: handle jade compile problem 
    //        // perhaps render 500 file?
    //        rsp.end("Page: Not found")
    //       }
    //     }else{
    //       rsp.setHeader("Content-Type", "text/html")
    //       rsp.end(html)
    //     }
    //   })
    // },
    // 
    // less: function(req, rsp, next){
    //   var absolutePath  = path.join(projectPath, "public", req.filePath)
    //   var lessPath      = absolutePath.replace(".css", ".less")
    //   
    //   parsers.less(lessPath, function(err, css){
    //     if(err){
    //       if(err === "NoMatch"){
    //         next()
    //       }else{
    //        // TODO: handle jade compile problem 
    //        // perhaps render 500 file?
    //        rsp.end("Page: Not found")
    //       }
    //     }else{
    //       rsp.setHeader("Content-Type", "text/css")
    //       rsp.end(css)
    //     }
    //   })
    // },
    
    notFound: function(req, rsp){
      rsp.end("Not Found")
    }

  } 
}

