package database

import (
	"fmt"

	"leave-system-backend/internal/config"
	"leave-system-backend/internal/models"

	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// ConnectDB เชื่อมต่อกับฐานข้อมูลตาม config
func ConnectDB(cfg *config.Config) (*gorm.DB, error) {
	var db *gorm.DB
	var err error

	// กำหนด logger
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	// เลือก driver ตาม config
	switch cfg.DBDriver {
	case "mysql":
		dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName)
		db, err = gorm.Open(mysql.Open(dsn), gormConfig)

	case "postgres":
		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort)
		db, err = gorm.Open(postgres.Open(dsn), gormConfig)

	default:
		return nil, fmt.Errorf("unsupported database driver: %s", cfg.DBDriver)
	}

	if err != nil {
		return nil, err
	}

	return db, nil
}

// AutoMigrate ทำ migration ตารางทั้งหมด
func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.LeaveHistory{},
	)
}