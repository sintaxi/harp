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
        less.render(data.toString(), function(e, css){
          callback(null, css)
        })
      }
    })
  }
}