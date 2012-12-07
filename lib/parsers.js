var jade = require("jade")
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