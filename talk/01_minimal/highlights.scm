; keywords
"process" @keyword

; punctuation
":" @punctuation.delimiter

; identifiers
(entry (identifier) @property)

; process header name
(section_process (name) @function)

; literals
(raw_string) @string

; comments
(comment) @comment
