var path    = require("path")
var fs      = require("fs")
var jade    = require("jade")
var parsers = require("./parsers")
var helpers = require("./helpers")
var mime    = require("mime")

module.exports = function(projectPath){
  return {
    
    config: function(req, rsp, next){
      req.config = helpers.config(projectPath)
      next()
    },
    
    globals: function(req, rsp, next){
      req.globals = { 
        "environment": process.env.NODE_ENV,
        "public": helpers.dataTree(path.resolve(projectPath, "public"))
      }
      next()
    },
    
    source: function(req, rsp, next){
      
      // get public path
      var publicPath = path.join(projectPath, "public")
      
      // take off query string
      var base = req.url.split('?')[0]

      // normalize path
      var file_path = path.normalize(base)

      // index.html support
      if ('/' == file_path[file_path.length - 1]) file_path += 'index.html'
      
      // get priority list
      var priorityList = helpers.buildPriorityList(file_path)
      
      // find first existing file from list
      req.source = helpers.findFirstExistingFile(publicPath, priorityList)
      
      next()
    },
    
    process: function(req, rsp, next){
      
      if(!req.source){
        next()
      }else{
        parsers(req.globals, projectPath).render(req.source, function(err, content){
          if(err){
            //console.log(err)
            var projectName = projectPath.split("/").pop()
            var output = err.toString().replace(projectPath, projectName)
            console.log('')
            console.log(err)
            console.log('')
            
            if(file_path == "index.html" && err.message.indexOf("ENOENT") !== -1){
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
            var type    = helpers.mimeType(req.source)
            var charset = mime.charsets.lookup(type);
            rsp.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
            
            rsp.end(content)  
          }
        })
      }
    },
    
    notFound: function(req, rsp){
      parsers(req.globals, projectPath).render("404.jade", function(err, html){
        rsp.setHeader("Content-Type", "text/html")
        rsp.end(html)
      })
    }

  } 
}

