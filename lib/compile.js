var path = require("path")
var fse  = require("fs-extra")

module.exports = function(projectPath, outputPath, callback){
  if(!callback){
    callback   = outputPath
    outputPath = "output"
  }
  
  if(!outputPath){
    outputPath = "output"
  }
  
  outputPath = path.resolve(projectPath, outputPath)
  var publicPath = path.resolve(projectPath, "public")
  fse.copy(publicPath, outputPath, function(err){
    if(err){
      callback(err)
    }else{
      callback(null, outputPath)
    }
  })
}