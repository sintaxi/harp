var path  = require("path")
var fs    = require("fs")

module.exports = function(projectPath){
  var configPath = path.resolve(projectPath, "harp.json")
  
  if(fs.existsSync(configPath)){
    var contents = fs.readFileSync(configPath)
    var config = contents
      ? JSON.parse(contents)
      : {}    
  }else{
    var config = {}
  }
  
  return config 
}