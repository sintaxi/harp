var fs    = require('fs')
var path  = require('path')

// Walk directory for files
//
// http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
//
exports.walk = walk = function(dir, done) {
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

exports.ls = ls = function(dir, callback) {
  walk(dir, function(err, results){
    var files = []
    results.map(function(file){ files.push(path.relative(dir, file)) })
    callback(null, files)
  })
}