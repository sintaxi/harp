var jade    = require("jade")
var less    = require("less")
var path    = require("path")
var fs      = require("fs")
var helpers = require("./helpers")

module.exports = function(locals, projectPath){
  
  var jadeCompiler = function(file, callback){
    
    var scopedPartial = function(dirname, partentLocals){
      
      // allow zero locals
      if(!partentLocals)
        partentLocals = {}

      // return partial function
      return function(relPath, partialLocals){
        
        // add ext if it does not exist
        if(path.extname(relPath) != ".jade") relPath += ".jade"
        
        // resolve paths
        var filePath      = path.resolve(dirname, relPath)
        var fileContents  = fs.readFileSync(filePath)
        var render        = jade.compile(fileContents, { filename: filePath })
        var locals        = {}

        // copy over the parentLocals
        for(var local in partentLocals)
          locals[local] = partentLocals[local]

        // copy over the locals
        for(var local in partialLocals)
          locals[local] = partialLocals[local]

        // pass a properly scoped partial function as a local
        locals.partial  = scopedPartial(path.dirname(filePath), locals)

        // render the partial
        return render(locals)
      }
    }
    
    // set current before starting
    var namespace = file.split(".")[0].split("/")
    
    locals.current = {
      source: namespace[namespace.length -1],
      path: namespace
    }
    
    // copy over the templateLocals
    var templateLocals = helpers.walkData(namespace, locals.globals.public)
    
    for(var local in templateLocals)
      locals[local] = templateLocals[local]
    
    // render partial
    var html = scopedPartial(path.resolve(projectPath, "public"), locals)(file)

    ////////////////////
    // layout
    ////////////////////
    
    if(templateLocals && templateLocals.hasOwnProperty("layout")){
      if(templateLocals["layout"] === false){
        var customLayoutPath = false
      }else{
        var customLayoutPath = path.resolve(projectPath, "public", templateLocals["layout"])
      }
    }else{
      // relative layout
      var absolutePath  = path.resolve(projectPath, "public", file)
      var dirname       = path.dirname(absolutePath)
      var layoutPath    = path.resolve(dirname, "_layout.jade")

      // default layout
      var defaultLayoutPath = path.resolve(projectPath, "public", "_layout.jade")      
    }
    
    if(customLayoutPath !== false){
      if(fs.existsSync(customLayoutPath)){
        locals.yield = html
        var html = scopedPartial(path.resolve(projectPath, "public"), locals)(customLayoutPath)
      }else if(fs.existsSync(layoutPath)){
        locals.yield = html
        var html = scopedPartial(path.resolve(projectPath, "public"), locals)(layoutPath) 
      }else if(fs.existsSync(defaultLayoutPath)){
        locals.yield = html
        var html = scopedPartial(path.resolve(projectPath, "public"), locals)(defaultLayoutPath)
      }      
    }
    
    callback(null, html)
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
      
      parser.parse(data.toString(), function (err, tree) {
        try{
          var css = tree.toCSS({ compress: true })
          callback(e, css)          
        }catch(e){
          callback(e)
        }
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
      
      var arr = file.split(path.sep)
      var shouldProcess = arr.map(function(i){ return i.indexOf("_") }).indexOf(0) === -1
      
      if(shouldProcess){
        processor(file, callback)
      }else{
        callback("IgnoreFile")
      }
      
    }
    
  }
  
}
