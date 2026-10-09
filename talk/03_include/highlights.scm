; keywords
"process" @keyword
"defines" @keyword
"include" @keyword.import

; punctuation
":" @punctuation.delimiter
(variable ["%(" ")"] @punctuation.special)

; identifiers
(entry (identifier) @property)
(variable (identifier) @variable)

; process header name
(section_process (name) @function)

; include path
(include (path) @string.special.path)

; literals
(string) @string
(raw_string) @string

; comments
(comment) @comment
