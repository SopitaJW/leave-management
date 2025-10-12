package handlers

import (
	"net/http"

	"leave-system-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// LeaveQuota กำหนดโควต้าการลาแต่ละประเภท
var LeaveQuotas = map[string]int{
	"sick":      30,
	"personal":  10,
	"vacation":  10,
	"maternity": 90,
}

// LeaveHandler struct
type LeaveHandler struct {
	DB *gorm.DB
}

// NewLeaveHandler สร้าง handler ใหม่
func NewLeaveHandler(db *gorm.DB) *LeaveHandler {
	return &LeaveHandler{DB: db}
}

// GetLeaveSummary - GET /api/leave/summary
func (h *LeaveHandler) GetLeaveSummary(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Unauthorized",
		})
		return
	}

	// Query การลาที่อนุมัติแล้ว
	var approvedLeaves []models.LeaveHistory
	if err := h.DB.Where("user_id = ? AND status = ?", userID, "อนุมัติ").
		Find(&approvedLeaves).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch leave data",
		})
		return
	}

	// สร้าง summary
	summaryMap := make(map[string]*models.LeaveSummary)
	for leaveType, quota := range LeaveQuotas {
		summaryMap[leaveType] = &models.LeaveSummary{
			Type:      leaveType,
			Used:      0,
			Remaining: quota,
		}
	}

	// คำนวณวันที่ใช้ไป
	for _, leave := range approvedLeaves {
		if summary, exists := summaryMap[leave.Type]; exists {
			summary.Used += leave.Days
			summary.Remaining -= leave.Days
		}
	}

	// แปลงเป็น slice
	var summaryList []models.LeaveSummary
	for _, summary := range summaryMap {
		summaryList = append(summaryList, *summary)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    summaryList,
	})
}

// GetLeaveHistory - GET /api/leave/history
func (h *LeaveHandler) GetLeaveHistory(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Unauthorized",
		})
		return
	}

	var history []models.LeaveHistory
	if err := h.DB.Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&history).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch leave history",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    history,
	})
}

// CreateLeaveRequest - POST /api/leave/request
func (h *LeaveHandler) CreateLeaveRequest(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Unauthorized",
		})
		return
	}

	var req models.LeaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data: " + err.Error(),
		})
		return
	}

	// ตรวจสอบประเภทการลา
	if _, exists := LeaveQuotas[req.LeaveType]; !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid leave type",
		})
		return
	}

	// ตรวจสอบสิทธิ์ที่เหลือ
	var approvedLeaves []models.LeaveHistory
	if err := h.DB.Where("user_id = ? AND type = ? AND status = ?",
		userID, req.LeaveType, "อนุมัติ").Find(&approvedLeaves).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to check leave quota",
		})
		return
	}

	usedDays := 0
	for _, leave := range approvedLeaves {
		usedDays += leave.Days
	}

	quota := LeaveQuotas[req.LeaveType]
	if usedDays+req.Days > quota {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Insufficient leave quota",
			"remaining": quota - usedDays,
		})
		return
	}

	// สร้างข้อมูลการลาใหม่
	newLeave := models.LeaveHistory{
		UserID:     userID.(uint),
		Type:       req.LeaveType,
		StartDate:  req.StartDate,
		EndDate:    req.EndDate,
		Days:       req.Days,
		Status:     "รออนุมัติ",
		Reason:     req.Reason,
		Contact:    req.Contact,
		Substitute: req.Substitute,
	}

	if err := h.DB.Create(&newLeave).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create leave request",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Leave request submitted successfully",
		"data":    newLeave,
	})
}