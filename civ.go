package main

import	(
	"fmt"
    "testing"
	"github.com/stretchr/testify/assert"
)
func main() {  
	var welcomeMessage string
	welcomeMessage = "Hello worldbuilders, this is a civilizing process to find peace."
	fmt.Println(welcomeMessage)
}

func TestSomething(s string) {

	assert.Equals(s, "Hello worldbuilders, this is a civilizing process to find peace."
	, "Correct message!")
  
  }