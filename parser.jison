%start document

%%

document
  : content END  { return fix({ content: $1 }) }
  ;

content
  : paragraphs                       { $$ = $1 }
  | paragraphsThenSeries             { $$ = $1 }
  | paragraphsThenSeries paragraphs  { $$ = $1.concat($2) }
  | series                           { $$ = $1 }
  | seriesThenParagraphs             { $$ = $1 }
  | seriesThenParagraphs series      { $$ = $1.concat($2) }
  ;

paragraphsThenSeries
  : paragraphs series                       { $$ = $1.concat($2) }
  | paragraphsThenSeries paragraphs series  { $$ = $1.concat($2, $3) }
  ;

seriesThenParagraphs
  : series paragraphs                       { $$ = $1.concat($2) }
  | seriesThenParagraphs series paragraphs  { $$ = $1.concat($2, $3) }
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
  : SLASHES SLASHES childContent  { $$ = { form: { content: $3 } } }
  | SLASHES BANGS childContent    { $$ = { form: {
                                     conspicuous: 'yes',
                                     content: $3 } } }
  ;

childWithHeading
  : heading SLASHES childContent { $$ = { heading: $1,
                                          form: { content: $3 } } }
  | heading BANGS childContent   { $$ = { heading: $1,
                                          form: {
                                            conspicuous: 'yes',
                                            content: $3 } } }
  ;

heading
  : SLASHES TEXT { $$ = $2 }
  ;

childContent
  : content             { $$ = $1 }
  | paragraphs NEWLINE  { $$ = $1 }
  ;

paragraphs
  : paragraph                     { $$ = $1 }
  | paragraphs NEWLINE paragraph  { $$ = $1.concat($3) }
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
