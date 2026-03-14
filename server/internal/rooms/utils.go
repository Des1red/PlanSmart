package rooms

import (
	"crypto/rand"
)

const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

func GenerateCode() string {

	b := make([]byte, 6)

	_, _ = rand.Read(b)

	for i := range b {
		b[i] = letters[int(b[i])%len(letters)]
	}

	return string(b)
}

var adjectives = []string{
	"Red", "Blue", "Green", "Gold", "Silver", "Swift", "Bold", "Calm",
	"Dark", "Bright", "Fierce", "Gentle", "Wild", "Quiet", "Brave", "Sly",
}

var animals = []string{
	"Fox", "Owl", "Bear", "Wolf", "Hawk", "Lynx", "Deer", "Crow",
	"Seal", "Boar", "Hare", "Mole", "Newt", "Pike", "Wren", "Toad",
}

func GenerateName() string {
	ab := make([]byte, 2)
	_, _ = rand.Read(ab)
	adj := adjectives[int(ab[0])%len(adjectives)]
	ani := animals[int(ab[1])%len(animals)]
	return adj + " " + ani
}
