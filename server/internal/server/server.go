package server

import (
	"fmt"
	"net/http"
	"plansmart/internal/models"
	"plansmart/internal/rooms"

	"github.com/Des1red/gohttpkit/httpkit"
)

func Start() {
	runtime := httpkit.BuildRuntime(".env")
	models.Dev = runtime.Dev
	httpkit.CORSMethods("GET, POST, OPTIONS")
	rooms.StartCleanup()

	mux := http.NewServeMux()
	mux.HandleFunc("/rooms", createRoom)
	mux.HandleFunc("/rooms/", routeRooms)

	handler := httpkit.With(runtime, mux)
	host := ""
	if runtime.Dev {
		host = "0.0.0.0:8080"
	} else {
		host = runtime.Port
	}
	fmt.Println("Hosting -> " + host)
	err := http.ListenAndServe(host, handler)
	if err != nil {
		fmt.Println("SERVER ERROR:", err)
	}
}
