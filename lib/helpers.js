var fs    = require('fs')
var path  = require('path')
var mime  = require('mime')


exports.normalizeUrl = function(url){

  // take off query string
  var base = url.split('?')[0]

  // normalize path
  var file_path = path.normalize(base)

  // index.html support
  if ('/' == file_path[file_path.length - 1]) file_path += 'index.html'

  return file_path
}


/**
 *
 * Mime Type
 *
 * returns type of the file
 *
 * TODO: reference ext from terraform
 */

exports.mimeType = function(source){
  var ext = path.extname(source)

  if(['.jade', '.md', '.ejs'].indexOf(ext)  !== -1){
    return mime.lookup('html')
  }else if(['.less', '.styl'].indexOf(ext)  !== -1){
    return mime.lookup('css')
  }else{
    return mime.lookup(source)
  }

}

/**
 *
 * Walk directory for files
 *
 * recursive function that returns the directory tree
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


/**
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


/**
 *
 * Fetch configuration of a Harp Application.
 * returns object literal with key/val pairs.
 *
 */

exports.config = function(projectPath, defaultEnv){
  if(!defaultEnv) defaultEnv = "development"

  var configPath = path.join(projectPath, "harp.json")
  var contents;

  try{
    contents = fs.readFileSync(configPath).toString()
  }catch(e){
    contents = '{}'
  }

  if(!contents || contents.replace(/^\s\s*/, '').replace(/\s\s*$/, '') == ''){
    contents = '{}'
  }

  try{
    var cfg = JSON.parse(contents)
  }catch(e){
    throw {
      name: "ConfigError",
      message: e.message,
      filename: "harp.json",
      stack: contents
    }
  }

  if(!cfg.hasOwnProperty('globals')) cfg['globals'] = {}

  cfg.globals.environment = process.env.NODE_ENV || defaultEnv

  return cfg
}


/**
 *
 * Template for outputing Less errors.
 *
 */

exports.cssError = function(error){
  var body = '' +

  'body{' +
    'margin:0;' +
  '}' +

  'body > * {' +
    'display: none;'+
  '}'+

  'body:before {' +
    'display: block;'+
    'white-space: pre;' +
    'content: "'+ error.name +' Error: ' + error.filename + '";'+
    'border-top: 100px solid #FFF;'+
    'color: #444;'+
    'background-color: #fefe96;' +
    'padding: 40px 40px;'+
    'margin: 0;'+
    'font-family: monospace;'+
    'font-size: 14px;'+
  '}'+

  'body:after {' +
    'display: block;'+
    'white-space: pre;' +
    'content: "' + error.message + '";'+
    'color: #B94A48;'+
    'background-color: #EEE;' +
    'padding: 40px 40px 1000px;'+
    'margin: 0;'+
    'font-family: monospace;'+
    'font-size: 14px;'+
  '}'

  return body
}


