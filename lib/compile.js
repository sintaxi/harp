var path    = require("path")
var fse     = require("fs-extra")
var helpers = require("./helpers")
var parsers = require("./parsers")
var mkdirp  = require("mkdirp")
var fs      = require("fs")
var async   = require("async")
var config  = require('./config')

module.exports = function(projectPath, outputPath, callback){
  if(!callback){
    callback   = outputPath
    outputPath = "output"
  }
  
  if(!outputPath){
    outputPath = "output"
  }
  
  outputPath = path.resolve(projectPath, outputPath)
  var publicPath = path.resolve(projectPath, "public")
  var cfg = config(projectPath)
  
  var parsers = require("./parsers")(cfg, projectPath)
  
  /**
   * Compile and save file
   */
   
  var compileFile = function(file, done){
    parsers.render(file, function(err, data){    
      if(!err){
        var localPath = path.resolve(outputPath, file)
        localPath = localPath.replace(".less", ".css")
        localPath = localPath.replace(".jade", ".html")
        mkdirp(path.dirname(localPath), function(err){
          fs.writeFile(localPath, data, done)
        })
      }else{
        done(err)
      }
    })
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
   
  helpers.ls(publicPath, function(err, results){ 
    async.forEach(results, compileFile, function(err){
      async.forEach(results, copyFile, callback)
    })
  })
}