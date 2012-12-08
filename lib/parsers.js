var jade = require("jade")
var less = require("less")
var path = require("path")
var fs   = require("fs")

exports.jade = function(file, obj, callback){
  var ext   = path.extname(file)
  var base  = path.basename(file)
  
  if(ext !== ".jade" || base[0] === "_"){
    callback("NoMatch")
  }else{
    fs.readFile(file, function(err, data){
      if(err){
        callback(err)
      }else{
        var template = jade.compile(data, { filename: file })
        callback(null, template(obj))        
      }
    })
  }
}

exports.less = function(file, callback){
  var ext   = path.extname(file)
  var base  = path.basename(file)
  
  if(ext !== ".less" || base[0] === "_"){
    callback("NoMatch")
  }else{
    fs.readFile(file, function(err, data){

      if(err){
        callback(err)
      }else{
        // less.render(data.toString(), function(e, css){
        //   callback(null, css)
        // })
        var dir = path.dirname(file)
        var parser = new(less.Parser)({
            paths: [dir], // Specify search paths for @import directives
            filename: file // Specify a filename, for better error messages
        });

        parser.parse(data.toString(), function (e, tree) {
            callback(e, tree.toCSS({ compress: true })); // Minify CSS output
        });

      }
    })
  }
}