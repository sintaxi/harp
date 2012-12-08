var jade = require("jade")
var less = require("less")
var path = require("path")
var fs   = require("fs")

// exports.jade = function(file, obj, callback){
//   var ext   = path.extname(file)
//   var base  = path.basename(file)
//   
//   if(ext !== ".jade" || base[0] === "_"){
//     callback("NoMatch")
//   }else{
//     fs.readFile(file, function(err, data){
//       if(err){
//         callback(err)
//       }else{
//         var template = jade.compile(data, { filename: file })
//         callback(null, template(obj))        
//       }
//     })
//   }
// }
// 
// exports.less = function(file, callback){
//   var ext   = path.extname(file)
//   var base  = path.basename(file)
//   
//   if(ext !== ".less" || base[0] === "_"){
//     callback("NoMatch")
//   }else{
//     fs.readFile(file, function(err, data){
// 
//       if(err){
//         callback(err)
//       }else{
//         var dir = path.dirname(file)
//         var parser = new(less.Parser)({
//             paths: [dir], // Specify search paths for @import directives
//             filename: file // Specify a filename, for better error messages
//         })
// 
//         parser.parse(data.toString(), function (e, tree) {
//             callback(e, tree.toCSS({ compress: true })); // Minify CSS output
//         })
// 
//       }
//     })
//   }
// }

module.exports = function(harpConfig, projectPath){
  
  var jadeCompiler = function(file, callback){
    var srcPath = path.resolve(projectPath, "public", file)
    var locals  = harpConfig.locals
    
    locals.current = file.split(".")[0].split("/")
    
    fs.readFile(srcPath, function(err, data){
      if(err) return callback(err)
      
      var template = jade.compile(data, { filename: srcPath })
      callback(null, template(locals))
    })
  }

  var lessCompiler = function(file, callback){
    var srcPath = path.resolve(projectPath, "public", file)

    fs.readFile(srcPath, function(err, data){
      if(err) return callback(err)      
      var dir = path.dirname(srcPath)

      var parser = new(less.Parser)({
        paths:    [dir],  // Specify search paths for @import directives
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
        callback("NoMatch")
      }
      
      if(base[0] === "_"){
        callback("IgnoreFile")
      }else{
        processor(file, callback)
      }
      
    }
    
  }
  
}












