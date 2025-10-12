package main

import (
	"fmt"
	"log"

	"leave-system-backend/internal/config"
	"leave-system-backend/internal/database"
	"leave-system-backend/internal/handlers"
	"leave-system-backend/internal/middleware"
	"leave-system-backend/internal/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// โหลด .env file
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  Warning: .env file not found, using environment variables")
	}

	// โหลด configuration
	cfg := config.LoadConfig()
	fmt.Println("✅ Configuration loaded successfully")

	// ตั้งค่า Gin mode
	gin.SetMode(cfg.GinMode)

	// เชื่อมต่อฐานข้อมูล
	db, err := database.ConnectDB(cfg)
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}
	fmt.Println("✅ Connected to database successfully")

	// Auto migrate
	if err := database.AutoMigrate(db); err != nil {
		log.Fatal("❌ Failed to migrate database:", err)
	}
	fmt.Println("✅ Database migration completed")

	// ตั้งค่า JWT Secret ใน middleware
	middleware.JWTSecret = []byte(cfg.JWTSecret)

	// สร้าง Gin router
	router := gin.Default()

	// Setup routes
	routes.SetupRoutes(router, db, cfg)

	// เริ่ม server
	port := ":" + cfg.Port
	fmt.Printf("\n🚀 Server running on http://localhost%s\n", port)
	fmt.Println("📚 API Documentation:")
	fmt.Println("   GET  /health             - Health check")
	fmt.Println("   GET  /api/leave/summary  - Get leave summary")
	fmt.Println("   GET  /api/leave/history  - Get leave history")
	fmt.Println("   POST /api/leave/request  - Submit leave request")
	fmt.Println("\n⌨️  Press Ctrl+C to stop the server\n")
	
	if err := router.Run(port); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
}