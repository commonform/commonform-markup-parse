%start document

%%

document
  : content END  { return fix({ content: $1 }) }
  ;

content
  : paragraph                      { $$ = $1 }
  | paragraphThenSeries            { $$ = $1 }
  | paragraphThenSeries paragraph  { $$ = $1.concat($2) }
  | series                         { $$ = $1 }
  | seriesThenparagraph            { $$ = $1 }
  | seriesThenparagraph series     { $$ = $1.concat($2) }
  ;

paragraphThenSeries
  : paragraph series                      { $$ = $1.concat($2) }
  | paragraphThenSeries paragraph series  { $$ = $1.concat($2, $3) }
  ;

seriesThenparagraph
  : series paragraph                      { $$ = $1.concat($2) }
  | seriesThenparagraph series paragraph  { $$ = $1.concat($2, $3) }
  ;

series
  : INDENT children OUTDENT  { $$ = $2 }
  ;

children
  : child           { $$ = [ $1 ] }
  | children child  { $$ = $1.concat($2) }
  ;

child
  : childWithHeading     { $$ = $1 }
  | childWithoutHeading  { $$ = $1 }
  ;

childWithoutHeading
  : BACKSLASH BACKSLASH content  { $$ = { form: { content: $3 } } }
  | BACKSLASH BANGS content      { $$ = { form: {
                                            conspicuous: 'yes',
                                            content: $3 } } }
  ;

childWithHeading
  : heading BACKSLASH content { $$ = { heading: $1,
                                         form: { content: $3 } } }
  | heading BANGS content     { $$ = { heading: $1,
                                         form: {
                                           conspicuous: 'yes',
                                           content: $3 } } }
  ;

heading
  : BACKSLASH TEXT { $$ = $2 }
  ;

paragraph
  : TEXT                  { $$ = [ $1 ] }
  | blank                 { $$ = [ $1 ] }
  | definition            { $$ = [ $1 ] }
  | reference             { $$ = [ $1 ] }
  | use                   { $$ = [ $1 ] }
  | paragraph TEXT        { $$ = $1.concat($2) }
  | paragraph blank       { $$ = $1.concat($2) }
  | paragraph definition  { $$ = $1.concat($2) }
  | paragraph reference   { $$ = $1.concat($2) }
  | paragraph use         { $$ = $1.concat($2) }
  ;

blank
  : LEFT_BRACKET TEXT RIGHT_BRACKET  { $$ = { blank: $2 } }
  ;

definition
  : QUOTES TEXT QUOTES  { $$ = { definition: $2 } }
  ;

reference
  : LEFT_BRACE TEXT RIGHT_BRACE  { $$ = { reference: $2 } }
  ;

use
  : LEFT_ANGLE TEXT RIGHT_ANGLE  { $$ = { use: $2 } }
  ;

%%

var fix = require('commonform-fix-strings')
