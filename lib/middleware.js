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
        parsers(req.harpConfig, projectPath).render(srcPath, function(err, content){
          if(err){
            var projectName = projectPath.split("/").pop()
            var output = err.toString().replace(projectPath, projectName)
            console.log('')
            console.log(output)
            console.log('')
            
            if(file_path == "index.html" && err.message.indexOf("ENOENT") !== -1){
              var templ = __dirname + "/templates/start.jade"
            }else{
              var templ = __dirname + "/templates/error.jade"
            }
            rsp.setHeader("Content-Type", "text/html")
            jade.renderFile(templ, { projectName: projectName, error: { title: "Jade Render Error", output: output }}, function(e, html){
              rsp.end(html)
            })
          }else{
            if(ext == ".html") rsp.setHeader("Content-Type", "text/html")  
            rsp.end(content)  
          }
        })
      }
    },
    
    notFound: function(req, rsp){
      parsers(req.harpConfig, projectPath).render("404.jade", function(err, html){
        rsp.setHeader("Content-Type", "text/html")
        rsp.end(html)
      })
    }

  } 
}

