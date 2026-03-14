package rooms

import (
	"plansmart/internal/database"
	"time"
)

func LoadFromDB() error {
	rows, err := database.LoadRooms()
	if err != nil {
		return err
	}

	M.mu.Lock()
	defer M.mu.Unlock()

	for _, row := range rows {
		M.rooms[row.Code] = &Room{
			Code:         row.Code,
			Plan:         row.Plan,
			LastActivity: time.Now(),
			Clients:      make(map[*Client]bool),
		}
	}
	return nil
}

func SaveSnapshotToDB(code string, plan []byte) error {
	return database.SaveRoom(code, plan)
}

func DeleteFromDB(code string) error {
	return database.DeleteRoom(code)
}
