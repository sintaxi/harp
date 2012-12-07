var path  = require("path")
var fs    = require("fs")

module.exports = function(projectPath, callback){
  var configPath = path.resolve(projectPath, "harp.json")
  
  var contents = fs.readFileSync(configPath)
  
  // TODO: make this graceful
  config = contents
    ? JSON.parse(contents)
    : {}
  
  return config 
}