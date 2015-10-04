var tape = require('tape')
var tokenize = require('../tokenize')

tape('tokenizer', function(test) {

  test.deepEqual(
    tokenize('a test'),
    [ { token: 'text',    line: 1, column: 1, string: 'a test' },
      { token: 'newline', line: 1, column: 7, string: '\n' } ])

  test.deepEqual(
    tokenize('A\n    B\nC'),
    [ { token: 'text',    line: 1, column: 1, string: 'A' },
      { token: 'newline', line: 1, column: 2, string: '\n' },
      { token: 'indent',  line: 2, column: 1, string: '    ' },
      { token: 'text',    line: 2, column: 5, string: 'B' },
      { token: 'newline', line: 2, column: 6, string: '\n' },
      { token: 'dedent',  line: 3, column: 1, string: '' },
      { token: 'text',    line: 3, column: 1, string: 'C' },
      { token: 'newline', line: 3, column: 2, string: '\n' } ])

  test.deepEqual(
    tokenize('A\n    B\n    C'),
    [ { token: 'text',    line: 1, column: 1, string: 'A' },
      { token: 'newline', line: 1, column: 2, string: '\n' },
      { token: 'indent',  line: 2, column: 1, string: '    ' },
      { token: 'text',    line: 2, column: 5, string: 'B' },
      { token: 'newline', line: 2, column: 6, string: '\n' },
      { token: 'text',    line: 3, column: 5, string: 'C' },
      { token: 'newline', line: 3, column: 6, string: '\n' } ])

  test.end() })
