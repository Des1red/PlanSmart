package rooms

import (
	"time"
)

const roomTTL = 5 * time.Minute

func StartCleanup() {
	go func() {
		cleanupTicker := time.NewTicker(5 * time.Minute)
		snapshotTicker := time.NewTicker(2 * time.Minute)

		for {
			select {
			case <-cleanupTicker.C:
				now := time.Now()
				M.mu.Lock()
				for code, room := range M.rooms {
					room.mu.RLock()
					last := room.LastActivity
					empty := len(room.Clients) == 0
					room.mu.RUnlock()
					if empty && now.Sub(last) > roomTTL {
						delete(M.rooms, code)
						go DeleteFromDB(code)
					}
				}
				M.mu.Unlock()

			case <-snapshotTicker.C:
				M.mu.RLock()
				snapshot := make(map[string][]byte)
				for code, room := range M.rooms {
					room.mu.RLock()
					if room.Plan != nil {
						snapshot[code] = room.Plan
					}
					room.mu.RUnlock()
				}
				M.mu.RUnlock()

				for code, plan := range snapshot {
					go SaveSnapshotToDB(code, plan)
				}
			}
		}
	}()
}
