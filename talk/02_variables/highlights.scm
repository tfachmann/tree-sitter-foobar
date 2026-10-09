; keywords
"process" @keyword
"defines" @keyword

; punctuation
":" @punctuation.delimiter
(variable ["%(" ")"] @punctuation.special)

; identifiers
(entry (identifier) @property)
(variable (identifier) @variable)

; process header name
(section_process (name) @function)

; literals
(string) @string
(raw_string) @string

; comments
(comment) @comment
