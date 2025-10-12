package config

import (
	"os"
)

type Config struct {
	// Database
	DBDriver   string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string

	// JWT
	JWTSecret string

	// Server
	Port    string
	GinMode string

	// CORS
	AllowedOrigins string
}

// LoadConfig โหลดค่า configuration จาก environment variables
func LoadConfig() *Config {
	return &Config{
		DBDriver:       getEnv("DB_DRIVER", "mysql"),
		DBHost:         getEnv("DB_HOST", "localhost"),
		DBPort:         getEnv("DB_PORT", "3306"),
		DBUser:         getEnv("DB_USER", "root"),
		DBPassword:     getEnv("DB_PASSWORD", ""),
		DBName:         getEnv("DB_NAME", "leave_system"),
		JWTSecret:      getEnv("JWT_SECRET", "default-secret-key-change-in-production"),
		Port:           getEnv("PORT", "8080"),
		GinMode:        getEnv("GIN_MODE", "debug"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173"),
	}
}

// getEnv ดึงค่าจาก environment variable ถ้าไม่มีให้ใช้ค่า default
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}