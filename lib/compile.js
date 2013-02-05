var path    = require("path")
var fse     = require("fs-extra")
var helpers = require("./helpers")
var parsers = require("./parsers")
var mkdirp  = require("mkdirp")
var fs      = require("fs")
var async   = require("async")
var config  = require('./config')
var dataTree = require("./data")

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
   * Setup all the paths and colct all the data
   */

  try{
    outputPath      = path.resolve(projectPath, outputPath)
    var publicPath  = path.resolve(projectPath, "public")
    var cfg         = config(projectPath)
    var locals      = dataTree(path.resolve(projectPath, "public"))
    var parsers     = require("./parsers")(locals, projectPath)
  }catch(err){
    return callback({ status: 400, message: "invalid harp configuration", dump: err })
  }

  /**
   * Compile and save file
   */

  console.log("data:")
  console.log(locals)
  console.log("")

  var compileFile = function(file, done){
    try{
      parsers.render(file, function(err, data){
        var localPath = path.resolve(outputPath, file)
        localPath = localPath.replace(".less", ".css")
        localPath = localPath.replace(".jade", ".html")
        mkdirp(path.dirname(localPath), function(err){
          fs.writeFile(localPath, data, done)
        })
      })
    }catch(err){
      done({ status: 400, message: "render error", dump: err })
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
            callback(null, cfg)
          })
        }
      })
    })
  })


}