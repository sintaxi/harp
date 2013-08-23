/*
 * Simple Cache, it's just Object, it's simple and fast.
 */
__cache = {}

exports.set = function(key, value){
  return __cache[key] = value
}

exports.get = function(key){
  return __cache[key]
}

exports.remove = function(key){
  delete __cache[key]
}
