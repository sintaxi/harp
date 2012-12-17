var path = require("path")
var fs = require("fs")

var isEmpty = function(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

module.exports = dataTree = function (filename) {
  var dirPath   = path.resolve(filename)
  var basename  = path.basename(dirPath)
  var list      = fs.readdirSync(dirPath)

  try{
    var dataPath = path.resolve(dirPath, "_data.json")
    var fileData = fs.readFileSync(dataPath)
    var data     = JSON.parse(fileData)
  }catch(e){
    var data = {}
  }
    
  list.forEach(function(file){
    var filePath = path.resolve(dirPath, file)
    var stat     = fs.statSync(filePath)
    
    if(stat.isDirectory())
      var d = dataTree(filePath)
      if(!isEmpty(d))
        data[file] = d
  })
  
  return data
}