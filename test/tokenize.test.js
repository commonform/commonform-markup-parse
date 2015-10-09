var tape = require('tape')
var tokenize = require('../lex')

tape('tokenizer', function(test) {

  test.deepEqual(
    tokenize('a test'),
    [ { type: 'text',    line: 1, column: 1, string: 'a test' },
      { type: 'newline', line: 1, column: 7, string: '\n' } ])

  test.deepEqual(
    tokenize('A\n    B\nC'),
    [ { type: 'text',    line: 1, column: 1, string: 'A' },
      { type: 'newline', line: 1, column: 2, string: '\n' },
      { type: 'indent',  line: 2, column: 1, string: '    ' },
      { type: 'text',    line: 2, column: 5, string: 'B' },
      { type: 'newline', line: 2, column: 6, string: '\n' },
      { type: 'dedent',  line: 3, column: 1, string: '' },
      { type: 'text',    line: 3, column: 1, string: 'C' },
      { type: 'newline', line: 3, column: 2, string: '\n' } ])

  test.deepEqual(
    tokenize('A\n    B\n    C'),
    [ { type: 'text',    line: 1, column: 1, string: 'A' },
      { type: 'newline', line: 1, column: 2, string: '\n' },
      { type: 'indent',  line: 2, column: 1, string: '    ' },
      { type: 'text',    line: 2, column: 5, string: 'B' },
      { type: 'newline', line: 2, column: 6, string: '\n' },
      { type: 'text',    line: 3, column: 5, string: 'C' },
      { type: 'newline', line: 3, column: 6, string: '\n' } ])

  test.throws(
    function() { tokenize('\ttest') },
    /invalid character/i)

  test.throws(
    function() { tokenize('§ test') },
    /invalid character/i)

  test.end() })
