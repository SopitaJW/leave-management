package models

import (
	"time"

	"gorm.io/gorm"
)

// User model สำหรับผู้ใช้งาน
type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Email     string         `json:"email" gorm:"uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"not null"`
	Name      string         `json:"name" gorm:"not null"`
	Role      string         `json:"role" gorm:"default:employee"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// LeaveHistory model สำหรับประวัติการลา
type LeaveHistory struct {
	ID         uint           `json:"id" gorm:"primaryKey"`
	UserID     uint           `json:"user_id" gorm:"not null;index"`
	Type       string         `json:"type" gorm:"not null;index"`
	StartDate  string         `json:"startDate" gorm:"not null"`
	EndDate    string         `json:"endDate" gorm:"not null"`
	Days       int            `json:"days" gorm:"not null"`
	Status     string         `json:"status" gorm:"default:รออนุมัติ;index"`
	Reason     string         `json:"reason" gorm:"type:text;not null"`
	Contact    string         `json:"contact"`
	Substitute string         `json:"substitute"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// LeaveSummary สำหรับสรุปการลา
type LeaveSummary struct {
	Type      string `json:"type"`
	Used      int    `json:"used"`
	Remaining int    `json:"remaining"`
}

// LeaveRequest สำหรับรับข้อมูลคำร้องการลา
type LeaveRequest struct {
	LeaveType  string `json:"leave_type" binding:"required"`
	StartDate  string `json:"start_date" binding:"required"`
	EndDate    string `json:"end_date" binding:"required"`
	Days       int    `json:"days" binding:"required,min=1"`
	Reason     string `json:"reason" binding:"required"`
	Contact    string `json:"contact"`
	Substitute string `json:"substitute"`
}