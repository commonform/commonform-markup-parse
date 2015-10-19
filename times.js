// Build an array with n pointers to a given object.

module.exports = times

function times(object, times) {
  var result = [ ]
  for (var i = 0; i < times; i++) {
    result.push(object) }
  return result }
