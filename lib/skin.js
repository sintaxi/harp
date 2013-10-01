module.exports = function(req, rsp, stack, callback){
  var that  = this
  var index = 0

  function next(err){
    var layer = stack[index++]
    if(!layer) return callback(req, rsp, next)
    layer.call(that, req, rsp, next)
  }

  next()
}