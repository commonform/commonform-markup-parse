// Given the AST produced by the parser, replace all blanks with
// `{blank:''}` and create directions that link blank identifiers to
// paths within the form.
module.exports = function (syntaxTree) {
  return recurse(syntaxTree, [], [])
}

// Recurse the AST.
function recurse (syntaxTree, directions, path) {
  var newContent = []
  syntaxTree.content.forEach(function (element, index) {
    var elementIsObject = typeof element === 'object'
    var elementIsBlank = (
      elementIsObject &&
      element.hasOwnProperty('blank')
    )
    if (elementIsBlank) {
      var identifier = element.blank
      newContent.push(createBlank())
      directions.push({
        identifier: identifier,
        path: path.concat('content', index)
      })
    } else {
      var elementIsChild = (
        elementIsObject &&
        element.hasOwnProperty('form')
      )
      if (elementIsChild) {
        var childPath = path.concat('content', index, 'form')
        var result = recurse(element.form, directions, childPath)
        var newChild = { form: result.form }
        if (element.hasOwnProperty('heading')) {
          newChild.heading = element.heading
        }
        newContent.push(newChild)
      } else {
        newContent.push(element)
      }
    }
  })
  var newForm = { content: newContent }
  if (syntaxTree.hasOwnProperty('conspicuous')) {
    newForm.conspicuous = syntaxTree.conspicuous
  }
  return {
    form: newForm,
    directions: directions
  }
}

function createBlank () {
  return { blank: '' }
}
