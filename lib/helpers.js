var fs    = require('fs')
var path  = require('path')

/***
  *
  * Walk directory for files
  * http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
  *
  */

var walk = function(dir, done) {
  var results = []
  
  fs.readdir(dir, function(err, list) {
    if (err) return done(err)
    var pending = list.length
    
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file)
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res)
            if (!--pending) done(null, results)
          })
        } else {
          results.push(file)
          if (!--pending) done(null, results)
        }
      })
    })
  })

}


/***
  *
  * Checks if Object is empty
  * returns true or false
  *
  */
  
var isEmpty = function(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

/***
  *
  * Fetch all the file paths for a directory.
  * returns and array of all the relative paths.
  *
  */
  
exports.ls = function(dir, callback) {
  walk(dir, function(err, results){
    var files = []
    results.map(function(file){ files.push(path.relative(dir, file)) })
    callback(null, files)
  })
}


/***
  *
  * Fetch configuration of a Harp Application.
  * returns object literal with key/val pairs.
  *
  */

exports.config = function(projectPath){
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


/***
  *
  * Walks directory and build the data object.
  *
  * If we call the dataTree on the public dir
  *
  *     public/
  *       |- _data.json
  *       |- articles/
  *       |   `- _data.json
  *       `- people
  *           `- _data.json
  *
  * We get the following...
  *
  *     {
  *       "data": {...},
  *       "articles": {
  *         "data": {...}
  *       },
  *       "people": {
  *         "data": {...}
  *       }
  *     }
  *
  */

exports.dataTree = dataTree = function (filename) {
  var dirPath   = path.resolve(filename)
  var list      = fs.readdirSync(dirPath)
  var obj       = {}

  try{
    var dataPath = path.resolve(dirPath, "_data.json")
    var fileData = fs.readFileSync(dataPath)
    obj.data     = JSON.parse(fileData)
  }catch(e){
    // data file failed or does not exist
  }

  list.forEach(function(file){
    var filePath = path.resolve(dirPath, file)
    var stat     = fs.statSync(filePath)

    if(stat.isDirectory())
      var d = dataTree(filePath)
      if(!isEmpty(d))
        obj[file] = d
  })

  return obj
}

