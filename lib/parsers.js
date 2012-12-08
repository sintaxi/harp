var jade = require("jade")
var less = require("less")
var path = require("path")
var fs   = require("fs")

module.exports = function(harpConfig, projectPath){
  
  var jadeCompiler = function(file, callback){
    var srcPath = path.resolve(projectPath, "public", file)
    
    var locals = {}
    
    for(var key in harpConfig.locals)(function(key){
      locals[key] = harpConfig.locals[key]
    })(key)
    
    locals.current = file.split(".")[0].split("/")
    
    fs.readFile(srcPath, function(err, data){
      if(err) return callback(err)
      
      var template = jade.compile(data, { filename: srcPath })
      try{
        var html = template(locals)
        callback(null, html)
      }catch(e){
        callback(e)
      }
      
    })
  }

  var lessCompiler = function(file, callback){
    var srcPath = path.resolve(projectPath, "public", file)

    fs.readFile(srcPath, function(err, data){
      if(err) return callback(err)
      
      var dirs = [
        path.dirname(srcPath),
        path.dirname(path.resolve(projectPath, "public"))
      ]
      
      var parser = new(less.Parser)({
        paths:    dirs,   // Specify search paths for @import directives
        filename: file    // Specify a filename, for better error messages
      })
      
      parser.parse(data.toString(), function (e, tree) {
        callback(e, tree.toCSS({ 
          compress: true
        }))
      })
      
    })
  }
  
  return {
    
    render: function(file, callback){
      var ext   = path.extname(file)
      var base  = path.basename(file)
      var processor
      switch(ext){
        case ".jade" :
        processor = jadeCompiler
        break
        case ".less" :
        processor = lessCompiler
        break
        default: 
        return callback("NoMatch");
      }
      
      if(base[0] === "_"){
        callback("IgnoreFile")
      }else{
        processor(file, callback)
      }
      
    }
    
  }
  
}
