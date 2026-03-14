package server

import (
	"encoding/json"
	"net/http"
	"strings"

	"plansmart/internal/rooms"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func roomWS(w http.ResponseWriter, r *http.Request) {

	code := strings.TrimPrefix(r.URL.Path, "/rooms/")
	code = strings.TrimSuffix(code, "/ws")
	code = strings.TrimSuffix(code, "/")

	room, ok := rooms.M.Get(code)

	if !ok {
		http.Error(w, "room not found", 404)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	name := r.URL.Query().Get("name")
	if name == "" {
		name = rooms.GenerateName()
	}

	client := &rooms.Client{
		Conn: conn,
		Send: make(chan []byte, 256),
		Name: name,
	}

	room.AddClient(client)
	room.BroadcastUsers() // update others

	if room.Plan != nil {
		client.Send <- room.Plan
	}

	go writePump(client)
	readPump(room, client)
}

func readPump(room *rooms.Room, client *rooms.Client) {

	defer func() {
		client.Conn.Close()
		room.RemoveClient(client)
		room.BroadcastUsers()
	}()

	for {

		_, msg, err := client.Conn.ReadMessage()
		if err != nil {
			break
		}

		var data map[string]interface{}
		if err := json.Unmarshal(msg, &data); err != nil {
			continue
		}

		if data["type"] == "PLAN_UPDATE" {
			room.Plan = msg
			room.Broadcast(msg, client)
		}
		if data["type"] == "SET_NAME" {
			if name, ok := data["name"].(string); ok && name != "" {
				client.Name = name
				room.BroadcastUsers()
			}
		}
	}
}
func writePump(client *rooms.Client) {

	defer func() {
		client.Conn.Close()
	}()

	for msg := range client.Send {

		err := client.Conn.WriteMessage(websocket.TextMessage, msg)

		if err != nil {
			return
		}
	}
}
