var connect     = require("connect")
var middleware  = require("./middleware")

module.exports = function(dirPath, port, hostMode){

  // default port
  if(!port) port = 8001
  
  var projectFinder = hostMode 
    ? middleware.hostProjectFinder(dirPath)
    : middleware.regProjectFinder(dirPath)
  
  // server
  connect.createServer(
    projectFinder,
    middleware.static,
    middleware.process,
    middleware.notFound
  ).listen(port)

  // output message
  console.log("harp is listening on port", port)

}