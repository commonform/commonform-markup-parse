var get = require('keyarray-get')
var lastAtDepth = require('./last-at-depth')

// Build form objects
function buildForm(form, element) {
  var contentKeyArray
  var depth = element.depth
  var newValue
  var parentKeyArray
  if (element.hasOwnProperty('form')) {
    parentKeyArray = lastAtDepth(form, depth)
    contentKeyArray = parentKeyArray.concat(['content'])
    // Create a new form object without parser-related metadata.
    newValue = { form: element.form }
    if (element.hasOwnProperty('heading')) {
      newValue.heading = element.heading }
    if (element.hasOwnProperty('conspicuous')) {
      newValue.form.conspicuous = 'yes' }
    get(form, contentKeyArray).push(newValue)
    return form }
  else {
    newValue = element.content
    try {
      parentKeyArray = lastAtDepth(form, depth + 1) }
    catch (e) {
      if (depth === 0) {
        parentKeyArray = lastAtDepth(form, 0) }
      else {
        var line = element.line
        throw new Error('Line ' + line + ' missing heading') } }
    contentKeyArray = parentKeyArray.concat(['content'])
    var content = get(form, contentKeyArray)
    var last = content[content.length - 1]
    var head = newValue[0]
    var length = content.length
    // If the last existing content element is a string and the
    // next content element to be added is a string, concatenate
    // the strings.
    var needToConcatenate = (
      length > 0 &&
      typeof head === 'string' &&
      typeof last === 'string' )
    if (needToConcatenate) {
      content[length - 1] = last + ' ' + head
      newValue.slice(1).forEach(function(element) {
        content.push(element) }) }
    // Otherwise, concatenate the lists.
    else {
      newValue.forEach(function(element) {
        content.push(element) }) }
    return form } }

module.exports = buildForm
