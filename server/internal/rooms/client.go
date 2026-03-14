package rooms

import (
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn *websocket.Conn
	Send chan []byte
	Name string
}

func (r *Room) AddClient(c *Client) {
	r.mu.Lock()
	r.Clients[c] = true
	r.LastActivity = time.Now()
	r.mu.Unlock()
}

func (r *Room) RemoveClient(c *Client) {
	r.mu.Lock()
	delete(r.Clients, c)
	r.LastActivity = time.Now()
	r.mu.Unlock()
}
