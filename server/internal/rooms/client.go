package rooms

import (
	"plansmart/internal/logger"
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
	r.Members[c.Name] = true
	r.LastActivity = time.Now()
	r.mu.Unlock()
	logger.DevLog(logger.RoomLog, "client joined room %s as %s (members: %d, online: %d)", r.Code, c.Name, len(r.Members), len(r.Clients))
}

func (r *Room) RemoveClient(c *Client) {
	r.RemoveConnection(c)
}

func (r *Room) RemoveConnection(c *Client) {
	r.mu.Lock()
	delete(r.Clients, c)
	r.LastActivity = time.Now()
	r.mu.Unlock()
	logger.DevLog(logger.RoomLog, "client disconnected from room %s: %s (still a member, online: %d)", r.Code, c.Name, len(r.Clients))
}

func (r *Room) RemoveMember(c *Client) {
	r.mu.Lock()
	delete(r.Clients, c)
	delete(r.Members, c.Name)
	r.LastActivity = time.Now()
	r.mu.Unlock()
	logger.DevLog(logger.RoomLog, "client left room %s: %s (members: %d)", r.Code, c.Name, len(r.Members))
}

func (r *Room) UpdateMemberName(c *Client, newName string) {
	r.mu.Lock()
	oldName := c.Name
	delete(r.Members, c.Name) // remove old name
	c.Name = newName
	r.Members[newName] = true // add new name
	r.LastActivity = time.Now()
	r.mu.Unlock()
	logger.DevLog(logger.RoomLog, "client renamed in room %s: %s → %s", r.Code, oldName, newName)
}
