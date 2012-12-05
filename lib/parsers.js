var jade = require("jade")
var path = require("path")
var fs   = require("fs")

exports.jade = function(file, obj, callback){  
  var ext   = path.extname(file)
  var base  = path.basename(file)
  
  if(ext !== ".jade" || base[0] === "_"){
    callback("NoMatch")
  }else{
    fs.readFile(file, function(err, contents){
      jade.render(contents.toString(), obj, callback)
    })
  }
}