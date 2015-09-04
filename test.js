var parse = require('./')

require('tape').test('commonform-markup-tests', function(tape) {
  require('commonform-markup-tests')
    .forEach(function(test, number) {
      if (test.error) {
        tape.throws(
          function() { parse(test.markup) },
          test.error,
          'No. ' + number + ': ' + test.comment) }
      else {
        tape.deepEqual(
          parse(test.markup),
          test.form,
          'No. ' + number + ': ' + test.comment) } })
  tape.end() })
