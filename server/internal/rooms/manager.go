package rooms

import (
	"encoding/json"
	"time"
)

func (r *Room) Broadcast(msg []byte, sender *Client) {

	r.mu.RLock()

	clients := make([]*Client, 0, len(r.Clients))
	for c := range r.Clients {
		if c != sender {
			clients = append(clients, c)
		}
	}

	r.mu.RUnlock()

	r.LastActivity = time.Now()

	for _, c := range clients {

		select {
		case c.Send <- msg:

		default:
			// client channel full → remove it safely
			r.mu.Lock()
			if _, ok := r.Clients[c]; ok {
				close(c.Send)
				delete(r.Clients, c)
			}
			r.mu.Unlock()
		}
	}
}

func (r *Room) BroadcastUsers() {
	r.mu.RLock()
	clients := make([]*Client, 0, len(r.Clients))
	for c := range r.Clients {
		clients = append(clients, c)
	}
	r.mu.RUnlock()

	names := make([]string, 0, len(clients))
	for _, c := range clients {
		names = append(names, c.Name)
	}

	for _, c := range clients {
		msg := map[string]interface{}{
			"type":     "USERS",
			"count":    len(clients),
			"names":    names,
			"yourName": c.Name,
		}
		data, _ := json.Marshal(msg)
		select {
		case c.Send <- data:
		default:
			r.mu.Lock()
			close(c.Send)
			delete(r.Clients, c)
			r.mu.Unlock()
		}
	}
}
