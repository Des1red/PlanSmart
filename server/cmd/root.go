package cmd

import (
	"fmt"
	"plansmart/internal/database"
	"plansmart/internal/rooms"
	"plansmart/internal/server"
)

func Execute() {
	database.InitDb()
	if err := rooms.LoadFromDB(); err != nil {
		fmt.Println("DB restore error:", err)
	}
	server.Start()
}
