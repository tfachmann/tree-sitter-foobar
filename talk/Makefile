SOURCES := $(wildcard [0-9][0-9]_*/*.foobar)
TREES := $(SOURCES:.foobar=.tree) $(SOURCES:.foobar=.no-ranges.tree)
PARSERS := $(patsubst %/,build/%/parser.so,$(sort $(dir $(SOURCES))))
PARSE = tree-sitter parse --lib-path build/$(@D)/parser.so --lang-name foobar

all: $(PARSERS) $(TREES)

build/%/parser.so: %/grammar.js
	mkdir -p $(@D)
	cp $< $(@D)/
	echo '{"type":"module"}' > $(@D)/package.json
	cd $(@D) && tree-sitter generate && tree-sitter build -o parser.so

.SECONDEXPANSION:

%.no-ranges.tree: %.foobar build/$$(@D)/parser.so
	$(PARSE) --no-ranges $< > $@

%.tree: %.foobar build/$$(@D)/parser.so
	$(PARSE) $< > $@

clean:
	rm -rf build

.PHONY: all clean
