// This module exports the tokenizer ("lexical analyzer" or "lexer")
// for content within lines of Common Form markup. It does not handle
// indentation or other line-based tokens. String input is passed to the
// top-level tokenizer function in tokenize-lines.js, which in turn uses
// this module.

module.exports = tokenizeContent

// A token type that is only used within this module for individual
// characters of text. Contiguous character tokens are concatenated into
// longer text tokens before they are returned.
var CHARACTER = 'char'

// Special characters with their own token types.
var CHAR_TOKENS = {
  '\\': 'BACKSLASH',
  '[': 'LEFT_BRACKET',
  ']': 'RIGHT_BRACKET',
  '{': 'LEFT_BRACE',
  '}': 'RIGHT_BRACE',
  '<': 'LEFT_ANGLE',
  '>': 'RIGHT_ANGLE'
}

// Token types that correspond to certain characters in immediate
// succession. For example, two '"' in a row are a QUOTE token, but any
// single '"' alone is a character that becomes part of a TEXT token.
var DOUBLES = {
  '"': 'QUOTES',
  '!': 'BANGS'
}

// Non-printable-ASCII characters and tabs are not allowed.
var ILLEGAL = /[^\x20-\x7E]|\t/

// Escape character
var ESCAPE = '~'

function tokenizeContent (string, line, offset) {
  var arrayOfTokens = []
  var character
  var last
  var escaped = false
  // For each character in the string
  for (var index = 0; index < string.length; index++) {
    character = string.charAt(index)
    // If the character is illegal, throw an error.
    if (ILLEGAL.test(character)) {
      throw new Error(
        'Invalid character "' + character + '"' +
        ' at line ' + line + ' column ' + (offset + index)
      )
    } else if (escaped) {
      arrayOfTokens.push({
        type: CHARACTER,
        line: line,
        column: offset + index - 1,
        string: character
      })
      escaped = false
    } else {
      if (character === ESCAPE) {
        escaped = true
      // If it might be a special character, emit corresponding token.
      } else if (CHAR_TOKENS.hasOwnProperty(character)) {
        arrayOfTokens.push({
          type: CHAR_TOKENS[character],
          line: line,
          column: (offset + index),
          string: character
        })
      } else {
        last = arrayOfTokens[(arrayOfTokens.length - 1)]
        // Is it the second character in a token comprised of two
        // specific characters in succession?
        if (
          last &&
          DOUBLES.hasOwnProperty(character) &&
          last.string === character
        ) {
          last.type = DOUBLES[character]
          last.string += character
        // Otherwise, emit a character token.
        } else {
          arrayOfTokens.push({
            type: CHARACTER,
            line: line,
            column: (offset + index),
            string: character
          })
        }
      }
    }
  }
  // Combine consecutive character tokens into text tokens.
  return arrayOfTokens
    .reduce(function (returned, token, index, tokens) {
      var precedingToken = (index > 0) ? tokens[index - 1] : false
      var consecutiveText = (
        precedingToken &&
      (precedingToken.type === CHARACTER) &&
      (token.type === CHARACTER)
      )
      if (consecutiveText) {
        returned[(returned.length - 1)].string += token.string
        return returned
      } else {
        return returned.concat({
          type: (
            token.type === CHARACTER
              ? 'TEXT'
              : token.type
          ),
          column: token.column,
          line: token.line,
          string: token.string
        })
      }
    }, [])
}
