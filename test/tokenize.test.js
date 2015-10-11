var tape = require('tape')
var tokenize = require('../lex')

tape('tokenizer', function(test) {

  test.deepEqual(
    tokenize('a test'),
    [ { type: 'text',    line: 1, column: 1, string: 'a test' },
      { type: 'end',     line: 1, column: 7, string: '' } ],
    'just text')

  test.deepEqual(
    tokenize(
      [ 'A',
        '    B',
        'C' ].join('\n')),
    [ { type: 'text',    line: 1, column: 1, string: 'A' },
      { type: 'indent',  line: 2, column: 1, string: '    ' },
      { type: 'text',    line: 2, column: 5, string: 'B' },
      { type: 'dedent',  line: 3, column: 1, string: '' },
      { type: 'text',    line: 3, column: 1, string: 'C' },
      { type: 'end',     line: 3, column: 2, string: '' } ],
    'dedent')

  test.deepEqual(
    tokenize(
      [ 'A',
        '    B',
        '    C' ].join('\n')),
    [ { type: 'text',    line: 1, column: 1, string: 'A' },
      { type: 'indent',  line: 2, column: 1, string: '    ' },
      { type: 'text',    line: 2, column: 5, string: 'B' },
      { type: 'newline', line: 2, column: 6, string: '\n' },
      { type: 'text',    line: 3, column: 5, string: 'C' },
      { type: 'dedent',  line: 3, column: 6, string: '' },
      { type: 'end',     line: 3, column: 6, string: '' } ],
    'consecutive at same level')

  test.deepEqual(
    tokenize(
      [ 'A',
        '    B',
        '        C',
        'D' ].join('\n')),
    [ { type: 'text',    line: 1, column: 1, string: 'A' },
      { type: 'indent',  line: 2, column: 1, string: '    ' },
      { type: 'text',    line: 2, column: 5, string: 'B' },
      { type: 'indent',  line: 3, column: 1, string: '        ' },
      { type: 'text',    line: 3, column: 9, string: 'C' },
      { type: 'dedent',  line: 4, column: 1, string: '' },
      { type: 'dedent',  line: 4, column: 1, string: '' },
      { type: 'text',    line: 4, column: 1, string: 'D' },
      { type: 'end',     line: 4, column: 2, string: '' } ],
    'multiple dedent')

  test.deepEqual(
    tokenize(
      [ 'A',
        '    B',
        '        C' ].join('\n')),
    [ { type: 'text',    line: 1, column: 1, string: 'A' },
      { type: 'indent',  line: 2, column: 1, string: '    ' },
      { type: 'text',    line: 2, column: 5, string: 'B' },
      { type: 'indent',  line: 3, column: 1, string: '        ' },
      { type: 'text',    line: 3, column: 9, string: 'C' },
      { type: 'dedent',  line: 3, column: 10, string: '' },
      { type: 'dedent',  line: 3, column: 10, string: '' },
      { type: 'end',     line: 3, column: 10, string: '' } ],
    'emits terminal dedent tokens')

  test.throws(
    function() { tokenize('\ttest') },
    /invalid character/i)

  test.throws(
    function() { tokenize('§ test') },
    /invalid character/i)

  test.end() })
