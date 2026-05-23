package tree_sitter_foobar_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_foobar "github.com/tfachmann/tree-sitter-foobar/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_foobar.Language())
	if language == nil {
		t.Errorf("Error loading Foobar grammar")
	}
}
