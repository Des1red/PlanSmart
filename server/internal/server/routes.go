package server

import (
	"encoding/json"
	"log"
	"net/http"
	"plansmart/internal/rooms"
	"strings"
)

func createRoom(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	room := rooms.M.Create()

	json.NewEncoder(w).Encode(map[string]string{
		"code": room.Code,
	})
}

func getRoom(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	code := strings.TrimPrefix(r.URL.Path, "/rooms/")
	code = strings.TrimSuffix(code, "/ws")
	code = strings.TrimSuffix(code, "/")

	room, ok := rooms.M.Get(code)

	if !ok {
		http.Error(w, "room not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"code": room.Code,
	})
}
func routeRooms(w http.ResponseWriter, r *http.Request) {
	log.Println("WS CONNECT:", r.URL.Path)
	if strings.HasSuffix(r.URL.Path, "/ws") {
		roomWS(w, r)
		return
	}

	getRoom(w, r)
}
