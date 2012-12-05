var connect     = require("connect")
var path        = require("path")
var config      = require("./config")

module.exports = function(projectPath, port){
  var cfg         = config(projectPath)
  var middleware  = require("./middleware")(projectPath)

  // default port
  if(!port) port = 8001

  // get path to public assets
  var publicPath = path.resolve(projectPath, "public")

  // static server
  connect.createServer(
    // first we serve any static file
    connect.static(publicPath),
    middleware.filePath,
    middleware.jade(cfg)
  ).listen(port)

  // output message
  console.log("harp is listening on port", port)

}