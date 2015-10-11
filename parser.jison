%start document

%%

document
  : TEXT EOF
    { return $1 }
  ;
