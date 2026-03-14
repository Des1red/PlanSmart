package database

import (
	"database/sql"

	"github.com/Des1red/sqlitekit/sqlitekit"
)

var DB *sql.DB

func InitDb() {

	err := sqlitekit.SetConfig(sqlitekit.Config{
		WAL:          true,
		ForeignKeys:  true,
		MaxOpenConns: 5,
		MaxIdleConns: 2,
	})

	if err != nil {
		panic(err)
	}

	err = sqlitekit.Initialize(
		"data/app.db",
		"internal/database/schema",
	)

	if err != nil {
		panic(err)
	}
	DB = sqlitekit.DB()
}
