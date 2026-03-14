package rooms

import "time"

func (m *Manager) Create() *Room {

	m.mu.Lock()
	defer m.mu.Unlock()

	var code string

	for {
		code = GenerateCode()

		if _, exists := m.rooms[code]; !exists {
			break
		}
	}

	room := &Room{
		Code:         code,
		LastActivity: time.Now(),
		Clients:      make(map[*Client]bool),
	}

	m.rooms[code] = room

	return room
}
func (m *Manager) Get(code string) (*Room, bool) {

	m.mu.RLock()
	defer m.mu.RUnlock()

	room, ok := m.rooms[code]

	return room, ok
}

func (r *Room) Empty() bool {

	r.mu.RLock()
	defer r.mu.RUnlock()

	return len(r.Clients) == 0
}

func (m *Manager) Delete(code string) {

	m.mu.Lock()
	defer m.mu.Unlock()

	delete(m.rooms, code)
}
