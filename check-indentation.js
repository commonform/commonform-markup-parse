function checkIndentation(element, index, array) {
  var depth = element.depth
  if (index === 0) {
    if (depth > 0) {
      throw new Error('Line 1 indented too far') } }
  else {
    var lastDepth = array[index - 1].depth
    if (depth > lastDepth && depth - lastDepth > 1) {
      throw new Error(
        'Line ' + element.line + ' indented too far') } }
  return element }

module.exports = checkIndentation
