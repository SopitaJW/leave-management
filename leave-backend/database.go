// database.go
package main

import (
    "database/sql"
    "log"

    _ "github.com/jackc/pgx/v5/stdlib"
)

// InitDB khởi tạo và trả về một đối tượng kết nối cơ sở dữ liệu.
func InitDB(dataSourceName string) *sql.DB {
    db, err := sql.Open("pgx", dataSourceName)
    if err != nil {
        log.Fatalf("ไม่สามารถเปิดการเชื่อมต่อฐานข้อมูลได้: %v", err)
    }

    if err = db.Ping(); err != nil {
        log.Fatalf("ไม่สามารถเชื่อมต่อฐานข้อมูลได้: %v", err)
    }

    log.Println("🐘 เชื่อมต่อ PostgreSQL สำเร็จ!")
    return db
}