grammar HospitalDSL;

// ─── Parser Rules ─────────────────────────────────────────────

hospital
    : 'Hospital' ID '{' hospitalBody '}' EOF
    ;

hospitalBody
    : (moduleDecl | roleDecl | authDecl)*
    ;

// ── Module ────────────────────────────────────────────────────

moduleDecl
    : 'Module' ID '{' moduleBody '}'
    ;

moduleBody
    : moduleItem*
    ;

moduleItem
    : 'Label:'  STRING ';'
    | 'Icon:'   STRING ';'
    | 'Color:'  ID     ';'
    | fieldsDecl
    ;

fieldsDecl
    : 'Fields' '{' fieldDef+ '}'
    ;

fieldDef
    : ID ':' fieldType fieldConstraint* ';'
    ;

fieldType
    : ID
    ;

fieldConstraint
    : 'required'
    | 'optional'
    | 'unique'
    | 'label'   STRING
    | 'default' STRING
    | 'min'     INT
    | 'max'     INT
    | 'options' STRING (',' STRING)*
    ;

// ── Role ──────────────────────────────────────────────────────

roleDecl
    : 'Role' ID '{' roleBody '}'
    ;

roleBody
    : roleFeature+
    ;

roleFeature
    : 'Portal:'    ID (',' ID)* ';'
    | 'Manage:'    ID (',' ID)* ';'
    | 'Dashboard:' ID (',' ID)* ';'
    ;

// ── Auth ──────────────────────────────────────────────────────

authDecl
    : 'Auth' '{' authBody '}'
    ;

authBody
    : authItem+
    ;

authItem
    : 'Type:'   ID     ';'
    | 'Expiry:' STRING ';'
    | 'Roles:'  ID (',' ID)* ';'
    ;

// ─── Lexer Rules ──────────────────────────────────────────────

ID      : [a-zA-Z_][a-zA-Z0-9_]* ;
INT     : [0-9]+ ;
STRING  : '"' (~["\r\n])* '"' ;
WS      : [ \t\r\n]+ -> skip ;
COMMENT : '//' ~[\r\n]* -> skip ;
