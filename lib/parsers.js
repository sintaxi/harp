var jade = require("jade")
var less = require("less")
var path = require("path")
var fs   = require("fs")

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
    // var locals = locals
    locals.current = file.split(".")[0].split("/") 
    
    callback(null, scopedPartial(path.resolve(projectPath, "public"), locals)(file))
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
      
      if(base[0] === "_"){
        callback("IgnoreFile")
      }else{
        processor(file, callback)
      }
      
    }
    
  }
  
}
