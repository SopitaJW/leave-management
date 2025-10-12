package routes

import (
	"strings"

	"leave-system-backend/internal/config"
	"leave-system-backend/internal/handlers"
	"leave-system-backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRoutes ตั้งค่า routes ทั้งหมด
func SetupRoutes(router *gin.Engine, db *gorm.DB, cfg *config.Config) {
	// Apply CORS
	origins := strings.Split(cfg.AllowedOrigins, ",")
	router.Use(middleware.CORSMiddleware(origins))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Server is running",
		})
	})

	// Initialize handlers
	leaveHandler := handlers.NewLeaveHandler(db)

	// API routes
	api := router.Group("/api")
	{
		leave := api.Group("/leave")
		leave.Use(middleware.AuthMiddleware())
		{
			leave.GET("/summary", leaveHandler.GetLeaveSummary)
			leave.GET("/history", leaveHandler.GetLeaveHistory)
			leave.POST("/request", leaveHandler.CreateLeaveRequest)
		}
	}
}