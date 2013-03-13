var connect     = require("connect")
var middleware  = require("./middleware")

module.exports = function(dirPath, options, callback){
  options.port = options.port || 8001

  console.log("dirPath", dirPath)
  var projectFinder = (options.hasOwnProperty("hostmode") && options.hostmode === true) 
    ? middleware.hostProjectFinder(dirPath)
    : middleware.regProjectFinder(dirPath)
  
  // server
  connect.createServer(
    projectFinder,
    middleware.static,
    middleware.process,
    middleware.notFound
  ).listen(options.port, callback)

}