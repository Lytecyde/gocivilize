package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

var welcomeMessage = "Hello worldbuilders, this is a civilizing process to find peace..."

func main() {

	fmt.Println(welcomeMessage)

}

func testMessage(t *testing.T) {

	assert.Equal(t, welcomeMessage,
		"Hello worldbuilders, this is a civilizing process to find peace...",
		"Correct message!")

}
