var path    = require("path")
var fse     = require("fs-extra")
var helpers = require("./helpers")
var parsers = require("./parsers")
var mkdirp  = require("mkdirp")
var fs      = require("fs")
var async   = require("async")

module.exports = function(projectPath, outputPath, callback){

  /**
   * Both projectPath and outputPath are optional
   */

  if(!callback){
    callback   = outputPath
    outputPath = "output"
  }

  if(!outputPath){
    outputPath = "output"
  }

  /**
   * Setup all the paths and collect all the data
   */

  try{
    outputPath      = path.resolve(projectPath, outputPath)
    var publicPath  = path.resolve(projectPath, "public")
    var config      = helpers.config(projectPath)
    
    var globalObj = {
      "globals": {
        "environment": process.env.NODE_ENV || "production",
        "public": helpers.dataTree(path.resolve(projectPath, "public"))
      }
    }

    // add globals fron config
    //      
    if(config.globals){
      for(var k in config.globals){
        globalObj.globals[k] = config.globals[k]
      }
    }
    
    var parsers = require("./parsers")(globalObj, projectPath)
  }catch(err){
    return callback({ status: 400, message: "invalid harp configuration", dump: err })
  }

  /**
   * Compile and save file
   */

  var compileFile = function(file, done){
    try{
      parsers.render(file, function(err, data){
        var dest = path.resolve(outputPath, helpers.outputFilename(file))
        mkdirp(path.dirname(dest), function(err){
          if(data){
            fs.writeFile(dest, data, done)
          }else{
            done()
          }
        })
      })
    }catch(err){
      done({ status: 400, message: "template render error", dump: err })
    }

  }

  /**
   * Copy File
   */

  var copyFile = function(file, done){
    var ext = path.extname(file)
    if([".jade", ".less"].indexOf(ext) === -1){
      var localPath = path.resolve(outputPath, file)
      mkdirp(path.dirname(localPath), function(err){
        fse.copy(path.resolve(publicPath, file), localPath, done)
      })
    }else{
      done()
    }
  }

  /**
   * Scan dir, Compile Less and Jade, Copy the others
   */
  fse.remove(outputPath, function(err){
    helpers.ls(publicPath, function(err, results){
      async.forEach(results, compileFile, function(err){
        if(err){
          callback(err)
        }else{
          async.forEach(results, copyFile, function(err){
            callback(null, config)
          })
        }
      })
    })
  })


}