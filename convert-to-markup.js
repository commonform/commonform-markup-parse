function convertToMarkup(element) {
  var string = element.string
  delete element.string
  var match = HEADING_SEP.exec(string)
  if (match) {
    var heading = string.slice(0, match.index)
    var content = string.slice(match.index + match[1].length)
    if (match[1] === '!!') {
      element.conspicuous = 'yes' }
    heading = heading.trim()
    if (heading.trim().length > 0) {
      element.heading = heading }
    element.form = { content: parseContent(content.trim()) } }
  else {
    element.content = parseContent(string) }
  return element }

module.exports = convertToMarkup
