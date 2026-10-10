; Formatting rules for Topiary.

[
  (string)
  (raw_string)
  (name)
  (path)
  (comment)
] @leaf

; Top level: each item starts a line; a blank line from the input is kept.
(source_file
  [
    (section_defines)
    (section_process)
    (section_template)
    (include)
  ] @allow_blank_line_before @prepend_hardline
)

; Keywords followed by a name.
[
  "process"
  "template"
  "include"
  "use"
] @append_space

; Section bodies: one entry or `use` per line, indented below the header.
(section_defines
  .
  [(entry) (comment)] @prepend_indent_start
)
(section_defines
  [(entry) (comment)] @append_indent_end
  .
)
(section_template
  (parameters)
  .
  [(entry) (comment)] @prepend_indent_start
)
(section_template
  [(entry) (comment)] @append_indent_end
  .
)
(section_process
  (name)
  .
  [(entry) (use) (comment)] @prepend_indent_start
)
(section_process
  [(entry) (use) (comment)] @append_indent_end
  .
)

[
  (section_defines (entry) @prepend_hardline)
  (section_template (entry) @prepend_hardline)
  (section_process [(entry) (use)] @prepend_hardline)
]

[
  (entry)
  (use)
] @allow_blank_line_before

; `key: value`, `name(a, b)`, `use t(a: "x", b: 'y')`.
[
  (entry ":" @append_space)
  (argument ":" @append_space)
  (parameters "," @append_space)
  (arguments "," @append_space)
]

; Comments keep their own line or stay at the end of a line, as in the input.
(comment) @prepend_input_softline @append_hardline @allow_blank_line_before
