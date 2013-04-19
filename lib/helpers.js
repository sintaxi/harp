var fs    = require('fs')
var path  = require('path')
var mime  = require('mime')

/**
 * Priority List
 *
 * returns a priority list of files to look for on a given request.
 *
 * `css` and `html` are special extensions that will add `less` and `jade`
 * to the priority list (respectively).
 *
 * e.g
 *
 *    priorityList("foobar")
 *      => ["foobar", "foobar.html", "foobar.jade", "foobar.html.jade"]
 *
 *    priorityList("foobar.css")
 *      => ["foobar.css", "foobar.less", "foobar.css.less"]
 *
 *    priorityList("foobar.html")
 *      => ["foobar.html", "foobar.jade", "foobar.html.jade"]
 *
 *    priorityList("foobar.jade")
 *      => ["foobar.jade"]
 *
 *    priorityList("foobar.html.jade.html")
 *      => ["foobar.html.jade.html", "foobar.html.jade.jade", "foobar.html.jade.html.jade"]
 *
 *    priorityList("hello/foobar")
 *      => ["hello/foobar", "hello/foobar.html", "hello/foobar.jade", "hello/foobar.html.jade"]
 *
 */

exports.buildPriorityList = function(fpath){
  var list  = [fpath]

  /**
   * if no extension `html` a possability
   */

  if (!path.extname(fpath)){
    fpath = [fpath, "html"].join(".")
    list.push(fpath)
  }

  /**
   * Blessed extensions
   */

  // less
  if(path.extname(fpath) == ".css"){
    list.push(fpath.replace(/.css$/, ".less"))
    list.push([fpath, "less"].join("."))
  }else{
    // html
    if(path.extname(fpath) == ".html"){
      list.push(fpath.replace(/.html$/, ".jade"))
    }
    list.push([fpath, "jade"].join("."))
  }

  // remove leading and trailing slashes
  var list = list.map(function(item){ return item.replace(/^\/|\/$/g, '') })

  return list
}


/**
 *
 * Find first existing file from priority list
 *
 * returns first existing file in
 */

exports.findFirstExistingFile = function(publicPath, list){

  if(!list){
    list = projectPath
    projectPath = null
  }

  // iterate over list
  for(var i = 0; i < list.length; i++){

    // return item if match found
    if(fs.existsSync(path.join(publicPath, list[i]))) return list[i]
  }

  // return null if no match
  return null
}


/**
 * Globals
 *
 * returns object literal based on the data tree and merges in extra object
 *
 */

exports.globals = function(projectPath, obj, env){
  var globalsObj            = {}
  globalsObj["public"]      = dataTree(path.resolve(projectPath, "public"))
  globalsObj["environment"] = process.env.NODE_ENV = env

  // merge values
  if(obj){
    for(var k in obj){
      globalsObj[k] = obj[k]
    }
  }

  return globalsObj
}

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
 */

exports.mimeType = function(source){

  if(path.extname(source) == ".jade"){
    source = source.replace(/.jade$/, ".html")
  }else if(path.extname(source) == ".less"){
    source = source.replace(/.less$/, ".css")
  }

  return mime.lookup(source)
}

/**
 *
 * Output Filename
 *
 * returns output path output for given source file
 *
 * eg.
 *     foo.jade => foo.html
 *     foo.html.jade => foo.html
 */

var outputFilename = exports.outputFilename = function(source){
  var arr = source.split(".")

  if(arr.length >= 3){
    source = source.replace(/.jade$/, "")
    source = source.replace(/.less$/, "")
  }else{
    source = source.replace(/.jade$/, ".html")
    source = source.replace(/.less$/, ".css")
  }

  return source
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
 * Walk Data Tree
 *
 * recursive function that returns the data object accociated with path.
 *
 *     var globals = {
 *       "public": {
 *         "articles": {
 *           "data": {
 *             "hello-world": "You Found Me!"
 *           }
 *         }
 *       }
 *     }
 *
 *     walkData(["public", "articles", "hello-world"], globals) => "You Found Me!"
 */

var walkData = exports.walkData = function(tail, obj){
  var tail = tail.slice(0)  // clone array.
  var head = tail.shift()

  if(obj.hasOwnProperty(head)){
    return walkData(tail, obj[head])
  }else if(obj.hasOwnProperty("data")){
    return obj["data"][head]
      ? obj["data"][head]
      : null

  }else{
    return null
  }
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
  // if(fs.existsSync(configPath)){
  //   var contents = fs.readFileSync(configPath)

  //   // try{
  //   //   var config = JSON.parse(contents)
  //   // }catch(e){
  //   //   var config = {}
  //   // }

  //   var config = contents
  //     ? JSON.parse(contents)
  //     : {}

  // }else{
  //   var config = {}
  // }

  //return config
}


/**
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


/**
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

var dataTree = exports.dataTree = function (filename) {
  var dirPath   = path.resolve(filename)
  var list      = fs.readdirSync(dirPath)
  var obj       = {}
  obj.contents  = []

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

    if(stat.isDirectory()){
      if(file[0] !== "_"){
        var d = dataTree(filePath)
        if(!isEmpty(d))
          obj[file] = d
      }
    }else{
      if(["_", "."].indexOf(file[0]) === -1 ) obj.contents.push(outputFilename(file))
    }
  })

  if(obj.contents.length == 0)
    delete obj.contents

  return obj
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


