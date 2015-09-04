var ALL_SPACE = /^\s*$/
var COMMENT = /^\s*#.*$/
var CONTIGUOUS_SPACE = / {2,}/g
var LINE_RE = /^( *)(.+)$/
var TAB_WIDTH = 4

// Tokenize lines with indentation attributes, discarding blanks.
function tokenizeLines(tokens, line, number) {
  number = number + 1
  if (ALL_SPACE.test(line) || COMMENT.test(line)) {
    return tokens }
  else {
    var match = LINE_RE.exec(line)
    var depth = Math.floor(match[1].length / TAB_WIDTH)
    var string = match[2].replace(CONTIGUOUS_SPACE, ' ')
    tokens.push({
      line: number,
      depth: depth,
      string: string })
    return tokens } }

module.exports = tokenizeLines
