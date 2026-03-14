package server

import (
	"fmt"
	"net/http"
	"plansmart/internal/rooms"

	"github.com/Des1red/gohttpkit/httpkit"
)

func Start() {
	runtime := httpkit.BuildRuntime(".env")
	httpkit.CORSMethods("GET, POST, OPTIONS")

	rooms.StartCleanup()

	mux := http.NewServeMux()
	mux.HandleFunc("/rooms", createRoom)
	mux.HandleFunc("/rooms/", routeRooms)

	handler := httpkit.With(runtime, mux)
	fmt.Println(runtime.Port)
	err := http.ListenAndServe(runtime.Port, handler)
	if err != nil {
		fmt.Println("SERVER ERROR:", err)
	}
}
