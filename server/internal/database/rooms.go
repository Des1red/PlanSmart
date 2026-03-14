package database

import "time"

type RoomRow struct {
	Code         string
	LastActivity time.Time
	Plan         []byte
}

func LoadRooms() ([]RoomRow, error) {
	rows, err := DB.Query(`
        SELECT r.code, r.last_activity, rp.plan
        FROM rooms r
        LEFT JOIN room_plans rp ON r.code = rp.code
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []RoomRow
	for rows.Next() {
		var row RoomRow
		if err := rows.Scan(&row.Code, &row.LastActivity, &row.Plan); err != nil {
			continue
		}
		result = append(result, row)
	}
	return result, rows.Err()
}

func SaveRoom(code string, plan []byte) error {
	_, err := DB.Exec(`
        INSERT INTO rooms (code, last_activity)
        VALUES (?, ?)
        ON CONFLICT(code) DO UPDATE SET last_activity = excluded.last_activity
    `, code, time.Now())
	if err != nil {
		return err
	}

	_, err = DB.Exec(`
        INSERT INTO room_plans (code, plan, saved_at)
        VALUES (?, ?, ?)
        ON CONFLICT(code) DO UPDATE SET plan = excluded.plan, saved_at = excluded.saved_at
    `, code, plan, time.Now())
	return err
}

func DeleteRoom(code string) error {
	_, err := DB.Exec(`DELETE FROM rooms WHERE code = ?`, code)
	return err
}
