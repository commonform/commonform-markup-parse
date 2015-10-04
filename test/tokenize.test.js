var tape = require('tape')
var tokenize = require('../tokenize-lines')

tape('tokenizer', function(test) {

  test.deepEqual(
    tokenize('a test'),
    [ { token: 'char',    line: 1, column: 1, string: 'a' },
      { token: 'char',    line: 1, column: 2, string: ' ' },
      { token: 'char',    line: 1, column: 3, string: 't' },
      { token: 'char',    line: 1, column: 4, string: 'e' },
      { token: 'char',    line: 1, column: 5, string: 's' },
      { token: 'char',    line: 1, column: 6, string: 't' },
      { token: 'newline', line: 1, column: 7, string: '\n' } ])

  test.deepEqual(
    tokenize('A\n    B\nC'),
    [ { token: 'char',    line: 1, column: 1, string: 'A' },
      { token: 'newline', line: 1, column: 2, string: '\n' },
      { token: 'indent',  line: 2, column: 1, string: '    ' },
      { token: 'char',    line: 2, column: 5, string: 'B' },
      { token: 'newline', line: 2, column: 6, string: '\n' },
      { token: 'dedent',  line: 3, column: 1, string: '' },
      { token: 'char',    line: 3, column: 1, string: 'C' },
      { token: 'newline', line: 3, column: 2, string: '\n' } ])

  test.deepEqual(
    tokenize('A\n    B\n    C'),
    [ { token: 'char',    line: 1, column: 1, string: 'A' },
      { token: 'newline', line: 1, column: 2, string: '\n' },
      { token: 'indent',  line: 2, column: 1, string: '    ' },
      { token: 'char',    line: 2, column: 5, string: 'B' },
      { token: 'newline', line: 2, column: 6, string: '\n' },
      { token: 'char',    line: 3, column: 5, string: 'C' },
      { token: 'newline', line: 3, column: 6, string: '\n' } ])

  test.throws(
    function() { tokenize('\ttest') },
    /invalid character/i)

  test.throws(
    function() { tokenize('§ test') },
    /invalid character/i)

  test.end() })
