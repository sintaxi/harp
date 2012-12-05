var path  = require("path")
var fs    = require("fs")

module.exports = function(projectPath){
  var configPath = path.resolve(projectPath, "harp.json")
  
  if(fs.existsSync(config) === true){
    var config = require(configPath)
    console.log("harp.json found:", "yes")
  }else{
    var config = {}
    console.log("harp.json found:", "no")
  }
  
  return config
  
}