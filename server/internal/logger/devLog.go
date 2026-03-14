package logger

import (
	"fmt"
	"plansmart/internal/models"
)

var ServerLog = "server"
var RoomLog = "room"

func DevLog(logtype string, format string, args ...any) {
	if models.Dev {
		fmt.Printf("[%s] "+format+"\n", append([]any{logtype}, args...)...)
	}
}
