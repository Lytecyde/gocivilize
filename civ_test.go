package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMessage(t *testing.T) {
	assert.Equal(t,
		welcomeMessage,
		"Hello worldbuilders, this is a civilizing process to find peace...",
		"Correct message!")
}