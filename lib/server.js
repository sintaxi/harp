var connect     = require("connect")
var path        = require("path")


module.exports = function(projectPath, port){
  var middleware  = require("./middleware")(projectPath)

  // default port
  if(!port) port = 8001

  // get path to public assets
  var publicPath = path.resolve(projectPath, "public")
  
  // static server
  connect.createServer(
    connect.static(publicPath),
    middleware.config,
    middleware.locals,
    middleware.process,
    middleware.notFound
  ).listen(port)

  // output message
  console.log("harp is listening on port", port)

}