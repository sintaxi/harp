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
  
  // scan dir
  helpers.ls(publicPath, function(err, results){

    // write jade
    async.forEach(results, function(f, cb){
      
      // assign current
      var locals = {}
      
      for(var k in cfg.locals)(function(k){
        locals[k] = cfg.locals[k]
      })(k)
      
      //var locals = cfg.locals || {}
      var current = f.split(".")[0].split("/")
      locals.current = current
      parsers.jade(path.resolve(publicPath, f), locals, function(err, html){
        if(err){
          if(err !== "NoMatch"){
            cb(err)
          }else{
            cb(null)
          }
        }else{
          var outputFilePath = path.resolve(outputPath, f).replace(".jade", ".html")
          var outputDirPath  = path.dirname(outputFilePath)
          mkdirp(outputDirPath, function(){
            fs.writeFile(outputFilePath, html, function(err){
              cb(null)
            })            
          })
        }
      })
    }, function(err){
        
      // compile everything else (expept jade)
      async.forEach(results, function(f, cb){
        var ext = path.extname(f)
        if([".jade"].indexOf(ext) == -1){
          var outputFilePath = path.resolve(outputPath, f)
          var outputDirPath  = path.dirname(outputFilePath)
          mkdirp(outputDirPath, function(err){
            fse.copy(path.resolve(publicPath, f), outputFilePath, cb)  
          })
        }
      }, callback)
      
    })
  })
}