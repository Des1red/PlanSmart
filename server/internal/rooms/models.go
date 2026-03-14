package rooms

import (
	"sync"
	"time"
)

type Room struct {
	Code         string
	Plan         []byte
	LastActivity time.Time

	Members map[string]bool  // who belongs in the group
	Clients map[*Client]bool // who is connected right now
	mu      sync.RWMutex
}

type Manager struct {
	mu    sync.RWMutex
	rooms map[string]*Room
}

var M = &Manager{
	rooms: make(map[string]*Room),
}
