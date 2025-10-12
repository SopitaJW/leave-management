// main.go
package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Global DB variable
var db *sql.DB

// Models (Structs เหมือนเดิม)
type LeaveType struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Quota int    `json:"quota"`
	Color string `json:"color"`
}

type LeaveSummary struct {
	Type      string `json:"type"`      // ชนิดการลา (e.g., 'sick')
	Name      string `json:"name"`      // ชื่อภาษาไทย (e.g., 'ลาป่วย')
	Quota     int    `json:"quota"`     // จำนวนวันลาทั้งหมด
	Used      int    `json:"used"`      // จำนวนวันที่ใช้ไป
	Remaining int    `json:"remaining"` // จำนวนวันที่เหลือ
}

type LeaveRequest struct {
	ID         int       `json:"id,omitempty"`
	UserID     string    `json:"userId"`
	LeaveType  string    `json:"leaveType"`
	StartDate  string    `json:"startDate"`
	EndDate    string    `json:"endDate"`
	Days       int       `json:"days"`
	Reason     string    `json:"reason"`
	Contact    string    `json:"contact,omitempty"`
	Substitute string    `json:"substitute,omitempty"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"createdAt"`
}

type LeaveHistory struct {
	ID        int    `json:"id"`
	Type      string `json:"type"`
	TypeName  string `json:"typeName"` // เพิ่มชื่อประเภทการลา
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
	Days      int    `json:"days"`
	Status    string `json:"status"`
}

// === Handlers (ปรับปรุงใหม่ทั้งหมด) ===

// GET /api/leave/summary?userId=xxx
func GetLeaveSummary(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userId")
	if userID == "" {
		http.Error(w, "userId is required", http.StatusBadRequest)
		return
	}

	query := `
        SELECT 
            lt.id, lt.name, lt.quota, COALESCE(le.used_days, 0) as used_days
        FROM 
            leave_types lt
        LEFT JOIN 
            leave_entitlements le ON lt.id = le.leave_type_id AND le.user_id = $1
    `
	rows, err := db.Query(query, userID)
	if err != nil {
		http.Error(w, "Database query error", http.StatusInternalServerError)
		log.Printf("Error querying leave summary: %v", err)
		return
	}
	defer rows.Close()

	var summaries []LeaveSummary
	for rows.Next() {
		var summary LeaveSummary
		var used int
		if err := rows.Scan(&summary.Type, &summary.Name, &summary.Quota, &used); err != nil {
			http.Error(w, "Database scan error", http.StatusInternalServerError)
			log.Printf("Error scanning leave summary row: %v", err)
			return
		}
		summary.Used = used
		summary.Remaining = summary.Quota - used
		summaries = append(summaries, summary)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data":    summaries,
	})
}

// POST /api/leave/request
func CreateLeaveRequest(w http.ResponseWriter, r *http.Request) {
	var req LeaveRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// ... (ส่วน Validation และคำนวณ `days` เหมือนเดิม) ...

	// === Database Transaction: ตรวจสอบโควต้า, เพิ่มคำขอ, อัปเดตสิทธิ์ ===
	tx, err := db.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback() // Rollback หากมี error

	// 1. ตรวจสอบโควต้าที่เหลือ
	var quota, used_days int
	err = tx.QueryRow(`SELECT quota FROM leave_types WHERE id = $1`, req.LeaveType).Scan(&quota)
	if err != nil {
		http.Error(w, "Invalid leave type", http.StatusBadRequest)
		return
	}
	// FOR UPDATE เพื่อ lock row ป้องกัน race condition
	err = tx.QueryRow(`
        SELECT used_days FROM leave_entitlements 
        WHERE user_id = $1 AND leave_type_id = $2 FOR UPDATE`,
		req.UserID, req.LeaveType).Scan(&used_days)

	if err != nil && err != sql.ErrNoRows {
		http.Error(w, "Database error checking quota", http.StatusInternalServerError)
		return
	}

	if (quota - used_days) < req.Days {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "ไม่มีสิทธิ์การลาเพียงพอ"})
		return
	}

	// 2. เพิ่มคำร้องขอลา
	req.Status = "รออนุมัติ"
	req.CreatedAt = time.Now()
	insertQuery := `
        INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, days, reason, contact, substitute, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
    `
	err = tx.QueryRow(insertQuery, req.UserID, req.LeaveType, req.StartDate, req.EndDate, req.Days, req.Reason, req.Contact, req.Substitute, req.Status, req.CreatedAt).Scan(&req.ID)
	if err != nil {
		http.Error(w, "Failed to create leave request", http.StatusInternalServerError)
		log.Printf("Insert error: %v", err)
		return
	}

	// 3. อัปเดตสิทธิ์การลา (UPSERT: Update or Insert)
	updateQuery := `
        INSERT INTO leave_entitlements (user_id, leave_type_id, used_days)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, leave_type_id)
        DO UPDATE SET used_days = leave_entitlements.used_days + $3;
    `
	_, err = tx.Exec(updateQuery, req.UserID, req.LeaveType, req.Days)
	if err != nil {
		http.Error(w, "Failed to update leave entitlement", http.StatusInternalServerError)
		log.Printf("Update entitlement error: %v", err)
		return
	}

	// 4. Commit Transaction
	if err := tx.Commit(); err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "message": "ส่งคำร้องการลาเรียบร้อยแล้ว", "data": req})
}

// GET /api/leave/history?userId=xxx&type=xxx
func GetLeaveHistory(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userId")
	leaveType := r.URL.Query().Get("type")
	if userID == "" {
		http.Error(w, "userId is required", http.StatusBadRequest)
		return
	}

	query := `
        SELECT lr.id, lr.leave_type_id, lt.name, lr.start_date, lr.end_date, lr.days, lr.status
        FROM leave_requests lr
        JOIN leave_types lt ON lr.leave_type_id = lt.id
        WHERE lr.user_id = $1
    `
	args := []interface{}{userID}
	if leaveType != "" && leaveType != "all" {
		query += " AND lr.leave_type_id = $" + strconv.Itoa(len(args)+1)
		args = append(args, leaveType)
	}
	query += " ORDER BY lr.created_at DESC"

	rows, err := db.Query(query, args...)
	if err != nil {
		http.Error(w, "Database query error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var history []LeaveHistory
	for rows.Next() {
		var h LeaveHistory
		if err := rows.Scan(&h.ID, &h.Type, &h.TypeName, &h.StartDate, &h.EndDate, &h.Days, &h.Status); err != nil {
			http.Error(w, "Database scan error", http.StatusInternalServerError)
			return
		}
		history = append(history, h)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "data": history})
}

// GET /api/leave/types
func GetLeaveTypes(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, quota, color FROM leave_types")
	if err != nil {
		http.Error(w, "Database query error", http.StatusInternalServerError)
		log.Printf("Error querying leave types: %v", err)
		return
	}
	defer rows.Close()

	var types []LeaveType
	for rows.Next() {
		var t LeaveType
		if err := rows.Scan(&t.ID, &t.Name, &t.Quota, &t.Color); err != nil {
			http.Error(w, "Database scan error", http.StatusInternalServerError)
			log.Printf("Error scanning leave type row: %v", err)
			return
		}
		types = append(types, t)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "data": types})
}

func main() {
	// === เชื่อมต่อ Database ===
	// **สำคัญ**: เปลี่ยนค่า DSN ให้ถูกต้องสำหรับเครื่องของคุณ
	dsn := "postgres://your_user:your_password@localhost:5432/your_db?sslmode=disable"
	db = InitDB(dsn) // เรียกใช้ฟังก์ชันจาก database.go

	router := mux.NewRouter()

	// Routes (เหมือนเดิม)
	router.HandleFunc("/api/leave/summary", GetLeaveSummary).Methods("GET")
	router.HandleFunc("/api/leave/request", CreateLeaveRequest).Methods("POST")
	router.HandleFunc("/api/leave/history", GetLeaveHistory).Methods("GET")
	router.HandleFunc("/api/leave/types", GetLeaveTypes).Methods("GET")

	// CORS (เหมือนเดิม)
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})
	handler := c.Handler(router)

	log.Println("🚀 Server starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}