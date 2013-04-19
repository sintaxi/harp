
var path    = require("path")
var fse     = require("fs-extra")
var helpers = require("./helpers")
var parsers = require("./parsers")
var mkdirp  = require("mkdirp")
var fs      = require("fs")
var async   = require("async")
var polymer = require('polymer')
var pkg     = require('../package.json')

module.exports = function(projectPath, outputPath, callback){


  /**
   * Both projectPath and outputPath are optional
   */

  if(!callback){
    callback   = outputPath
    outputPath = "www"
  }

  if(!outputPath){
    outputPath = "www"
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
        "environment": process.env.NODE_ENV || "production"
      }
    }

    // add globals fron config
    //
    if(config.globals){
      for(var key in config.globals){
        globalObj.globals[key] = config.globals[key]
      }
    }

  }catch(err){
    return callback({ status: 400, message: "Invalid harp.json File", dump: err })
  }

  var poly = polymer.root(path.join(projectPath, 'public'), globalObj.globals)

  /**
   * Compile and save file
   */

  var compileFile = function(file, done){

    // TODO: ignore underscore
    //
    poly.render(file, function(error, body){
      if(error){
        done({ status: 400, message: "Template Render Error", dump: error })
      }else{
        if(body){
          var dest = path.resolve(outputPath, polymer.helpers.outputPath(file))
          mkdirp(path.dirname(dest), function(err){
            fs.writeFile(dest, body, done)
          })
        }else{
          done()
        }
      }
    })

  }


  /**
   * Copy File
   */
  // TODO: ignore underscore
  var copyFile = function(file, done){
    var ext = path.extname(file)
    if(!polymer.helpers.shouldIgnore(file) && [".jade", ".less", ".md"].indexOf(ext) === -1){
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
            config['harp_version'] = pkg.version
            delete config.globals
            callback(null, config)
          })
        }
      })
    })
  })

}
