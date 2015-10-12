%start document

%%

document : inlineList END { return { content: $1 } } ;

// Inline Content

inlineList
  : inlineList TEXT       { $$ = $1.concat($2) }
  | inlineList blank      { $$ = $1.concat($2) }
  | inlineList definition { $$ = $1.concat($2) }
  | inlineList reference  { $$ = $1.concat($2) }
  | inlineList use        { $$ = $1.concat($2) }
  | TEXT                  { $$ = [ $1 ] }
  | blank                 { $$ = [ $1 ] }
  | definition            { $$ = [ $1 ] }
  | reference             { $$ = [ $1 ] }
  | use                   { $$ = [ $1 ] }
  ;

blank : LEFT_BRACKET TEXT RIGHT_BRACKET { $$ = { blank: $2 } } ;

definition : QUOTES TEXT QUOTES { $$ = { definition: $2 } } ;

reference : LEFT_BRACE TEXT RIGHT_BRACE { $$ = { reference: $2 } } ;

use : LEFT_ANGLE TEXT RIGHT_ANGLE { $$ = { use: $2 } } ;
