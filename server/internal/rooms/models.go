package rooms

import (
	"sync"
	"time"
)

type Room struct {
	Code         string
	Plan         []byte
	LastActivity time.Time

	Clients map[*Client]bool
	mu      sync.RWMutex
}

type Manager struct {
	mu    sync.RWMutex
	rooms map[string]*Room
}

var M = &Manager{
	rooms: make(map[string]*Room),
}
