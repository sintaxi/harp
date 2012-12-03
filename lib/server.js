var connect = require("connect")
var path    = require("path")

module.exports = function(projectPath, port){
  
  // default port
  if(!port) port = 8001
  
  // get path to public assets
  var publicPath = path.resolve(projectPath, "public")
  
  // static server
  connect.createServer(connect.static(publicPath)).listen(port)
  
  // output message
  console.log("harp is listening on port", port)
  
}